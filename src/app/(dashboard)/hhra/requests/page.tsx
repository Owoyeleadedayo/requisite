"use client"

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable, { Column } from "@/components/DataTable";
import Link from "next/link";
import { data as tableData, Item } from "@/data/mock/tableData";

const columns: Column<Item>[] = [
  { key: "description", label: "Item Description" },
  { key: "qty", label: "QTY" },
  { key: "uom", label: "UOM" },
  { key: "date", label: "Date" },
  { key: "deadline", label: "Deadline" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  {
    key: "status",
    label: "Status",
    render: (value) => {
      const statusColors: Record<string, string> = {
        Complete: "text-green-500",
        Active: "text-yellow-500",
        Rejected: "text-red-500",
        Closed: "text-gray-500",
      };
      return <span className={statusColors[value] ?? ""}>{value}</span>;
    },
  },
  {
    key: "id",
    label: "Action",
    render: (_, row) => (
      <Button asChild className="bg-blue-900 hover:bg-blue-800 text-white px-4">
        <Link href={`/hhra/requests/${row.id}`}>
          View
        </Link>
      </Button>
    ),
  },
];

const Page = () => {
  return (
    <>
      <div className="flex flex-col px-4 md:px-8 gap-4 pb-16">
        <div className="w-full lg:w-[848px] flex flex-col md:flex-row gap-2 md:gap-6 mt-20 mb-11">
          <div className="relative w-[100%]">
            <Input
              type="text"
              placeholder="Search Item"
              className="bg-[#FFFFFF] pl-4 pr-4 py-2 w-full h-12 rounded-md shadow-md"
            />
            <Search
              color="black"
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>

          <Button className="h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer">
            Advanced search
          </Button>
        </div>

        <div className="">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl text-[#0F1E7A] font-semibold mb-0">
              Requests History
            </h1>
          </div>

          <DataTable columns={columns} data={tableData} />
        </div>
      </div>
    </>
  );
};

export default Page;
