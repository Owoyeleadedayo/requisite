"use client"

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InpageSearch from "@/components/InpageSearch";
import DataTable, { Column } from "@/components/DataTable";
import { data as tableData, type Item } from "@/data/mock/tableData";

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
        <InpageSearch className="mt-20 mb-11" />

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
