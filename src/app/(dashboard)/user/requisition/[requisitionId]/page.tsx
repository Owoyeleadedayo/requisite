"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { getToken } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Comments from "@/components/Comments";

interface RequestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  quantityNeeded: number;
  estimatedUnitPrice: number;
  justification: string;
  image: string;
  priority: "low" | "medium" | "high";
  attachment?: string;
}

export default function ViewEditRequest() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { requisitionId } = params;

  const [isEditMode, setIsEditMode] = useState(
    searchParams.get("mode") === "edit"
  );
  const token = getToken();
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
    image: "",
    priority: "medium",
    attachment: "",
  });

  const [urgency, setUrgency] = useState([1]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const priorityMap: Record<number, RequestData["priority"]> = {
    0: "low",
    1: "medium",
    2: "high",
  };

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
          setUrgency([reversePriorityMap[req.priority]]);
        } else setNotFound(true);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      }
    };
    fetchRequest();
  }, [requisitionId, token]);

  const handleChange = (field: keyof RequestData, value: any) => {
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
        setIsEditMode(false);
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
        router.push("/user/requisition");
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
      <div className="w-full flex items-center mb-12">
        <Link
          href="/user/requisition"
          className="flex items-center gap-2 text-[#0d1b5e] hover:underline border rounded-full p-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E7A] mb-6">
        {isEditMode ? "Update Request" : "View Request"}
      </h1>

      <div className="w-full flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 flex flex-col  pb-16">
          <div className="w-full max-w-xl space-y-5">
            <div className="space-y-2">
              <Label>Request Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                readOnly={!isEditMode}
                className="!p-4 rounded-xl border shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Item Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                readOnly={!isEditMode}
                className="min-h-[100px] rounded-xl border shadow-sm"
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
                  className="!p-4 rounded-xl border shadow-sm"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Urgency</Label>
              <div className="p-3 rounded-xl border shadow-sm">
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
                onChange={(e) => handleChange("justification", e.target.value)}
                readOnly={!isEditMode}
                className="min-h-[120px] rounded-xl border shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Image</Label>
              <div className="flex items-center gap-2 border p-3 rounded-xl shadow-sm py-2">
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
                className="!p-4 rounded-xl border shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Unit Price (₦)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.estimatedUnitPrice}
                onChange={(e) =>
                  handleChange("estimatedUnitPrice", parseFloat(e.target.value))
                }
                readOnly={!isEditMode}
                className="!p-4 rounded-xl border shadow-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              {isEditMode ? (
                <>
                  <Button
                    onClick={() => setIsEditMode(false)}
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
                    onClick={() => router.push("/user/requisition")}
                    className="bg-red-600 hover:bg-red-700 text-white flex-1 py-6"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="bg-[#0F1E7A] hover:bg-[#0b154b] text-white flex-1 py-6"
                  >
                    Edit
                  </Button>
                </>
              )}
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
            </div>
          </div>
        </div>

        <Comments />
      </div>
    </div>
  );
}
