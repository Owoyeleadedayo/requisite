"use client";

import React from "react";
import Image from "next/image";
import { Item, Vendor } from "./types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ItemViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: Item;
  vendors: Vendor[];
}

export default function ItemViewDialog({
  isOpen,
  onOpenChange,
  currentItem,
  vendors,
}: ItemViewDialogProps) {
  const noImage = "/no-image.svg";

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find((v) => v._id === vendorId);
    return vendor ? vendor.name : "N/A";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col bg-white items-center">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-2xl">Item Details</DialogTitle>
          <DialogDescription>
            View the details of the item below
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full max-w-xl space-y-5">
          <div className="space-y-2">
            <Image
              src={currentItem.imageUrl || noImage}
              alt={currentItem.itemName || "Item Image"}
              className="w-full h-auto rounded-md"
              width={500}
              height={300}
            />
          </div>
          <div className="w-full flex gap-2">
            <div className="w-full space-y-2">
              <Label className="font-bold">Name of Item</Label>
              <div className="p-4 rounded-md text-gray-700">
                {currentItem.itemName || "N/A"}
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label className="font-bold">Status</Label>
              <div className="p-4 rounded-md text-gray-700">
                {currentItem.status
                  ? currentItem.status[0].toUpperCase() +
                    currentItem.status.slice(1).toLowerCase()
                  : "N/A"}
              </div>
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label className="font-bold">Item Type</Label>
              <div className="p-4 rounded-md text-gray-700 capitalize">
                {currentItem.itemType || "N/A"}
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label className="font-bold">Brand</Label>
              <div className="p-4 rounded-md text-gray-700">
                {currentItem.preferredBrand || "N/A"}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-bold">Item Description</Label>
            <div className="p-4 rounded-md text-gray-700">
              {currentItem.itemDescription || "N/A"}
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label className="font-bold">Units</Label>
              <div className="p-4 rounded-md text-gray-700">
                {currentItem.units || "N/A"}
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label className="font-bold">UOM (Unit of Measure)</Label>
              <div className="p-4 rounded-md text-gray-700">
                {currentItem.UOM || "N/A"}
              </div>
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label className="font-bold">Recommended Vendor</Label>
              <div className="p-4 rounded-md text-gray-700">
                {getVendorName(currentItem.recommendedVendor)}
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label className="font-bold">Is this a worktool?</Label>
              <div className="p-4 rounded-md text-gray-700">
                {typeof currentItem.isWorkTool === "boolean"
                  ? currentItem.isWorkTool
                    ? "Yes"
                    : "No"
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <DialogClose asChild>
            <Button type="button" className="w-full bg-[#0F1E7A] text-white">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
