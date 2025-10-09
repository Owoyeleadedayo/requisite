import Link from "next/link";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const HistoryTable = () => {
  const tableItems = [
    {
      id: "1",
      ItemDesc: "Desk Lamp",
      qty: 50,
      uom: 8,
      date: "29-May-2025",
      deadline: "29-May-2025",
      category: "IT",
      price: 8000,
      status: "Approved",
    },
    {
      id: "2",
      ItemDesc: "Office Chair",
      qty: 20,
      uom: 4,
      date: "12-May-2025",
      deadline: "19-May-2025",
      category: "Furniture",
      price: 45000,
      status: "Pending",
    },
    {
      id: "3",
      ItemDesc: "Laptop XPS 13",
      qty: 12,
      uom: 2,
      date: "08-May-2025",
      deadline: "15-May-2025",
      category: "IT",
      price: 100000,
      status: "Approved",
    },
    {
      id: "4",
      ItemDesc: "Printer Toner",
      qty: 30,
      uom: 10,
      date: "18-May-2025",
      deadline: "25-May-2025",
      category: "Office Supplies",
      price: 15000,
      status: "Rejected",
    },
    {
      id: "5",
      ItemDesc: "Projector",
      qty: 5,
      uom: 1,
      date: "15-May-2025",
      deadline: "22-May-2025",
      category: "Electronics",
      price: 120000,
      status: "Pending",
    },
    {
      id: "6",
      ItemDesc: "External Hard Drive",
      qty: 15,
      uom: 3,
      date: "23-May-2025",
      deadline: "30-May-2025",
      category: "IT",
      price: 25000,
      status: "Approved",
    },
    {
      id: "7",
      ItemDesc: "Air Conditioner",
      qty: 4,
      uom: 2,
      date: "26-May-2025",
      deadline: "02-Jun-2025",
      category: "Facilities",
      price: 180000,
      status: "Pending",
    },
    {
      id: "8",
      ItemDesc: "Conference Table",
      qty: 2,
      uom: 1,
      date: "20-May-2025",
      deadline: "27-May-2025",
      category: "Furniture",
      price: 200000,
      status: "Rejected",
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
              <TableHead>Date</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {tableItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.ItemDesc}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.deadline}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell
                  className={
                    item.status === "Approved"
                      ? "text-[#26850B]"
                      : item.status === "Pending"
                      ? "text-[#F6B40E]"
                      : "text-[#DE1216]"
                  }
                >
                  {item.status}
                </TableCell>
                <TableCell>
                  <Link
                    href={
                      item.status === "Pending"
                        ? "/hhra/request?view=pending"
                        : item.status === "Rejected"
                        ? "/hod/requisitions?view=denied"
                        : "/hod/requisitions?view=accepted"
                    }
                  >
                    <Button className="bg-[#0F1E7A] text-white cursor-pointer capitalize">
                      View
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

export default HistoryTable;
