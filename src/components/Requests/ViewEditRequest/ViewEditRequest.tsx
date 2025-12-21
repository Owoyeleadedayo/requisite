"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Keep for HOD/PM actions if needed
import { ArrowLeft, Loader2, Upload } from "lucide-react";
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
import Image from "next/image";
import Comments from "./CommentsSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import ItemFormDialog from "../ItemFormDialog";
import ItemsList from "../ItemsList";
import ItemViewDialog from "../ItemViewDialog";
import { Textarea } from "@/components/ui/textarea";
import RequestForm from "../RequestForm";
import { Item, UserTypes, Vendor } from "../types";
import { formatStatus } from "@/lib/statusFormatter";
import PMItemsList from "../PMItemsList";
import Related from "./Related";
import { requisitionService } from "@/services/requisitionService";
import { CONSTANTS } from "@/lib/constants";

interface RequestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  quantityNeeded: number;
  justification: string;
  requisitionNumber: string;
  image: string;
  deliveryLocation: string;
  priority: "low" | "medium" | "high";
  attachment?: string;
  requester?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status?: string;
  items?: Item[];
  deliveryDate?: string;
}

// Define a type for the item object received from the API
type BackendItem = Omit<Item, "id"> & { _id: string };

interface ViewEditRequestProps {
  requisitionId: string;
  userType: UserTypes;
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [formData, setFormData] = useState<RequestData>({
    _id: "",
    title: "",
    description: "",
    category: "",
    quantityNeeded: 0,
    justification: "",
    requisitionNumber: "",
    image: "",
    deliveryLocation: "",
    priority: "medium",
    attachment: "",
    requester: { _id: "", firstName: "", lastName: "" },
    status: "",
    items: [],
  });

  const [urgency, setUrgency] = useState([1]);
  const [items, setItems] = useState<Item[]>([]);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isItemViewDialogOpen, setIsItemViewDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<Date | undefined>();

