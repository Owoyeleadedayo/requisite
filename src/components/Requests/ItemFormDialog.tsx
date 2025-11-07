"use client";

import React from "react";
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
import { Upload, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Item, ItemType, Vendor } from "./types";

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
  vendors: Vendor[];
  vendorsLoading: boolean;
}

export default function ItemFormDialog({
  isOpen,
  onOpenChange,
  currentItem,
  handleItemFormChange,
  handleAddItem,
  editingItemId,
  vendors,
  vendorsLoading,
}: ItemFormDialogProps) {
  const [comboboxOpen, setComboboxOpen] = React.useState(false);

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
            <Label>Name of Item <span className="compulsory-field">*</span></Label>
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
              <Label>Item Type <span className="compulsory-field">*</span></Label>
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
            <Label>Item Description <span className="compulsory-field">*</span></Label>
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
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger className="!bg-white" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between bg-white hover:bg-white"
                  >
                    {currentItem.recommendedVendor
                      ? vendors.find(
                          (vendor) =>
                            vendor._id === currentItem.recommendedVendor
                        )?.name
                      : vendorsLoading
                      ? "Loading vendors..."
                      : "Select vendor..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0 bg-white">
                  <Command>
                    <CommandInput placeholder="Search vendor..." />
                    <CommandList>
                      <CommandEmpty>No vendor found.</CommandEmpty>
                      <CommandGroup>
                        {vendors.map((vendor) => (
                          <CommandItem
                            key={vendor._id}
                            value={vendor.name}
                            onSelect={() => {
                              handleItemFormChange(
                                "recommendedVendor",
                                vendor._id === currentItem.recommendedVendor
                                  ? ""
                                  : vendor._id
                              );
                              setComboboxOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                currentItem.recommendedVendor === vendor._id
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {vendor.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full space-y-2">
              <Label>Is this a worktool? <span className="compulsory-field">*</span></Label>
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
