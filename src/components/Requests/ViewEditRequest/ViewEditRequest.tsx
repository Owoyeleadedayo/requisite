"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { getToken, getUser } from "@/lib/auth";
import { RequestData, ViewEditRequestProps } from "./types";
import RequestHeader from "./RequestHeader";
import RequestCard from "./RequestCard";
import RequestDetails from "./RequestDetails";
import RequestForm from "./RequestForm";
import RequestActions from "./RequestActions";
import BidsSection from "./BidsSection";
import Comments from "./CommentsSection";
import PMCommentForm from "./PMCommentForm";

export default function ViewEditRequest({
  requisitionId,
  userType,
  isEditMode,
  onEditModeChange,
}: ViewEditRequestProps) {
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

  const fetchRequest = useCallback(async () => {
    const reversePriorityMap: Record<RequestData["priority"], number> = {
      low: 0,
      medium: 1,
      high: 2,
    };
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
  }, [requisitionId, token]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

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
        window.location.href = backPath;
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

  if (notFound) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-[80vh] text-center">
        <h2 className="text-2xl font-bold text-[#0F1E7A] mb-4">
          Request Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The request you&apos;re looking for doesn&apso;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  if (!formData._id) {
    return (
      <div className="w-full flex justify-center items-center h-[80vh] text-gray-500">
        <div className="flex gap-2 items-center">
          <Loader2 className="animate-spin" />
          <p>Loading request details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16 px-4 lg:px-12">
      <RequestHeader
        backPath={backPath}
        isEditMode={isEditMode}
        requisitionNumber={formData.requisitionNumber}
      />

      <div className="w-full flex flex-col lg:flex-row gap-6 container">
        <div className="w-full lg:w-1/2 flex flex-col pb-16">
          <RequestCard formData={formData} user={user} />

          {/* PM sees RequestDetails by default, others see RequestForm */}
          {userType === "procurementManager" && !isEditMode && (
            <RequestDetails formData={formData} />
          )}

          {/* PM Comment Form */}
          {userType === "procurementManager" && !isEditMode && (
            <PMCommentForm
              formData={formData}
              requisitionId={requisitionId}
              onActionSuccess={fetchRequest}
            />
          )}

          {/* Show RequestForm for user/hod always, or for PM in edit mode */}
          {(userType === "user" || userType === "hod" || isEditMode) && (
            <RequestForm
              formData={formData}
              isEditMode={isEditMode}
              urgency={urgency}
              setUrgency={setUrgency}
              handleChange={handleChange}
            />
          )}

          <RequestActions
            isEditMode={isEditMode}
            loading={loading}
            userType={userType}
            formData={formData}
            user={user}
            backPath={backPath}
            onEditModeChange={onEditModeChange}
            onSave={handleSave}
            showApprovalModal={showApprovalModal}
            setShowApprovalModal={setShowApprovalModal}
            approvalComment={approvalComment}
            setApprovalComment={setApprovalComment}
            onApproval={handleApproval}
            showDenialModal={showDenialModal}
            setShowDenialModal={setShowDenialModal}
            denialReason={denialReason}
            setDenialReason={setDenialReason}
            onDenial={handleDenial}
            approvalLoading={approvalLoading}
            showCancelModal={showCancelModal}
            setShowCancelModal={setShowCancelModal}
            cancelReason={cancelReason}
            setCancelReason={setCancelReason}
            onCancel={handleCancel}
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col pb-16">
          {/* {userType === "procurementManager" && <BidsSection />} */}
          <Comments entityId={requisitionId} entityType="requisitions" />
        </div>
      </div>
    </div>
  );
}
