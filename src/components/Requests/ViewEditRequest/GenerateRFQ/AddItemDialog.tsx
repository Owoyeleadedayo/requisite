"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Item } from "../../types";

interface AddItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: Item[];
  selectedItems: string[];
  dialogSelectedItems: string[];
  setDialogSelectedItems: (items: string[]) => void;
  onAddItems: () => void;
}

export default function AddItemDialog({
  isOpen,
  setIsOpen,
  items,
  selectedItems,
  dialogSelectedItems,
  setDialogSelectedItems,
  onAddItems,
}: AddItemDialogProps) {
  // Filter to show only departmentApproved items not currently in the list
  const availableItems = items.filter(
    (item) => !selectedItems.includes(item._id) && item.status === 'departmentApproved'
  );

  return (
    <div className="flex justify-center items-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="bg-white" asChild>
          <Button
            className="border border-[#0F1E7A] cursor-pointer"
            onClick={() => {
              setDialogSelectedItems([]);
              setIsOpen(true);
            }}
          >
            <Plus size={18} />{" "}
            <span className="hidden lg:flex">Add New Item</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader></DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col w-full gap">
              <div>
                {availableItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-gray-500 text-center">
                      No approved items available to add. All department-approved items have been added to the RFQ.
                    </p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Checkbox
                              checked={
                                availableItems.length > 0 &&
                                dialogSelectedItems.length ===
                                  availableItems.length
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDialogSelectedItems(
                                    availableItems.map((item) => item._id)
                                  );
                                } else {
                                  setDialogSelectedItems([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <Checkbox
                                checked={dialogSelectedItems.includes(item._id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setDialogSelectedItems([
                                      ...dialogSelectedItems,
                                      item._id,
                                    ]);
                                  } else {
                                    setDialogSelectedItems(
                                      dialogSelectedItems.filter(
                                        (id) => id !== item._id
                                      )
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.itemType}</TableCell>
                            <TableCell className="text-[#F59313]">
                              {item.status || "Pending"}
                            </TableCell>
                            <TableCell>
                              <Button className="bg-[#0F1E7A] h-[35px] text-white cursor-pointer capitalize">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="w-full flex items-center justify-center gap-3 mt-4">
                      <Button
                        className="bg-[#0F1E7A] text-white cursor-pointer"
                        onClick={onAddItems}
                        disabled={dialogSelectedItems.length === 0}
                      >
                        Add item(s)
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
