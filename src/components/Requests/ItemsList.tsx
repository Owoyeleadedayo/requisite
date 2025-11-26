"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Folder, Edit, Trash2, Plus, Eye } from "lucide-react";
import { Item, UserTypes } from "./types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/StatusBadge";

interface ItemsListProps {
  items: Item[];
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>;
  approveBulkRequisitionItems: () => Promise<void>;
  rejectBulkRequisitionItems: () => Promise<void>;
  isItemRequestLoading: boolean;
  itemComment: string;
  setItemComment: Dispatch<SetStateAction<string>>;
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
  onAddNewItem: () => void;
  onViewItem: (item: Item) => void;
  userType: UserTypes;
  isEditMode?: boolean;
}

export default function ItemsList({
  items,
  selectedItems,
  setSelectedItems,
  approveBulkRequisitionItems,
  rejectBulkRequisitionItems,
  isItemRequestLoading,
  itemComment,
  setItemComment,
  onEditItem,
  onDeleteItem,
  onAddNewItem,
  onViewItem,
  userType,
  isEditMode = true,
}: ItemsListProps) {
    const [bulkAction, setBulkAction] = useState('')
    const [bulkItemModalOpen, setBulkItemModalOpen] = useState(false)
    const pendingItems = items.filter(item => item.status === "pending");

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center mt-20 lg:mt-0">
          <Folder size={80} />
          <p className="text-center max-w-sm">
            Your item list is empty. Click the button below to create an item.
          </p>
          <div>
            <Button
              disabled={!isEditMode}
              onClick={onAddNewItem}
              className="flex flex-row border border-[#0F1E7A] mt-5 cursor-pointer bg-white text-[#0F1E7A] hover:bg-gray-100"
            >
              <Plus /> Add New Item
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleItemCheck = (itemId: string, checked: string | boolean) => {
    if (itemId === 'header-checkbox') {
      if (checked) {
        const updatedSelection: string[] = []
        for (let i = 0; i < items.length; i++) { // For loop was used due to the `continue` feature to avoid returning types like null, undefined or Boolean
          if (items[i].status === 'pending') {
            updatedSelection.push(items[i]._id)
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
      setSelectedItems(updatedItems)

    }
  };

    return (
    <div className="w-full bg-white border-2 border-[#e5e5e5e5] rounded-xl shadow-xl p-5">
      {userType === 'hod' && (<div className="flex gap-2 sm:w-8/25 mb-2">
        <Select
          value={bulkAction}
          onValueChange={(value) => {
            setBulkAction(value)
          }}
        >
          <SelectTrigger className="w-full bg-white border-2 border-black">
            <SelectValue
              placeholder={"Bulk action"}
            />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem
              value={'approve'}
              className="hover:bg-gray-100 data-[state=checked]:bg-[#0F1E7A] data-[state=checked]:text-white"
            >
              Approve
            </SelectItem>
            <SelectItem
              value={'reject'}
              className="hover:bg-gray-100 data-[state=checked]:bg-[#0F1E7A] data-[state=checked]:text-white"
            >
              Deny
            </SelectItem>
          </SelectContent>
        </Select>
        <Dialog
          open={bulkItemModalOpen}
          onOpenChange={(open: boolean) => {
            setItemComment('');
            setBulkItemModalOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={!selectedItems.length}
                    className="px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer capitalize">
              Apply
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className='capitalize'>{bulkAction} Bulk Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{bulkAction === 'approve' ? 'Approval Comment' : 'Reason for Denial'} </Label>
                <Textarea
                  value={itemComment}
                  onChange={(e) =>
                    setItemComment(e.target.value)
                  }
                  placeholder={bulkAction === 'approve' ? "Add a comment for approval" : "Please provide a reason for denying this item(s)"}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                {bulkAction === 'approve' ? (<Button
                    onClick={() => approveBulkRequisitionItems().then(() => {
                      setBulkItemModalOpen(false);
                    })}
                    disabled={isItemRequestLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isItemRequestLoading ? "Approving..." : "Approve"}
                  </Button>) :
                  (<Button
                    onClick={() => rejectBulkRequisitionItems().then(() => {
                      setBulkItemModalOpen(false);
                    })}
                    disabled={isItemRequestLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isItemRequestLoading ? "Denying..." : "Deny"}
                  </Button>)
                }
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>)}
      <Table>
        <TableHeader>
          <TableRow>
            {userType === 'hod' && (<TableHead> <Checkbox
              id='header-checkbox'
              disabled={!pendingItems.length}
              checked={(pendingItems.length && (selectedItems.length === pendingItems.length)) || ((selectedItems.length < items.length && selectedItems.length > 0) && 'indeterminate')}
              onCheckedChange={(checked) =>
                handleItemCheck('header-checkbox', checked as boolean)
              }
              aria-label="Select all" />
            </TableHead>)}
            <TableHead>Item Name</TableHead>
            <TableHead>QTY</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              {userType === 'hod' && (<TableCell> <Checkbox
                id={item._id}
                disabled={item.status !== 'pending'}
                checked={selectedItems.includes(item._id)}
                onCheckedChange={(checked) =>
                  handleItemCheck(item._id, checked)
                }
              /></TableCell>)}
              <TableCell>{item.itemName}</TableCell>
              <TableCell>{item.units || "N/A"}</TableCell>
              <TableCell>
                {item.itemType[0].toUpperCase() + item.itemType.slice(1) ||
                  "N/A"}
              </TableCell>
              <TableCell>
                {item.status
                  ? <StatusBadge
                    status={item.status}
                    className="text-xs px-2 py-1"
                  />
                  : "N/A"}
              </TableCell>
              <TableCell className="flex gap-0">
                {/* Todo: make reusable isHod() and other methods based on user data. keep in auth*/}
                {userType === 'hod' ? (<Button
                  variant="default"
                  className="px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer capitalize"
                  onClick={() => onViewItem(item)}
                >
                  View
                </Button>) : (<><Button
                  variant="ghost"
                  className="!px-2 !lg:px-1"
                  onClick={() => onViewItem(item)}
                >
                  <Eye size={24} className="!text-[#0F1E7A]" />
                </Button>
                  <Button
                    variant="ghost"
                    className="!px-2 !lg:px-1"
                    disabled={!isEditMode}
                    onClick={() => onEditItem(item)}
                  >
                    <Edit size={24} className="!text-[#0F1E7A]" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="!px-2 !lg:px-1"
                    disabled={!isEditMode}
                    onClick={() => onDeleteItem(item._id)}
                  >
                    <Trash2 size={24} className="!text-red-500" />
                  </Button></>)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        disabled={!isEditMode}
        onClick={onAddNewItem}
        className="flex flex-row border border-[#0F1E7A] mt-5 cursor-pointer bg-white text-[#0F1E7A] hover:bg-gray-100 mt-10 mx-auto"
      >
        <Plus /> Add Another Item
      </Button>
    </div>
  );
}
