"use client";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Item } from "../../types";

interface ItemsTableProps {
  items: Item[];
  selectedItems: string[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
}

export default function ItemsTable({
  items,
  selectedItems,
  onEditItem,
  onDeleteItem,
}: ItemsTableProps) {
  return (
    <div className="flex flex-col w-full gap">
      <div className="flex gap-3">
        <Select>
          <SelectTrigger className="w-[180px] border border-[#9f9f9f]">
            <SelectValue placeholder="Bulk Actions" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="approve">Approve</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-[#0F1E7A] text-white cursor-pointer capitalize">
          Apply
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items
              .filter((item) => selectedItems.includes(item._id))
              .map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.UOM || "N/A"}</TableCell>
                  <TableCell>{item.units || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div
                        className="cursor-pointer"
                        onClick={() => onEditItem(item)}
                      >
                        <SquarePen size={18} color="#0F1E7A" />
                      </div>
                      <div
                        className={`cursor-pointer ${
                          selectedItems.length === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (selectedItems.length > 1) {
                            onDeleteItem(item._id);
                          }
                        }}
                      >
                        <Trash
                          size={18}
                          color={
                            selectedItems.length === 1
                              ? "#9CA3AF"
                              : "#ED3237"
                          }
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}