  const [currentItem, setCurrentItem] = useState<Item>({
    _id: "",
    itemName: "",
    itemType: "",
    preferredBrand: "",
    itemDescription: "",
    uploadImage: null,
    units: "",
    UOM: "",
    recommendedVendor: "",
    isWorkTool: "",
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDenialModal, setShowDenialModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [denialReason, setDenialReason] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [showItemsError, setShowItemsError] = useState(false);
  const [itemComment, setItemComment] = useState("");
  const [isItemRequestLoading, setIsItemRequestLoading] = useState(false);

  const priorityMap: Record<number, RequestData["priority"]> = {
    0: "low",
    1: "medium",
    2: "high",
  };

  const backPath =
    userType === "hod"
      ? "/hod/requisitions"
      : userType === "procurementManager"
      ? "/pm/requisitions"
      : userType === "admin"
      ? "/hhra/requisitions"
      : "/user/requisition";

  useEffect(() => {
    const urgencyMap: Record<string, number> = {
      low: 0,
      medium: 1,
      high: 2,
    };

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
          setFormData({
            ...req,
            title: req.title,
            justification: req.justification,
          });
          setItems(
            req.items.map((item: BackendItem, index: number) => ({
              ...item,
              id: item._id || index,
            }))
          );
          const urgencyValue = req.urgency || req.priority;
          setUrgency([urgencyMap[urgencyValue] || 1]);
          if (req.deliveryDate) {
            setDateStart(new Date(req.deliveryDate));
          }
        } else setNotFound(true);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      }
    };
    fetchRequest();

    const fetchAllVendors = async (token: string) => {
      setVendorsLoading(true);
      let allVendors: Vendor[] = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        do {
          const response = await fetch(
            `${API_BASE_URL}/vendors?page=${currentPage}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          if (data.success) {
            allVendors = [...allVendors, ...data.data];
            totalPages = data.pagination.pages;
            currentPage++;
          } else {
            console.error("Failed to fetch a page of vendors:", data.message);
            break;
          }
        } while (currentPage <= totalPages);

        setVendors(allVendors);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        toast.error("Could not load vendors.");
      } finally {
        setVendorsLoading(false);
      }
    };

    if (token) {
      fetchAllVendors(token);
    }
  }, [requisitionId, token, isEditMode]);

  const handleItemFormChange = (
    field: keyof Item,
    value: string | number | boolean | File | null
  ) => {
    setCurrentItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (
      !currentItem.itemName ||
      !currentItem.itemType ||
      !currentItem.itemDescription ||
      typeof currentItem.isWorkTool !== "boolean"
    ) {
      toast.error("Please fill all required fields marked with *");
      return;
    }

    if (editingItemId !== null) {
      setItems(
        items.map((item) => (item._id === editingItemId ? currentItem : item))
      );
      toast.success("Item updated successfully!");
    } else {
      setItems([...items, { ...currentItem, _id: Date.now().toString() }]);
      toast.success("Item added successfully!");
    }

    resetCurrentItem();
    setIsItemDialogOpen(false);
  };

  const handleDeleteItem = (id: number | string) => {
    setItems(items.filter((item) => item._id !== id));
    toast.success("Item removed.");
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
          urgency: priorityMap[urgency[0]],
          items: items.map(({ _id, uploadImage, ...rest }) => {
            const { recommendedVendor, ...itemPayload } = rest;
            if (recommendedVendor) {
              return { ...itemPayload, recommendedVendor };
            }
            return itemPayload;
          }),
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

  const resetCurrentItem = () => {
    setCurrentItem({
      _id: "",
      itemName: "",
      itemType: "",
      preferredBrand: "",
      itemDescription: "",
      uploadImage: null,
      units: "",
      UOM: "",
      recommendedVendor: "",
      isWorkTool: "",
    });
    setEditingItemId(null);
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

  const handleItemCheck = (itemId: string, checked: string | boolean) => {
    if (formData.status === "cancelled") {
      toast.warning("Cannot act on items in a cancelled requisition");
      return;
    }
    if (itemId === "header-checkbox") {
      if (checked) {
        const updatedSelection: string[] = [];
        for (let i = 0; i < items.length; i++) {
          // For loop was used due to the `continue` feature to avoid returning types like null, undefined or Boolean
          if (items[i].status === "pending") {
            updatedSelection.push(items[i]._id);
          }
        }
        setSelectedItems(updatedSelection);
      } else {
        setSelectedItems([]);
      }
    } else {
      const updatedItems = checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((item) => item !== itemId);
      setSelectedItems(updatedItems);
    }
  };

  const approveBulkRequisitionItems = async () => {
    if (!itemComment.trim()) {
      // Errors were thrown to allow the modal close only when the request is successful
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.PROVIDE_APPROVAL_COMMENT_WARN
      );
    }

    const body = {
      itemIds: selectedItems,
      comments:
        itemComment.trim() || CONSTANTS.REQUISITION.COMMENT.ITEM_APPROVAL,
    };

    setIsItemRequestLoading(true);
    try {
      const data = await requisitionService.approveBulkRequisitionItems(
        requisitionId,
        body
      );
      if (data.success) {
        toast.success(
          CONSTANTS.REQUISITION.NOTIFICATION.APPROVE_REQUISITION_ITEM_SUCCESS
        );
        setItems(data.data.requisition.items); // update state on items table
        setViewingItem(data.data.item); // update state on item view dialog
      } else {
        throw toast.error(
          data.message ||
            CONSTANTS.REQUISITION.NOTIFICATION.APPROVE_REQUISITION_ITEM_FAIL
        );
      }
    } catch (error) {
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.APPROVE_REQUISITION_ITEM_ERROR
      );
    } finally {
      setIsItemRequestLoading(false);
    }
  };

  const rejectBulkRequisitionItems = async () => {
    if (!itemComment.trim()) {
      // Errors were thrown to allow the modal close only when the request is successful
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.PROVIDE_REJECTION_COMMENT_WARN
      );
    }

    const body = {
      itemIds: selectedItems,
      comments:
        itemComment.trim() || CONSTANTS.REQUISITION.COMMENT.ITEM_REJECTION,
    };

    setIsItemRequestLoading(true);
    try {
      const data = await requisitionService.rejectBulkRequisitionItems(
        requisitionId,
        body
      );
      if (data.success) {
        toast.success(
          CONSTANTS.REQUISITION.NOTIFICATION.APPROVE_REQUISITION_ITEM_SUCCESS
        );
        setItems(data.data.requisition.items); // update state on items table
        setViewingItem(data.data.item); // update state on item view dialog
      } else {
        throw toast.error(
          data.message ||
            CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_ITEM_FAIL
        );
      }
    } catch (error) {
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_ITEM_ERROR
      );
    } finally {
      setIsItemRequestLoading(false);
    }
  };

  const approveRequisitionItem = async (itemId: string) => {
    if (!itemComment.trim()) {
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.PROVIDE_APPROVAL_COMMENT_WARN
      );
    }

    const body = {
      comments:
        itemComment.trim() || CONSTANTS.REQUISITION.COMMENT.ITEM_APPROVAL,
    };

    setIsItemRequestLoading(true);
    try {
      const data = await requisitionService.approveRequisitionItem(
        requisitionId,
        itemId,
        body
      );
      console.log(data);
      if (data.success) {
        toast.success(
          data.message ||
            CONSTANTS.REQUISITION.NOTIFICATION.APPROVE_REQUISITION_ITEM_SUCCESS
        );
        setItems(data.data.requisition.items); // update state on items table
        setViewingItem(data.data.item); // update state on item view dialog
      } else {
        throw toast.error(
          data.message ||
            CONSTANTS.REQUISITION.NOTIFICATION.APPROVE_REQUISITION_ITEM_FAIL
        );
      }
    } catch (error) {
      console.error(error);
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.APPROVE_REQUISITION_ITEM_ERROR
      );
    } finally {
      setIsItemRequestLoading(false);
    }
  };

  const rejectRequisitionItem = async (itemId: string) => {
    if (!itemComment.trim()) {
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.PROVIDE_REJECTION_COMMENT_WARN
      );
    }

    const body = {
      comments:
        itemComment.trim() ||
        CONSTANTS.REQUISITION.NOTIFICATION.PROVIDE_REJECTION_COMMENT_WARN,
    };

    setIsItemRequestLoading(true);
    try {
      const data = await requisitionService.rejectRequisitionItem(
        requisitionId,
        itemId,
        body
      );
      if (data.success) {
        toast.success(
          data.message ||
            CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_ITEM_SUCCESS
        );
        setItems(data.data.requisition.items); // update state on items table
        setViewingItem(data.data.item); // update state on item view dialog
      } else {
        throw toast.error(
          data.message ||
            CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_ITEM_FAIL
        );
      }
    } catch (error) {
      console.error(error);
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_ITEM_ERROR
      );
    } finally {
      setIsItemRequestLoading(false);
    }
  };

  const rejectRequisition = async () => {
    setApprovalLoading(true);

    const body = {
      comments:
        denialReason.trim() || CONSTANTS.REQUISITION.COMMENT.ITEM_APPROVAL,
    };

    try {
      const data = await requisitionService.rejectRequisition(
        requisitionId,
        body
      );
      if (data.success) {
        toast.success(
          CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_SUCCESS
        );
        setFormData(data.data);
        setShowDenialModal(false);
      } else {
        toast.error(
          data.message ||
            CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_FAIL
        );
      }
    } catch (error) {
      console.error(error);
      throw toast.error(
        CONSTANTS.REQUISITION.NOTIFICATION.REJECT_REQUISITION_ERROR
      );
    } finally {
      setApprovalLoading(false);
      setDenialReason("");
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

  const handleGenerateRFQ = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to generate RFQ");
      setShowItemsError(true);
      setTimeout(() => setShowItemsError(false), 10000);
      return;
    }
    const selectedItemsParam = selectedItems.join(",");
    router.push(
      `/pm/requisitions/${requisitionId}/generate-rfq?selectedItems=${selectedItemsParam}`
    );
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
      <div className="w-full flex items-center mb-4">
        <Link
          href={backPath}
          className="flex items-center gap-2 text-[#0d1b5e] hover:underline border rounded-full p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="w-full flex items-center gap-2 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E7A]">
          {isEditMode ? "Update Request" : "View Request"} -{" "}
          {formData.requisitionNumber}{" "}
        </h1>
        {formData.status && (
          <span className="status-badge ml-4">
            <span
              className={`py-3 px-4 rounded-full text-sm font-semibold text-white ${
                formData.status === "submitted"
                  ? "bg-orange-500"
                  : formData.status === "departmentApproved"
                  ? "bg-green-500"
                  : formData.status === "cancelled"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            >
              {formData.status[0].toUpperCase() + formData.status.slice(1)}
            </span>
            {/* {formatStatus(formData.status)} */}
          </span>
        )}
      </div>

      {/* <div className="w-full flex flex-col lg:flex-row gap-8 container"> */}
      <div className="grid grid-cols-1 lg:grid-cols-[50%_45%]  w-full lg:max-w-7xl gap-10">
        <div className="w-full flex flex-col pb-16">
          <div className="request relative w-full space-y-5">
            {/* Request Status */}
            {/* {formData.status && (
              <div className="status-badge absolute top-0 right-0 z-[5]">
                <span
                  className={`py-3 px-4 rounded-sm text-sm font-semibold text-white ${
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
            )} */}

            {/* Request Image */}
            {/* <div className="w-full space-y-2">
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  fill
                  alt="Request Image"
                  src={formData.image || "/request-image.png"}
                  className="object-contain"
                />
              </div>
              {formData.requester && (
                <p className="text-sm text-gray-600 font-semibold text-end my-4">
                  Requested by:{" "}
                  {user?.id === formData.requester._id
                    ? "You"
                    : `${formData.requester.firstName} ${formData.requester.lastName}`}
                </p>
              )}
            </div> */}

            <RequestForm
              formData={formData}
              setFormData={setFormData}
              urgency={urgency}
              setUrgency={setUrgency}
              dateStart={dateStart}
              setDateStart={setDateStart}
              handleSubmit={handleSave}
              loading={loading}
              isEditMode={isEditMode}
            />

            {formData.status === "departmentApproved" &&
              userType === "procurementManager" && (
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <Button
                    type="button"
                    onClick={handleGenerateRFQ}
                    className="font-bold text-base bg-[#0F1E7A] hover:bg-[#0b154b] text-white py-6 px-10"
                  >
                    Generate RFQ
                  </Button>

                  <Button
                    type="button"
                    className="font-bold text-base bg-red-600 hover:bg-red-700 text-white py-6 px-10"
                  >
                    Close
                  </Button>
                </div>
              )}

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              {isEditMode ? (
                <>
                  <Button
                    onClick={() => onEditModeChange(false)}
                    className="border border-red-600 text-red-600 hover:bg-red-500 flex-1 py-6"
                  >
                    Cancel Edit
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 py-6"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <>
                  {(userType === "user" ||
                    user?.id === formData.requester?._id) && (
                    <Button
                      onClick={() => onEditModeChange(true)}
                      className="bg-[#0F1E7A] hover:bg-[#0b154b] text-white flex-1 py-6 w-full"
                    >
                      Edit
                    </Button>
                  )}
                  {userType === "hod" && (
                    <>
                      <Dialog
                        open={showApprovalModal}
                        onOpenChange={(open) => {
                          if (
                            items!.some(
                              (item) =>
                                item.status === "departmentApproved" ||
                                item.status === "hrReview"
                            )
                          ) {
                            setShowApprovalModal(open);
                          } else {
                            toast.error(
                              "Approve at least one item before proceeding"
                            );
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            disabled={formData.status !== "submitted"}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 py-6"
                          >
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
                              {userType === "hod" && (
                                <span className="flex text-xs pt-2 leading-none">
                                  Confirm that all relevant items have been
                                  approved before proceeding, as the process
                                  cannot be reversed.
                                </span>
                              )}
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
                          {/* Todo: refactor status check */}
                          <Button
                            disabled={formData.status !== "submitted"}
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 py-6"
                          >
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
                                onChange={(e) =>
                                  setDenialReason(e.target.value)
                                }
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
                                onClick={rejectRequisition}
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
              {(userType === "user" ||
                user?.id === formData.requester?._id) && (
                <Dialog
                  open={showCancelModal}
                  onOpenChange={setShowCancelModal}
                >
                  <DialogTrigger className="bg-white max-w-2xl" asChild>
                    <Button
                      variant="destructive"
                      className="flex-1 py-6 bg-red-600 hover:bg-red-700"
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
        </div>

        <div className="flex flex-col gap-8">
          {/* {isEditMode ? ( */}
          <>
            {userType !== "procurementManager" ? (
              <ItemsList
                isEditMode={isEditMode}
                items={items}
                selectedItems={selectedItems}
                approveBulkRequisitionItems={approveBulkRequisitionItems}
                rejectBulkRequisitionItems={rejectBulkRequisitionItems}
                isItemRequestLoading={isItemRequestLoading}
                itemComment={itemComment}
                setItemComment={setItemComment}
                handleItemCheck={handleItemCheck}
                onAddNewItem={() => {
                  resetCurrentItem();
                  setIsItemDialogOpen(true);
                }}
                onEditItem={(item) => {
                  setCurrentItem(item);
                  setEditingItemId(item._id);
                  setIsItemDialogOpen(true);
                }}
                onViewItem={(item) => {
                  setViewingItem(item);
                  setIsItemViewDialogOpen(true);
                }}
                onDeleteItem={handleDeleteItem}
                userType={userType}
              />
            ) : (
              <div className="flex flex-col gap-10">
                <PMItemsList
                  items={items}
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  onViewItem={(item) => {
                    setViewingItem(item);
                    setIsItemViewDialogOpen(true);
                  }}
                  showError={showItemsError}
                />

                <Related
                  requests={[
                    {
                      _id: "1",
                      title: "Request for Microphones",
                      department: "IT Dept",
                    },
                  ]}
                  rfqs={[
                    {
                      _id: "2",
                      title: "RFQ for Equipment",
                      department: "HR Dept",
                    },
                  ]}
                  pos={[
                    {
                      _id: "2",
                      title: "RFQ for Equipment",
                      department: "HR Dept",
                    },
                  ]}
                  onViewItem={(item, type) => {
                    console.log("View", type, item);
                  }}
                />
              </div>
            )}
            <ItemFormDialog
              vendors={vendors}
              isOpen={isItemDialogOpen}
              currentItem={currentItem}
              handleAddItem={handleAddItem}
              editingItemId={editingItemId}
              vendorsLoading={vendorsLoading}
              onOpenChange={setIsItemDialogOpen}
              handleItemFormChange={handleItemFormChange}
            />
            {viewingItem && (
              <ItemViewDialog
                isOpen={isItemViewDialogOpen}
                onOpenChange={setIsItemViewDialogOpen}
                currentItem={viewingItem}
                vendors={vendors}
                userType={userType}
                approveRequisitionItem={approveRequisitionItem}
                rejectRequisitionItem={rejectRequisitionItem}
                itemComment={itemComment}
                setItemComment={setItemComment}
                isItemRequestLoading={isItemRequestLoading}
              />
            )}
          </>
          {/* ) : ( */}
          <Comments entityId={requisitionId} entityType="requisitions" />
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
