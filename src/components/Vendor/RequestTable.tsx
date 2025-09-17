import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const RequestTable = () => {
  const tableItems = [
    {
      id: "1",
      itemDescription: "New Microphones",
      qty: 12,
      uom: 4,
      deadline: "08-May-2025",
      category: "CONST",
    },
    {
      id: "2",
      itemDescription: "Projector Screens",
      qty: 5,
      uom: 2,
      deadline: "12-May-2025",
      category: "EQUIP",
    },
    {
      id: "3",
      itemDescription: "Office Chairs",
      qty: 30,
      uom: 1,
      deadline: "15-May-2025",
      category: "FURN",
    },
    {
      id: "4",
      itemDescription: "Laptops",
      qty: 10,
      uom: 1,
      deadline: "20-May-2025",
      category: "IT",
    },
    {
      id: "5",
      itemDescription: "Stationery Supplies",
      qty: 200,
      uom: 50,
      deadline: "25-May-2025",
      category: "OFFICE",
    },
    {
      id: "6",
      itemDescription: "Air Conditioners",
      qty: 6,
      uom: 1,
      deadline: "30-May-2025",
      category: "ELEC",
    },
    {
      id: "7",
      itemDescription: "LED Monitors",
      qty: 15,
      uom: 1,
      deadline: "02-Jun-2025",
      category: "IT",
    },
    {
      id: "8",
      itemDescription: "Conference Tables",
      qty: 3,
      uom: 1,
      deadline: "05-Jun-2025",
      category: "FURN",
    },
    {
      id: "9",
      itemDescription: "Networking Cables",
      qty: 100,
      uom: 20,
      deadline: "08-Jun-2025",
      category: "IT",
    },
    {
      id: "10",
      itemDescription: "Whiteboards",
      qty: 8,
      uom: 2,
      deadline: "10-Jun-2025",
      category: "EQUIP",
    },
  ];
  
  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Item Description</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>UOM</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {tableItems.map((item, index) => (
              <TableRow key={index}> 
              <TableCell>{item.itemDescription}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{item.uom}</TableCell>
              <TableCell>{item.deadline}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <Link href={"/vendor/requests?view=make-bid"}>
                <Button className="bg-[#0F1E7A] text-white cursor-pointer capitalize">
                  Make Bid
                </Button>
                </Link>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RequestTable;
