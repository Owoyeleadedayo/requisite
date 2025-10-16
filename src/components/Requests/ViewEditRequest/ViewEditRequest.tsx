"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlarmClock, ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { getToken, getUser } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Comments from "@/components/CommentsUI";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface RequestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  quantityNeeded: number;
  estimatedUnitPrice: number;
  justification: string;
  requisitionNumber: string;
  image: string;
  priority: "low" | "medium" | "high";
  attachment?: string;
  requester?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  department?: {
    _id: string;
    name: string;
    code: string;
  };
  status?: string;
  selectedVendors?: string[];
  paymentStatus?: string;
  paymentAmount?: number;
  approvals?: {
    stage: string;
    approver: string;
    status: string;
    timestamp: string;
    _id: string;
  }[];
  shortlistedVendors?: string[];
  deadlineExtensions?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ViewEditRequestProps {
  requisitionId: string;
  userType: "user" | "hod" | "hhra" | "procurementManager" | "vendor";
  isEditMode: boolean;
  onEditModeChange: (mode: boolean) => void;
}

export default function ViewEditRequest({
  requisitionId,
  userType,
  isEditMode,
  onEditModeChange,
}: ViewEditRequestProps) {
  const router = useRouter();
  const token = getToken();
  const user = getUser();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState<RequestData>({
    _id: "",
    title: "",
    description: "",
    category: "",
    quantityNeeded: 0,
    estimatedUnitPrice: 0,
    justification: "",
    requisitionNumber: "",
    image: "",
    priority: "medium",
    attachment: "",
    requester: { _id: "", firstName: "", lastName: "", email: "" },
    department: { _id: "", name: "", code: "" },
    status: "",
  });

  const [urgency, setUrgency] = useState([1]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDenialModal, setShowDenialModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [denialReason, setDenialReason] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);

  const priorityMap: Record<number, RequestData["priority"]> = {
    0: "low",
    1: "medium",
    2: "high",
  };

  const backPath =
    userType === "hod"
      ? "/hod/requisitions"
      : userType === "procurementManager"
      ? "/pm/requests"
      : "/user/requisition";

  useEffect(() => {
    const reversePriorityMap: Record<RequestData["priority"], number> = {
      low: 0,
      medium: 1,
      high: 2,
    };

    const fetchRequest = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/requisitions/${requisitionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (data.success) {
          const req = data.data;
          setFormData(req);
          const priority = req.priority as RequestData["priority"];
          setUrgency([reversePriorityMap[priority]]);
        } else setNotFound(true);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      }
    };
    fetchRequest();
  }, [requisitionId, token]);

  const handleChange = (field: keyof RequestData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/requisitions/${requisitionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          priority: priorityMap[urgency[0]],
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Request updated successfully!");
        onEditModeChange(false);
      } else {
        toast.error(data.message || "Failed to update request");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/requisitions/${requisitionId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: cancelReason }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Request cancelled successfully");
        router.push(backPath);
      } else {
        toast.error(data.message || "Failed to cancel request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error cancelling request");
    } finally {
      setShowCancelModal(false);
      setCancelReason("");
    }
  };

  const handleApproval = async () => {
    setApprovalLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/requisitions/${requisitionId}/department-approval`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "approved",
            comments: approvalComment.trim() || "Approved for procurement",
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Request approved successfully");
        setFormData(data.data);
        setShowApprovalModal(false);
      } else {
        toast.error(data.message || "Failed to approve request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error approving request");
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleDenial = async () => {
    if (!denialReason.trim()) {
      toast.error("Please provide a reason for denial");
      return;
    }

    setApprovalLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/requisitions/${requisitionId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: denialReason }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Request denied successfully");
        setFormData(data.data);
        setShowDenialModal(false);
      } else {
        toast.error(data.message || "Failed to deny request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error denying request");
    } finally {
      setApprovalLoading(false);
      setDenialReason("");
    }
  };

  if (notFound)
    return (
      <div className="w-full flex flex-col justify-center items-center h-[80vh] text-center">
        <h2 className="text-2xl font-bold text-[#0F1E7A] mb-4">
          Request Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The request you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-[#0F1E7A] hover:bg-[#0b154b] text-white px-6 py-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );

  const isValidImageUrl = (url: string) => {
    return url && /\.(png|jpe?g|svg)(\?.*)?$/i.test(url);
  };

  if (!formData._id)
    return (
      <div className="w-full flex justify-center items-center h-[80vh] text-gray-500">
        <div className="flex gap-2 items-center">
          <Loader2 className="animate-spin" />
          <p>Loading request details...</p>
        </div>
      </div>
    );

  return (
    <div className="pt-8 pb-16 px-4 lg:px-12">
      <div className="w-full flex items-center mb-12">
        <Link
          href={backPath}
          className="flex items-center gap-2 text-[#0d1b5e] hover:underline border rounded-full p-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E7A] mb-6">
        {isEditMode ? "Update Request" : "View Request"} -{" "}
        {formData.requisitionNumber}
      </h1>

      <div className="w-full flex flex-col lg:flex-row gap-6 container">
        <div className="w-full lg:w-1/2 flex flex-col pb-16">
          <div className="request bg-white w-full space-y-5 rounded-md shadow-md">
            <div className="flex justify-between items-center px-4 my-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F6B40E]" />
                <p className="text-sm text-[#F6B40E] font-medium">
                  Active Bids
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-white border border-[#0F1E7A] text-[#0F1E7A] font-medium">
                  IT Dept
                </Badge>
                <Badge className="bg-white border border-[#0F1E7A] text-[#0F1E7A] font-medium">
                  General
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 my-3 px-4">
              <AlarmClock color="#0F1E7A" />
              <p className="text-base text-[#0F1E7A] font-normal">
                Ending in <span className="font-semibold">10</span> days
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  fill
                  alt="Request Image"
                  // src={isValidImageUrl(formData.image) ? formData.image : "/no-image.svg"}
                  src={"/no-image.svg"}
                  className="object-cover relative"
                  onError={(e) => {
                    e.currentTarget.src = "/no-image.svg";
                  }}
                />

                {/* Requests status */}
                {formData.status && (
                  <div className="status-badge absolute top-5 right-1 z-[5]">
                    <span
                      className={`p-5 text-sm font-semibold text-white ${
                        formData.status === "submitted"
                          ? "bg-orange-500"
                          : formData.status === "departmentApproved"
                          ? "bg-green-500"
                          : formData.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {formData.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Requester */}
              {formData.requester && (
                <p className="text-sm text-gray-600 font-semibold text-end px-4 my-4">
                  Requested by:{" "}
                  {user?.id === formData.requester._id
                    ? "You"
                    : `${formData.requester.firstName} ${formData.requester.lastName}`}
                </p>
              )}
            </div>

            {userType === "procurementManager" ? (
              <div className="procurement-manager-view flex flex-col gap-2 py-6">
                <div className="flex flex-col gap-3 px-4">
                  <div className="flex justify-between items-start gap-4 text-start">
                    <div className="flex flex-col w-2/3">
                      <p className="text-base text-[#0F1E7A] font-semibold">
                        Title
                      </p>
                      <p className="text-base text-[#0F1E7A] font-light">
                        {formData.title}
                      </p>
                    </div>
                    <div className="flex flex-col text-end w-1/3">
                      <p className="text-base text-[#DE1216] font-semibold">
                        Deadline
                      </p>
                      <p className="text-base text-[#DE1216] font-light">
                        26th of June, 2025
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base text-[#0F1E7A] font-semibold">
                      Item Description
                    </p>
                    <p className="text-base text-[#0F1E7A] font-light">
                      {formData.description}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base text-[#0F1E7A] font-semibold">
                      Department
                    </p>
                    <p className="text-base text-[#0F1E7A] font-light">
                      {formData?.department?.name}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base text-[#0F1E7A] font-semibold">
                      Quantity
                    </p>
                    <p className="text-base text-[#0F1E7A] font-light">
                      {formData.quantityNeeded} Units
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base text-[#0F1E7A] font-semibold">
                      Comments
                    </p>
                    <p className="text-base text-[#0F1E7A] font-light">
                      {formData?.justification}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="view-edit flex flex-col gap-6 px-4 py-6">
                <div className="space-y-2">
                  <Label>Request Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    readOnly={!isEditMode}
                    className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Item Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    readOnly={!isEditMode}
                    className="min-h-[100px] rounded-xl border border-[#9f9f9f] shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  {isEditMode ? (
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.category}
                      readOnly
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <div className="p-3 rounded-xl border border-[#9f9f9f] shadow-sm">
                    <Slider
                      min={0}
                      max={2}
                      step={1}
                      value={urgency}
                      onValueChange={isEditMode ? setUrgency : undefined}
                      disabled={!isEditMode}
                      className="my-2 [&>span:first-child]:h-2 [&>span:first-child]:bg-gray-200"
                    />
                    <div className="flex justify-between text-sm text-gray-700">
                      <span
                        className={
                          urgency[0] === 0 ? "font-semibold text-[#0d1b5e]" : ""
                        }
                      >
                        Low
                      </span>
                      <span
                        className={
                          urgency[0] === 1 ? "font-semibold text-[#0d1b5e]" : ""
                        }
                      >
                        Medium
                      </span>
                      <span
                        className={
                          urgency[0] === 2 ? "font-semibold text-[#0d1b5e]" : ""
                        }
                      >
                        High
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Justification</Label>
                  <Textarea
                    value={formData.justification}
                    onChange={(e) =>
                      handleChange("justification", e.target.value)
                    }
                    readOnly={!isEditMode}
                    className="min-h-[120px] rounded-xl border border-[#9f9f9f] shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attach Image</Label>
                  <div className="flex items-center gap-2 border border-[#9f9f9f] p-3 rounded-xl shadow-sm py-2">
                    <Upload className="h-5 w-5 text-gray-500" />
                    <Input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      disabled={!isEditMode}
                      className="border-none shadow-none focus-visible:ring-0 p-0 text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload image most preferably in PNG, JPEG format.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Units</Label>
                  <Input
                    type="number"
                    value={formData.quantityNeeded}
                    onChange={(e) =>
                      handleChange("quantityNeeded", parseInt(e.target.value))
                    }
                    readOnly={!isEditMode}
                    className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit Price (₦)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.estimatedUnitPrice}
                    onChange={(e) =>
                      handleChange(
                        "estimatedUnitPrice",
                        parseFloat(e.target.value)
                      )
                    }
                    readOnly={!isEditMode}
                    className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            {isEditMode ? (
              <>
                <Button
                  onClick={() => onEditModeChange(false)}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Cancel Edit
                </Button>
                <Button
                  disabled={loading}
                  onClick={handleSave}
                  className="bg-[#0F1E7A] hover:bg-[#0b154b] text-white flex-1 py-6"
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push(backPath)}
                  className="bg-gray-600 hover:bg-[#0b154b] text-white flex-1 py-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Close
                </Button>

                {(userType === "user" ||
                  user?.id === formData.requester?._id) && (
                  <Button
                    onClick={() => onEditModeChange(true)}
                    className="bg-[#0F1E7A] hover:bg-[#0b154b] text-white flex-1 py-6"
                  >
                    Edit
                  </Button>
                )}
                {userType === "hod" && formData.status === "submitted" && (
                  <>
                    <Dialog
                      open={showApprovalModal}
                      onOpenChange={setShowApprovalModal}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 py-6">
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                          <DialogTitle>Approve Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Approval Comment</Label>
                            <Textarea
                              value={approvalComment}
                              onChange={(e) =>
                                setApprovalComment(e.target.value)
                              }
                              placeholder="Add a comment for approval"
                              className="mt-2"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setShowApprovalModal(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleApproval}
                              disabled={approvalLoading}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {approvalLoading ? "Approving..." : "Approve"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog
                      open={showDenialModal}
                      onOpenChange={setShowDenialModal}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700 text-white flex-1 py-6">
                          Deny
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                          <DialogTitle>Deny Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Reason for Denial</Label>
                            <Textarea
                              value={denialReason}
                              onChange={(e) => setDenialReason(e.target.value)}
                              placeholder="Please provide a reason for denying this request"
                              className="mt-2"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setShowDenialModal(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleDenial}
                              disabled={approvalLoading}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {approvalLoading ? "Denying..." : "Deny"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </>
            )}
            {(userType === "user" || user?.id === formData.requester?._id) && (
              <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogTrigger className="bg-white max-w-2xl" asChild>
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50 flex-1 py-6"
                  >
                    Cancel Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white">
                  <DialogHeader>
                    <DialogTitle>Cancel Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Reason for cancellation</Label>
                      <Textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Please provide a reason for cancelling this request"
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCancel}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Confirm Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col pb-16">
          <h1 className="bids my-52 text-center">Bids Section</h1>

          {/* To decide on who can make comments on bids  */}
          <Comments entityId={requisitionId} entityType="requisitions" />
        </div>
      </div>
    </div>
  );
}
