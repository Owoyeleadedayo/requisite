"use client";
import { Item } from "../../types";
import ItemsTable from "./ItemsTable";
import AddItemDialog from "./AddItemDialog";

interface RequestDetailsProps {
  items: Item[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  dialogSelectedItems: string[];
  setDialogSelectedItems: (items: string[]) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onEditItem: (item: Item) => void;
}

export default function RequestDetails({
  items,
  selectedItems,
  setSelectedItems,
  dialogSelectedItems,
  setDialogSelectedItems,
  isDialogOpen,
  setIsDialogOpen,
  onEditItem,
}: RequestDetailsProps) {
  const handleDeleteItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((id) => id !== itemId));
  };

  const handleAddItems = () => {
    if (dialogSelectedItems.length === 0) {
      return;
    }
    setSelectedItems([...dialogSelectedItems]);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-md font-bold">REQUEST DETAILS</p>
      <p className="text-md font-normal text-[#4F7396]">
        Choose the items that you would like to add to the RFQ below. Note
        that you can edit any of the items to fit the relevant
        specifications.
      </p>

      <ItemsTable
        items={items}
        selectedItems={selectedItems}
        onEditItem={onEditItem}
        onDeleteItem={handleDeleteItem}
      />

      <AddItemDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        items={items}
        selectedItems={selectedItems}
        dialogSelectedItems={dialogSelectedItems}
        setDialogSelectedItems={setDialogSelectedItems}
        onAddItems={handleAddItems}
      />
    </div>
  );
}