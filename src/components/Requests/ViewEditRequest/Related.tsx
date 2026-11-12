"use client";

import { useState } from "react";
import { Eye, Download, Star, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import StatusBadge from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RelatedItem {
  _id: string;
  title: string;
  department: string;
}

export interface GRNRecord {
  _id: string;
  grnNumber: string;
  receivingEmployee: string | { firstName?: string; lastName?: string };
  status: string;
  createdAt: string;
  items: Array<{ deliveredQty: number }>;
}

export interface JCFRecord {
  _id: string;
  jcfNumber: string;
  receivingEmployee: string | { firstName?: string; lastName?: string };
  status: string;
  createdAt: string;
  items: Array<{ deliveredQty?: number }>;
}

type ActionType = "approve-grn" | "reject-grn" | "approve-jcf" | "reject-jcf" | null;

interface RelatedTabsProps {
  requests?: RelatedItem[];
  rfqs?: RelatedItem[];
  pos?: RelatedItem[];
  grns?: GRNRecord[];
  jcfs?: JCFRecord[];
  defaultTab?: "request" | "rfq" | "po" | "grn" | "jcf";
  onViewItem: (item: RelatedItem, type: "request" | "rfq" | "po") => void;
  onDownloadGRN?: (grn: GRNRecord) => void;
  onDownloadJCF?: (jcf: JCFRecord) => void;
  userRole?: string;
  userId?: string;
  requesterId?: string;
  onApproveGRN?: (grn: GRNRecord) => Promise<void>;
  onRejectGRN?: (grn: GRNRecord, comments: string) => Promise<void>;
  onApproveJCF?: (jcf: JCFRecord, rating: number, comments: string) => Promise<void>;
  onRejectJCF?: (jcf: JCFRecord, comments: string) => Promise<void>;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function employeeName(
  emp: GRNRecord["receivingEmployee"] | JCFRecord["receivingEmployee"],
): string {
  if (!emp) return "—";
  if (typeof emp === "string") return emp;
  return [emp.firstName, emp.lastName].filter(Boolean).join(" ") || "—";
}

function totalDelivered(grn: GRNRecord): number {
  return (grn.items || []).reduce((sum, i) => sum + (i?.deliveredQty ?? 0), 0);
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              n <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-600 self-center">{value} / 5</span>
      )}
    </div>
  );
}

