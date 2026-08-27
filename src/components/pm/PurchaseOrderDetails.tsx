"use client";

import Link from "next/link";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { getAuthData, getToken } from "@/lib/auth";
import { useParams, useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Download, FileText, ShieldCheck } from "lucide-react";
import Related from "@/components/Requests/ViewEditRequest/Related";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type PopulatedUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

type PopulatedVendor = {
  _id: string;
  name?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
};

type PopulatedLocation = {
  _id: string;
  name?: string;
  address?: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
};

type PurchaseOrderItem = {
  _id?: string;
  itemDescription: string;
  quantity: number;
  uom: string;
  brand?: string;
  unitPrice: number;
  totalPrice: number;
};

type PurchaseOrderApproval = {
  approver?: PopulatedUser;
  approverRole: "hof" | "hhr";
  approvedAt?: string;
  feedback?: string;
};

type PurchaseOrder = {
  _id: string;
  poNumber?: string;
  title?: string;
  status: string;
  requisition?: {
    _id: string;
    title?: string;
    requisitionNumber?: string;
  };
  rfq?: {
    _id: string;
    rfqNumber?: string;
  };
  vendor?: PopulatedVendor;
  deliveryLocation?: PopulatedLocation;
  deliveryContact?: PopulatedUser;
  createdBy?: PopulatedUser;
  submittedBy?: PopulatedUser;
  submittedAt?: string;
  deliveryDate?: string;
  shipping?: string;
  generalTerms?: string;
  evaluationCriteria?: string;
  termsOfService?: string;
  paymentTerms?: string;
  totalAmount?: number;
  items?: PurchaseOrderItem[];
  approvals?: PurchaseOrderApproval[];
  pdfUrl?: string;
  createdAt?: string;
  related?: {
    requests?: { _id: string; title: string; department: string }[];
    rfqs?: { _id: string; title: string; department: string }[];
    pos?: { _id: string; title: string; department: string }[];
  };
};

