"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface POItemData {
  itemDescription: string;
  brand: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalPrice: number;
  detailsSpecification: string;
}

interface EditPOItemProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (itemData: POItemData) => void;
  itemData?: POItemData;
}

const EditPOItem: React.FC<EditPOItemProps> = ({
  isOpen,
  onClose,
  onUpdate,
  itemData,
}) => {
  const [formData, setFormData] = useState<POItemData>({
    itemDescription: itemData?.itemDescription || "",
    brand: itemData?.brand || "",
    quantity: itemData?.quantity || 0,
    uom: itemData?.uom || "",
    unitPrice: itemData?.unitPrice || 0,
    totalPrice: itemData?.totalPrice || 0,
    detailsSpecification: itemData?.detailsSpecification || "",
  });

  useEffect(() => {
    if (itemData) {
      setFormData({
        itemDescription: itemData.itemDescription || "",
        brand: itemData.brand || "",
        quantity: itemData.quantity || 0,
        uom: itemData.uom || "",
        unitPrice: itemData.unitPrice || 0,
        totalPrice: itemData.totalPrice || 0,
        detailsSpecification: itemData.detailsSpecification || "",
      });
    }
  }, [itemData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          name === "quantity" || name === "unitPrice"
            ? parseFloat(value) || 0
            : value,
      };

      // Auto-calculate total price when quantity or unit price changes
      if (name === "quantity" || name === "unitPrice") {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }

      return updated;
    });
  };

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex justify-center items-center">
            <p className="text-xl font-semibold text-center text-[#100A1A]">
              Edit PO Item
            </p>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-md text-center font-normal">
              Update the details of the item below
            </p>
          </div>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 p-1">
          <div className="flex flex-col gap-3">
            {/* Item Description */}
            <div className="space-y-2">
              <Label>Item Description</Label>
              <Input
                type="text"
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
              />
            </div>

            {/* UOM */}
            <div className="space-y-2">
              <Label>UOM</Label>
              <Input
                type="text"
                name="uom"
                value={formData.uom}
                onChange={handleInputChange}
                className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
              />
            </div>

            {/* Unit Price */}
            <div className="space-y-2">
              <Label>Unit Price</Label>
              <Input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
              />
            </div>

            {/* Total Price */}
            <div className="space-y-2">
              <Label>Total Price</Label>
              <Input
                type="text"
                name="totalPrice"
                value={formData.totalPrice.toLocaleString()}
                readOnly
                className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm bg-gray-50"
              />
            </div>

            {/* Details Specification */}
            <div className="space-y-2">
              <Label>Details Specification</Label>
              <Textarea
                name="detailsSpecification"
                value={formData.detailsSpecification}
                onChange={handleInputChange}
                className="min-h-[80px] rounded-xl border border-[#9f9f9f] shadow-sm resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleUpdate}
                className="flex-1 bg-[#0F1E7A] text-white hover:bg-blue-800"
              >
                Update
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPOItem;
