"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Item, ItemType } from "./types";

interface ItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: Item;
  handleItemFormChange: (
    field: keyof Item,
    value: string | number | boolean | File | null
  ) => void;
  handleAddItem: () => void;
  editingItemId: number | null;
}

export default function ItemFormDialog({
  isOpen,
  onOpenChange,
  currentItem,
  handleItemFormChange,
  handleAddItem,
  editingItemId,
}: ItemFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col bg-white items-center">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-2xl">
            {editingItemId ? "Edit Item" : "New Item"}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the item below
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full max-w-xl space-y-5">
          <div className="space-y-2">
            <Label>Name of Item *</Label>
            <Input
              placeholder="e.g., A4 Paper"
              className="!p-4 rounded-md border shadow-sm bg-white"
              value={currentItem.itemName}
              onChange={(e) => handleItemFormChange("itemName", e.target.value)}
              required
            />
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label>Item Type *</Label>
              <Select
                value={currentItem.itemType}
                onValueChange={(value: ItemType) =>
                  handleItemFormChange("itemType", value)
                }
                required
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full space-y-2">
              <Label>Brand</Label>
              <Input
                placeholder="e.g., HP"
                className="!p-4 rounded-md border shadow-sm bg-white"
                value={currentItem.preferredBrand}
                onChange={(e) =>
                  handleItemFormChange("preferredBrand", e.target.value)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Item Description *</Label>
            <Textarea
              className="min-h-[100px] rounded-md border shadow-sm bg-white"
              value={currentItem.itemDescription}
              onChange={(e) =>
                handleItemFormChange("itemDescription", e.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Attach Image</Label>
            <div className="flex items-center gap-2 border border-[#9f9f9f] px-3 rounded-md shadow-sm py-0 bg-white">
              <Upload className="h-w w-5 text-gray-500" />
              <Input
                type="file"
                accept=".png,.jpg,.jpeg"
                className="border-none shadow-none focus-visible:ring-0 p-0 text-sm"
                onChange={(e) =>
                  handleItemFormChange(
                    "uploadImage",
                    e.target.files ? e.target.files[0] : null
                  )
                }
              />
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label>Units</Label>
              <Input
                type="number"
                placeholder="e.g., 10"
                className="!p-4 rounded-md border shadow-sm bg-white"
                value={currentItem.units}
                onChange={(e) =>
                  handleItemFormChange(
                    "units",
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
              />
            </div>
            <div className="w-full space-y-2">
              <Label>UOM (Unit of Measure)</Label>
              <Input
                placeholder="e.g., Reams, Pieces, Packs"
                className="!p-4 rounded-md border shadow-sm bg-white"
                value={currentItem.UOM}
                onChange={(e) => handleItemFormChange("UOM", e.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label>Recommended Vendor</Label>
              <Input
                placeholder="Vendor"
                className="!p-4 rounded-md border shadow-sm bg-white"
                value={currentItem.recommendedVendor}
                onChange={(e) =>
                  handleItemFormChange("recommendedVendor", e.target.value)
                }
              />
            </div>
            <div className="w-full space-y-2">
              <Label>Is this a worktool? *</Label>
              <Select
                value={
                  typeof currentItem.isWorkTool === "boolean"
                    ? currentItem.isWorkTool.toString()
                    : ""
                }
                onValueChange={(value) =>
                  handleItemFormChange("isWorkTool", value === "true")
                }
                required
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-3">
          <div className="w-1/2">
            <Button
              onClick={handleAddItem}
              className="w-full bg-[#0F1E7A] text-white cursor-pointer"
            >
              {editingItemId ? "Update Item" : "Add Item"}
            </Button>
          </div>
          <div className="w-1/2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full border border-[#DE1216] text-[#DE1216] hover:bg-red-50 hover:text-[#DE1216]"
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
