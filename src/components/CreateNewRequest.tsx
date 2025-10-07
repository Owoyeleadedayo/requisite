"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { getToken } from "@/lib/auth";

export default function CreateNewRequest() {
  const router = useRouter();
  const [urgency, setUrgency] = useState([1]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    quantityNeeded: "",
    estimatedUnitPrice: "",
    justification: "",
    image: "https://example.com/image.jpg",
  });

  const priorityMap = ["low", "medium", "high"];

  const token = getToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create requisition
      const createResponse = await fetch(`${API_BASE_URL}/requisitions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          quantityNeeded: parseInt(formData.quantityNeeded),
          image: formData.image,
          estimatedUnitPrice: parseFloat(formData.estimatedUnitPrice),
          priority: priorityMap[urgency[0]],
          justification: formData.justification,
        }),
      });

      const createData = await createResponse.json();

      if (createData.success) {
        // Submit requisition
        const submitResponse = await fetch(
          `${API_BASE_URL}/requisitions/${createData.data._id}/submit`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const submitData = await submitResponse.json();

        if (submitData.success) {
          toast.success("Requisition created and submitted successfully!");
          router.push("/user/requisition/");
        } else {
          toast.error("Failed to submit requisition");
        }
      } else {
        toast.error("Failed to create requisition");
      }
    } catch (error) {
      console.error("Error creating requisition:", error);
      toast.error("Error creating requisition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col px-4 py-8 pb-16">
      <div className="w-full lg:max-w-xl flex items-center mb-4 ">
        <Link
          href="/user/requisition"
          className="flex items-center gap-2 text-[#0d1b5e] hover:underline border rounded-full p-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E7A] mb-6">
        Create New Request
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-5">
        <div className="space-y-2 mb-6">
          <Label>Request Title</Label>
          <Input
            placeholder="Request title"
            className="!p-4 rounded-xl border shadow-sm"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2 mb-6">
          <Label>Item Description</Label>
          <Textarea
            placeholder="Item description"
            className="min-h-[100px]"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2 mb-6">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem
                className="hover:bg-[#0F1E7A] hover:text-white"
                value="product"
              >
                Product
              </SelectItem>
              <SelectItem
                className="hover:bg-[#0F1E7A] hover:text-white"
                value="service"
              >
                Service
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 mb-6">
          <Label>Urgency</Label>
          <div className="p-3 rounded-xl border shadow-sm">
            <Slider
              min={0}
              max={2}
              step={1}
              value={urgency}
              onValueChange={setUrgency}
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

        <div className="space-y-2 mb-6">
          <Label>Justification</Label>
          <Input
            placeholder="Justification"
            className="!p-4 rounded-xl border shadow-sm"
            value={formData.justification}
            onChange={(e) =>
              setFormData({ ...formData, justification: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2 mb-6">
          <Label>Attach Image</Label>
          <div className="flex items-center gap-2 border p-3 rounded-xl border shadow-sm py-2">
            <Upload className="h-5 w-5 text-gray-500" />
            <Input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="border-none shadow-none focus-visible:ring-0 p-0 text-sm"
            />
          </div>
          <p className="text-xs text-gray-500">
            Upload image most preferably in PNG, JPEG format.
          </p>
        </div>

        <div className="space-y-2 mb-6 ">
          <Label>Units</Label>
          <Input
            type="number"
            placeholder="Quantity"
            className="!p-4 rounded-xl border shadow-sm"
            value={formData.quantityNeeded}
            onChange={(e) =>
              setFormData({ ...formData, quantityNeeded: e.target.value })
            }
            required
          />
        </div>

        {/* Unit Price */}
        <div className="space-y-2 mb-6">
          <Label>₦ Unit Price</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Estimated Cost"
            className="!p-4 rounded-xl border shadow-sm"
            value={formData.estimatedUnitPrice}
            onChange={(e) =>
              setFormData({ ...formData, estimatedUnitPrice: e.target.value })
            }
            required
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#0d1b5e] hover:bg-[#0b154b] text-white rounded-lg text-base p-6"
          >
            {loading ? "Creating..." : "Proceed"}
          </Button>
        </div>
      </form>
    </div>
  );
}