export default function PurchaseOrderDetails() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const authData = getAuthData();
  const token = getToken();
  const poId = params.poId as string;
  const basePath = `/${pathname.split("/")[1]}`;
  const isHhra =
    authData?.user?.role === "departmentHead" &&
    authData?.user?.designation === "Head, Human Resources & Admin";
  const isHof =
    authData?.user?.role === "departmentHead" &&
    authData?.user?.designation === "Head, Finance";
  const isPm = authData?.user?.role === "procurementManager";

  const [loading, setLoading] = useState(true);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [approving, setApproving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingQuote, setDownloadingQuote] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<"hhr" | "hof" | null>(
    null,
  );

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      if (!poId) {
        router.back();
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/purchase-orders/${poId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();

        if (data.success) {
          setPurchaseOrder(data.data);
        } else {
          toast.error(data.message || "Failed to fetch purchase order");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching purchase order:", error);
        toast.error("Failed to fetch purchase order");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, [poId, router]);

  const handleDownloadPO = async () => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchase-orders/${poId}/pdf`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) throw new Error("Failed to download PO");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PO-${purchaseOrder?.poNumber || poId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Purchase order downloaded successfully");
    } catch (error) {
      console.error("Error downloading PO:", error);
      toast.error("Failed to download purchase order");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadVendorQuote = async () => {
    if (!purchaseOrder?.rfq?._id || !purchaseOrder?.vendor?._id) return;
    setDownloadingQuote(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/rfqs/${purchaseOrder.rfq._id}/download?vendorIds=${purchaseOrder.vendor._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) throw new Error("Failed to download vendor quote");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vendor-quote-${purchaseOrder.rfq?.rfqNumber || purchaseOrder.rfq._id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Vendor quote downloaded successfully");
    } catch (error) {
      console.error("Error downloading vendor quote:", error);
      toast.error("Failed to download vendor quote");
    } finally {
      setDownloadingQuote(false);
    }
  };

  const handleApprove = async (approvalType: "hhr" | "hof") => {
    if (!purchaseOrder) return;
    setApproving(true);
    try {
      const endpoint =
        approvalType === "hof"
          ? `${API_BASE_URL}/purchase-orders/${purchaseOrder._id}/hof-approve`
          : `${API_BASE_URL}/purchase-orders/${purchaseOrder._id}/hhr-approve`;
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Purchase order approved");
        setPurchaseOrder((prev) =>
          prev
            ? {
                ...prev,
                status:
                  data.data?.status ??
                  (approvalType === "hof" ? "hofApproved" : "approved"),
              }
            : prev,
        );
      } else {
        toast.error(data.message || "Failed to approve purchase order");
      }
    } catch (error) {
      console.error("Error approving purchase order:", error);
      toast.error("Failed to approve purchase order");
    } finally {
      setApproving(false);
    }
  };

  const handleRelatedView = (
    item: { _id: string },
    type: "request" | "rfq" | "po",
  ) => {
    if (type === "request") {
      router.push(`${basePath}/requisitions/${item._id}`);
      return;
    }
    if (type === "rfq") {
      router.push(`${basePath}/rfqs/${item._id}`);
      return;
    }
    router.push(`${basePath}/pos/${item._id}`);
  };

  const formatMoney = (value?: number) => {
    if (typeof value !== "number") return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-8">
        <div className="flex items-center justify-center py-10 text-gray-600">
          Loading purchase order...
        </div>
      </div>
    );
  }

  if (!purchaseOrder) {
    return null;
  }

  const approvals = purchaseOrder.approvals || [];
  const canHofApprove =
    purchaseOrder.status === "issued" || purchaseOrder.status === "submitted";
  const canHhraApprove = purchaseOrder.status === "hofApproved";

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-6 md:py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-900 text-blue-900 hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                Purchase Order
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">
                {purchaseOrder.title?.trim() || "Untitled Purchase Order"}
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-600">
                {purchaseOrder.poNumber || "No PO Number"}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {isHof
                  ? "Review the purchase order and provide finance approval."
                  : isHhra
                    ? "Review the purchase order and approve it for PM processing."
                    : "Review purchase order details."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Overview
            </p>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {purchaseOrder.status}
              </p>
              <p>
                <span className="font-semibold">Requisition:</span>{" "}
                {purchaseOrder.requisition?.requisitionNumber ||
                  purchaseOrder.requisition?.title ||
                  "N/A"}
              </p>
              <p>
                <span className="font-semibold">RFQ:</span>{" "}
                {purchaseOrder.rfq?.rfqNumber || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Created By:</span>{" "}
                {purchaseOrder.createdBy
                  ? `${purchaseOrder.createdBy.firstName || ""} ${
                      purchaseOrder.createdBy.lastName || ""
                    }`.trim()
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">Submitted:</span>{" "}
                {formatDate(purchaseOrder.submittedAt)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Vendor and Delivery
            </p>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Vendor:</span>{" "}
                {purchaseOrder.vendor?.name || "N/A"}
              </p>
              {purchaseOrder.vendor?.contactPerson && (
                <p>
                  <span className="font-semibold">Contact Person:</span>{" "}
                  {purchaseOrder.vendor.contactPerson}
                </p>
              )}
              {purchaseOrder.vendor?.phone && (
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {purchaseOrder.vendor.phone}
                </p>
              )}
              {purchaseOrder.vendor?.email && (
                <p>
                  <span className="font-semibold">Vendor Email:</span>{" "}
                  {purchaseOrder.vendor.email}
                </p>
              )}
              {purchaseOrder.vendor?.address && (
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {purchaseOrder.vendor.address}
                </p>
              )}
              <p>
                <span className="font-semibold">Delivery Location:</span>{" "}
                {purchaseOrder.deliveryLocation?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Delivery Date:</span>{" "}
                {formatDate(purchaseOrder.deliveryDate)}
              </p>
              <p>
                <span className="font-semibold">Shipping:</span>{" "}
                {purchaseOrder.shipping || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Delivery Contact:</span>{" "}
                {purchaseOrder.deliveryContact
                  ? `${purchaseOrder.deliveryContact.firstName || ""} ${
                      purchaseOrder.deliveryContact.lastName || ""
                    }`.trim()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Financials
            </p>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Total Amount:</span>{" "}
                {formatMoney(purchaseOrder.totalAmount)}
              </p>
              <p>
                <span className="font-semibold">Payment Terms:</span>{" "}
                {purchaseOrder.paymentTerms || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Terms of Service:</span>{" "}
                {purchaseOrder.termsOfService || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Evaluation Criteria:</span>{" "}
                {purchaseOrder.evaluationCriteria || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Items
                </p>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">
                  Purchase Order Line Items
                </h2>
              </div>
              {purchaseOrder.pdfUrl && (
                <Link
                  href={purchaseOrder.pdfUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Link>
              )}
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3 pr-4 font-medium">Description</th>
                    <th className="py-3 pr-4 font-medium">Brand</th>
                    <th className="py-3 pr-4 font-medium">Qty</th>
                    <th className="py-3 pr-4 font-medium">UOM</th>
                    <th className="py-3 pr-4 font-medium">Unit Price</th>
                    <th className="py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(purchaseOrder.items || []).map((item, index) => (
                    <tr
                      key={item._id || `${item.itemDescription}-${index}`}
                      className="border-b border-gray-100"
                    >
                      <td className="py-4 pr-4 text-gray-800">
                        {item.itemDescription || "N/A"}
                      </td>
                      <td className="py-4 pr-4 text-gray-700">
                        {item.brand || "N/A"}
                      </td>
                      <td className="py-4 pr-4 text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-4 pr-4 text-gray-700">{item.uom}</td>
                      <td className="py-4 pr-4 text-gray-700">
                        {formatMoney(item.unitPrice)}
                      </td>
                      <td className="py-4 font-medium text-gray-900">
                        {formatMoney(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                  {(purchaseOrder.items || []).length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-gray-500"
                      >
                        No purchase order items available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Approval Trail
            </p>
            <div className="mt-4 space-y-4">
              {approvals.length > 0 ? (
                approvals.map((approval, index) => (
                  <div
                    key={`${approval.approverRole}-${index}`}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      {approval.approverRole === "hof"
                        ? "Head of Finance"
                        : "Head of Human Resources"}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      {approval.approver
                        ? `${approval.approver.firstName || ""} ${approval.approver.lastName || ""}`.trim()
                        : "Approver"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(approval.approvedAt)}
                    </p>
                    {approval.feedback && (
                      <p className="mt-2 text-sm text-gray-600">
                        {approval.feedback}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  No approvals recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {purchaseOrder.related &&
          (purchaseOrder.related.requests?.length ?? 0) +
            (purchaseOrder.related.rfqs?.length ?? 0) +
            (purchaseOrder.related.pos?.length ?? 0) >
            0 && (
            <Related
              requests={purchaseOrder.related.requests || []}
              rfqs={purchaseOrder.related.rfqs || []}
              pos={purchaseOrder.related.pos || []}
              onViewItem={handleRelatedView}
            />
          )}

        {isHof && canHofApprove && (
          <button
            disabled={approving}
            onClick={() => setPendingApproval("hof")}
            className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            Approve PO
          </button>
        )}
        {isHhra && canHhraApprove && (
          <button
            disabled={approving}
            onClick={() => setPendingApproval("hhr")}
            className="rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            Approve PO
          </button>
        )}

        <Dialog
          open={pendingApproval !== null}
          onOpenChange={(open) => {
            if (!open) setPendingApproval(null);
          }}
        >
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Confirm Approval</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              Are you sure you want to approve this purchase order? This action
              cannot be undone.
            </p>
            <DialogFooter className="gap-2">
              <button
                onClick={() => setPendingApproval(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={approving}
                onClick={async () => {
                  if (!pendingApproval) return;
                  await handleApprove(pendingApproval);
                  setPendingApproval(null);
                }}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {approving ? "Approving..." : "Yes, Approve"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isPm && (
          <div className="flex gap-3">
            <button
              onClick={handleDownloadVendorQuote}
              disabled={
                downloadingQuote ||
                !purchaseOrder?.rfq?._id ||
                !purchaseOrder?.vendor?._id
              }
              className="rounded-md border border-blue-900 px-5 py-3 text-sm font-semibold text-blue-900 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadingQuote ? "Downloading..." : "Download Vendor Quote"}
            </button>
            <button
              onClick={handleDownloadPO}
              disabled={downloading}
              className="rounded-md bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloading ? "Downloading..." : "Download PO"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
