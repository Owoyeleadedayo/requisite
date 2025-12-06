"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Item, ItemType, Vendor } from "../../types";

interface EditItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingItem: Item | null;
  setEditingItem: (item: Item) => void;
  vendors: Vendor[];
  vendorsLoading: boolean;
  onUpdateItem: () => void;
}

export default function EditItemDialog({
  isOpen,
  setIsOpen,
  editingItem,
  setEditingItem,
  vendors,
  vendorsLoading,
  onUpdateItem,
}: EditItemDialogProps) {
  if (!editingItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md h-[80vh] max-h-[600px] flex flex-col bg-white items-center overflow-hidden">
        <DialogHeader className="flex justify-center items-center">
          <h2 className="text-2xl font-bold">Edit RFQ Item</h2>
          <p className="text-sm text-gray-600">
            Enter the details of the item below
          </p>
        </DialogHeader>
        <div className="flex flex-col w-full max-w-xl space-y-5 overflow-y-auto flex-1 px-1">
          <div className="space-y-2">
            <Label>
              Name of Item <span className="compulsory-field">*</span>
            </Label>
            <Input
              placeholder="e.g., A4 Paper"
              value={editingItem.itemName}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  itemName: e.target.value,
                })
              }
              className="!p-4 rounded-md border shadow-sm bg-white"
            />
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label>
                Item Type <span className="compulsory-field">*</span>
              </Label>
              <Select
                value={editingItem.itemType}
                onValueChange={(value: ItemType) =>
                  setEditingItem({ ...editingItem, itemType: value })
                }
              >
                <SelectTrigger className="w-full bg-white border border-[#9f9f9f]">
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
                value={editingItem.preferredBrand || ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    preferredBrand: e.target.value,
                  })
                }
                className="!p-4 rounded-md border shadow-sm bg-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Item Description{" "}
              <span className="compulsory-field">*</span>
            </Label>
            <Textarea
              value={editingItem.itemDescription}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  itemDescription: e.target.value,
                })
              }
              className="min-h-[100px] rounded-md border shadow-sm bg-white"
            />
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label>Units</Label>
              <Input
                type="number"
                placeholder="e.g., 10"
                value={editingItem.units}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    units: e.target.value
                      ? parseInt(e.target.value)
                      : "",
                  })
                }
                className="!p-4 rounded-md border shadow-sm bg-white"
              />
            </div>
            <div className="w-full space-y-2">
              <Label>UOM (Unit of Measure)</Label>
              <Input
                placeholder="e.g., Reams, Pieces, Packs"
                value={editingItem.UOM || ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    UOM: e.target.value,
                  })
                }
                className="!p-4 rounded-md border shadow-sm bg-white"
              />
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-full space-y-2">
              <Label>Recommended Vendor</Label>
              <Popover>
                <PopoverTrigger className="!bg-white" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-white hover:bg-white border border-[#9f9f9f]"
                  >
                    {editingItem.recommendedVendor
                      ? vendors.find(
                          (vendor) =>
                            vendor._id === editingItem.recommendedVendor
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
                              setEditingItem({
                                ...editingItem,
                                recommendedVendor:
                                  vendor._id ===
                                  editingItem.recommendedVendor
                                    ? ""
                                    : vendor._id,
                              });
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                editingItem.recommendedVendor ===
                                vendor._id
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
              <Label>
                Is this a worktool?{" "}
                <span className="compulsory-field">*</span>
              </Label>
              <Select
                value={
                  typeof editingItem.isWorkTool === "boolean"
                    ? editingItem.isWorkTool.toString()
                    : ""
                }
                onValueChange={(value) =>
                  setEditingItem({
                    ...editingItem,
                    isWorkTool: value === "true",
                  })
                }
              >
                <SelectTrigger className="w-full bg-white border border-[#9f9f9f]">
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
        <div className="w-full flex gap-3 mt-4 flex-shrink-0">
          <div className="w-1/2">
            <Button
              className="w-full bg-[#0F1E7A] text-white cursor-pointer"
              onClick={onUpdateItem}
            >
              Update Item
            </Button>
          </div>
          <div className="w-1/2">
            <Button
              variant="outline"
              className="w-full border border-[#DE1216] text-[#DE1216] hover:bg-red-50 hover:text-[#DE1216]"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}