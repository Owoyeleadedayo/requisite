"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { getToken } from "@/lib/auth";
import { parseDate } from "chrono-node";
import RequestForm from "./RequestForm";
import ItemsList from "./ItemsList";
import ItemFormDialog from "./ItemFormDialog";
import { Item } from "./types";

interface CreateNewRequestProps {
  page: "user" | "hod" | "pm";
  data: unknown[];
}

export default function CreateNewRequest({
  page,
  data,
}: CreateNewRequestProps) {
  const router = useRouter();
  const [urgency, setUrgency] = useState([1]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    justification: "",
    deliveryLocation: "",
  });

  const [currentItem, setCurrentItem] = useState<Item>({
    id: 0,
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

  const urgencyMap = ["low", "medium", "high"];

  const token = getToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one item before proceeding.");
      return;
    }

    const formattedDate = dateStart
      ? new Date(dateStart.getTime() - dateStart.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : undefined;

    const payload = {
      title: formData.title,
      urgency: urgencyMap[urgency[0]],
      justification: formData.justification,
      deliveryLocation: formData.deliveryLocation,
      deliveryDate: formattedDate,
      items: items.map(({ id, uploadImage, ...rest }) => {
        const { recommendedVendor, ...itemPayload } = rest;
        if (recommendedVendor) {
          return { ...itemPayload, recommendedVendor };
        }
        return itemPayload;
      }),
    };

    console.log("Request Payload:", payload);

    setLoading(true);

    try {
      // Create requisition
      const createResponse = await fetch(`${API_BASE_URL}/requisitions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const createData = await createResponse.json();

      if (createData.success) {
        if (page === "hod") {
          // For HOD: Requisition is already approved in response
          toast.success("Requisition created and approved successfully!");
          router.push("/hod/my-requests/");
        } else {
          // For user: Submit requisition
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
        }
      } else {
        if (createData.errors) {
          // Handle validation errors from the API
          Object.values(createData.errors).forEach((error) => {
            if (typeof error === "string") {
              toast.error(error);
            }
          });
        } else {
          toast.error(createData.message || "Failed to create requisition");
        }
      }
    } catch (error) {
      console.error("Error creating requisition:", error);
      toast.error("Error creating requisition");
    } finally {
      setLoading(false);
    }
  };

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
      // Update existing item
      setItems(
        items.map((item) => (item.id === editingItemId ? currentItem : item))
      );
      toast.success("Item updated successfully!");
    } else {
      // Add new item
      setItems([...items, { ...currentItem, id: Date.now() }]);
      toast.success("Item added successfully!");
    }

    resetCurrentItem();
    setIsItemDialogOpen(false);
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      id: 0,
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

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item removed.");
  };

  const [dateStart, setDateStart] = useState<Date | undefined>(new Date());

  return (
    <div className="w-full lg:w-full flex flex-col px-4 py-8 pb-16">
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center">
          <Link
            href={
              page === "hod"
                ? "/hod/my-requests"
                : page === "user"
                ? "/user/requisition"
                : ""
            }
            className="flex items-center gap-2 text-[#0d1b5e] hover:underline border rounded-full p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E7A] mb-6">
          Create New Request
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[50%_45%]  w-full gap-10">
        <RequestForm
          formData={formData}
          setFormData={setFormData}
          urgency={urgency}
          setUrgency={setUrgency}
          dateStart={dateStart}
          setDateStart={setDateStart}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <div className="flex lg:flex-col">
          <ItemsList
            items={items}
            onAddNewItem={() => {
              resetCurrentItem();
              setIsItemDialogOpen(true);
            }}
            onEditItem={(item) => {
              setCurrentItem(item);
              setEditingItemId(item.id);
              setIsItemDialogOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
          />
          <ItemFormDialog
            isOpen={isItemDialogOpen}
            onOpenChange={setIsItemDialogOpen}
            currentItem={currentItem}
            handleItemFormChange={handleItemFormChange}
            handleAddItem={handleAddItem}
            editingItemId={editingItemId}
          />
        </div>
      </div>
    </div>
  );
}
