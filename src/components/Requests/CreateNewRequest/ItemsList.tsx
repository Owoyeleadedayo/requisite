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
import { Folder, Edit, Trash2, Plus } from "lucide-react";
import { Item } from "./types";

interface ItemsListProps {
  items: Item[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: number) => void;
  onAddNewItem: () => void;
}

export default function ItemsList({
  items,
  onEditItem,
  onDeleteItem,
  onAddNewItem,
}: ItemsListProps) {
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

  return (
    <div className="w-full bg-white border-2 border-[#e5e5e5e5] rounded-xl shadow-xl p-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>QTY</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.itemName}</TableCell>
              <TableCell>{item.units || "N/A"}</TableCell>
              <TableCell>
                {item.itemType[0].toUpperCase() + item.itemType.slice(1) ||
                  "N/A"}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => onEditItem(item)}
                >
                  <Edit className="text-[#0F1E7A] h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => onDeleteItem(item.id)}
                >
                  <Trash2 className="text-red-500 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={onAddNewItem}
        className="flex flex-row border border-[#0F1E7A] mt-5 cursor-pointer bg-white text-[#0F1E7A] hover:bg-gray-100 mt-10 mx-auto"
      >
        <Plus /> Add Another Item
      </Button>
    </div>
  );
}