export default function Related({
  requests = [],
  rfqs = [],
  pos = [],
  grns,
  jcfs,
  defaultTab,
  onViewItem,
  onDownloadGRN,
  onDownloadJCF,
  userRole = "",
  userId = "",
  requesterId = "",
  onApproveGRN,
  onRejectGRN,
  onApproveJCF,
  onRejectJCF,
}: RelatedTabsProps) {
  const hasGRNs = Array.isArray(grns);
  const hasJCFs = Array.isArray(jcfs);

  const initialTab =
    defaultTab ?? (hasJCFs ? "jcf" : hasGRNs ? "grn" : "request");

  const [activeTab, setActiveTab] = useState<"request" | "rfq" | "po" | "grn" | "jcf">(
    initialTab as "request" | "rfq" | "po" | "grn" | "jcf",
  );

  // ── Action dialog state ──────────────────────────────────────────────────────
  const [actionType, setActionType] = useState<ActionType>(null);
  const [selectedGRN, setSelectedGRN] = useState<GRNRecord | null>(null);
  const [selectedJCF, setSelectedJCF] = useState<JCFRecord | null>(null);
  const [actionComments, setActionComments] = useState("");
  const [jcfRating, setJcfRating] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const openGRNAction = (grn: GRNRecord, type: "approve-grn" | "reject-grn") => {
    setSelectedGRN(grn);
    setActionType(type);
    setActionComments("");
  };

  const openJCFAction = (jcf: JCFRecord, type: "approve-jcf" | "reject-jcf") => {
    setSelectedJCF(jcf);
    setActionType(type);
    setActionComments("");
    setJcfRating(0);
  };

  const closeActionDialog = () => {
    setActionType(null);
    setSelectedGRN(null);
    setSelectedJCF(null);
    setActionComments("");
    setJcfRating(0);
  };

  const handleActionSubmit = async () => {
    setActionLoading(true);
    try {
      if (actionType === "approve-grn" && selectedGRN) {
        await onApproveGRN?.(selectedGRN);
      } else if (actionType === "reject-grn" && selectedGRN) {
        await onRejectGRN?.(selectedGRN, actionComments);
      } else if (actionType === "approve-jcf" && selectedJCF) {
        await onApproveJCF?.(selectedJCF, jcfRating, actionComments);
      } else if (actionType === "reject-jcf" && selectedJCF) {
        await onRejectJCF?.(selectedJCF, actionComments);
      }
      closeActionDialog();
    } finally {
      setActionLoading(false);
    }
  };

  // ── Role-based action eligibility ────────────────────────────────────────────
  const isPM =
    userRole === "procurementManager" ||
    userRole === "admin" ||
    userRole === "superAdmin";
  const isHOD =
    userRole === "departmentHead" ||
    userRole === "admin" ||
    userRole === "superAdmin";
  const isRequester =
    !userId || !requesterId
      ? userRole === "admin" || userRole === "superAdmin"
      : userId === requesterId ||
        userRole === "admin" ||
        userRole === "superAdmin";

  function grnActionsForRole(grn: GRNRecord): {
    canApprove: boolean;
    canReject: boolean;
    approveLabel: string;
  } {
    if (
      isPM &&
      (grn.status === "pending" || grn.status === "pendingPmApproval")
    ) {
      return { canApprove: true, canReject: true, approveLabel: "Approve" };
    }
    if (
      isHOD &&
      (grn.status === "pmApproved" || grn.status === "pendingHodApproval")
    ) {
      return { canApprove: true, canReject: true, approveLabel: "Approve" };
    }
    if (
      isRequester &&
      (grn.status === "hodApproved" ||
        grn.status === "pendingRequesterApproval")
    ) {
      return {
        canApprove: true,
        canReject: true,
        approveLabel: "Confirm Receipt",
      };
    }
    return { canApprove: false, canReject: false, approveLabel: "Approve" };
  }

  function jcfActionsForRole(jcf: JCFRecord): boolean {
    const actionable =
      jcf.status === "pending" ||
      jcf.status === "submitted" ||
      jcf.status === "pendingApproval";
    return actionable && (isRequester || isHOD || isPM);
  }

  // ── Dialog config ────────────────────────────────────────────────────────────
  const isApprove = actionType === "approve-grn" || actionType === "approve-jcf";
  const isJCFApprove = actionType === "approve-jcf";
  const isReject = actionType === "reject-grn" || actionType === "reject-jcf";
  const recordNumber =
    selectedGRN?.grnNumber ?? selectedJCF?.jcfNumber ?? "";
  const recordType = selectedGRN ? "GRN" : "JCF";
  const dialogTitle = isApprove
    ? actionType === "approve-grn" && isRequester
      ? "Confirm Receipt"
      : `Approve ${recordType}`
    : `Reject ${recordType}`;
  const submitLabel = isApprove
    ? actionType === "approve-grn" && isRequester
      ? "Confirm Receipt"
      : "Approve"
    : "Reject";
  const submitDisabled =
    actionLoading ||
    (isReject && !actionComments.trim()) ||
    (isJCFApprove && jcfRating === 0);

  const tabs = [
    { id: "request" as const, label: "REQUEST", data: requests },
    { id: "rfq" as const, label: "RFQs", data: rfqs },
    { id: "po" as const, label: "POs", data: pos },
    ...(hasGRNs ? [{ id: "grn" as const, label: "GRNs", data: grns }] : []),
    ...(hasJCFs ? [{ id: "jcf" as const, label: "JCFs", data: jcfs }] : []),
  ];

  const activeData =
    activeTab === "grn"
      ? (grns ?? [])
      : activeTab === "jcf"
        ? (jcfs ?? [])
        : tabs.find((t) => t.id === activeTab)?.data ?? [];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-6">Related</h2>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-lg font-semibold transition-colors relative ${
              activeTab === tab.id
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F1E7A]" />
            )}
          </button>
        ))}
      </div>

      {/* GRNs table */}
      {activeTab === "grn" && (
        <>
          {(grns ?? []).length === 0 ? (
            <div className="text-center py-12 text-gray-500">No GRNs found</div>
          ) : (
            <div className="bg-white rounded-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-semibold">S/N</TableHead>
                    <TableHead className="text-base font-semibold">
                      Receiving Employee
                    </TableHead>
                    <TableHead className="text-base font-semibold">Status</TableHead>
                    <TableHead className="text-base font-semibold">
                      Submitted Date
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Delivered Qty
                    </TableHead>
                    <TableHead className="text-base font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(grns ?? []).map((grn) => {
                    const { canApprove, canReject, approveLabel } = grnActionsForRole(grn);
                    return (
                      <TableRow key={grn._id}>
                        <TableCell className="text-base font-medium">
                          {grn.grnNumber}
                        </TableCell>
                        <TableCell className="text-base">
                          {employeeName(grn.receivingEmployee)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={grn.status} />
                        </TableCell>
                        <TableCell className="text-base">
                          {formatDate(grn.createdAt)}
                        </TableCell>
                        <TableCell className="text-base">
                          {totalDelivered(grn)} items
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {canApprove && (
                              <Button
                                size="sm"
                                onClick={() => openGRNAction(grn, "approve-grn")}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs"
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                {approveLabel}
                              </Button>
                            )}
                            {canReject && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openGRNAction(grn, "reject-grn")}
                                className="border-red-500 text-red-600 hover:bg-red-50 px-3 py-1.5 text-xs"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => onDownloadGRN?.(grn)}
                              className="bg-[#0F1E7A] text-white hover:bg-[#0a1555] px-3 py-1.5 text-xs"
                            >
                              <Download className="w-3.5 h-3.5 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* JCFs table */}
      {activeTab === "jcf" && (
        <>
          {(jcfs ?? []).length === 0 ? (
            <div className="text-center py-12 text-gray-500">No JCFs found</div>
          ) : (
            <div className="bg-white rounded-xl overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-semibold">S/N</TableHead>
                    <TableHead className="text-base font-semibold">
                      Receiving Employee
                    </TableHead>
                    <TableHead className="text-base font-semibold">Status</TableHead>
                    <TableHead className="text-base font-semibold">
                      Submitted Date
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Items
                    </TableHead>
                    <TableHead className="text-base font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(jcfs ?? []).map((jcf) => {
                    const canAct = jcfActionsForRole(jcf);
                    return (
                      <TableRow key={jcf._id}>
                        <TableCell className="text-base font-medium">
                          {jcf.jcfNumber}
                        </TableCell>
                        <TableCell className="text-base">
                          {employeeName(jcf.receivingEmployee)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={jcf.status} />
                        </TableCell>
                        <TableCell className="text-base">
                          {formatDate(jcf.createdAt)}
                        </TableCell>
                        <TableCell className="text-base">
                          {(jcf.items || []).length} item{(jcf.items || []).length !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {canAct && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => openJCFAction(jcf, "approve-jcf")}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openJCFAction(jcf, "reject-jcf")}
                                  className="border-red-500 text-red-600 hover:bg-red-50 px-3 py-1.5 text-xs"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              onClick={() => onDownloadJCF?.(jcf)}
                              className="bg-[#0F1E7A] text-white hover:bg-[#0a1555] px-3 py-1.5 text-xs"
                            >
                              <Download className="w-3.5 h-3.5 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Standard REQUEST / RFQ / PO tables */}
      {activeTab !== "grn" && activeTab !== "jcf" && (
        <>
          {activeData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} found
            </div>
          ) : (
            <div className="bg-white rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-semibold">
                      {activeTab === "request"
                        ? "Request Title"
                        : activeTab === "rfq"
                        ? "RFQ Title"
                        : "PO Title"}
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      Department
                    </TableHead>
                    <TableHead className="text-base font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(activeData as RelatedItem[]).map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="text-base">{item.title}</TableCell>
                      <TableCell className="text-base">{item.department}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            onViewItem(item, activeTab as "request" | "rfq" | "po")
                          }
                          className="bg-[#0F1E7A] text-white hover:bg-[#0a1555] px-8 py-2 rounded-lg"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* ── Approve / Reject confirmation dialog ───────────────────────────────── */}
      <Dialog open={!!actionType} onOpenChange={() => !actionLoading && closeActionDialog()}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-bold ${
                isReject ? "text-red-600" : "text-gray-900"
              }`}
            >
              {dialogTitle}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              {recordType}: <span className="font-semibold text-gray-700">{recordNumber}</span>
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Star rating — JCF approve only */}
            {isJCFApprove && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Service Rating <span className="text-red-500">*</span>
                </label>
                <StarRating value={jcfRating} onChange={setJcfRating} />
                {jcfRating === 0 && (
                  <p className="text-xs text-gray-400">Select a rating to continue</p>
                )}
              </div>
            )}

            {/* Comments */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {isReject ? (
                  <>Comments <span className="text-red-500">*</span></>
                ) : (
                  "Comments (optional)"
                )}
              </label>
              <Textarea
                value={actionComments}
                onChange={(e) => setActionComments(e.target.value)}
                placeholder={
                  isReject
                    ? "Explain the reason for rejection..."
                    : "Add any notes about this approval..."
                }
                className="min-h-[100px] bg-white resize-none"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={closeActionDialog}
              disabled={actionLoading}
              className="flex-1 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleActionSubmit}
              disabled={submitDisabled}
              className={`flex-1 text-white ${
                isReject
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {actionLoading ? `${submitLabel}ing...` : submitLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
