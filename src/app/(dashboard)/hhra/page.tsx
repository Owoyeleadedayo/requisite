<<<<<<< HEAD
"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DashboardCard from "@/components/DashboardCard";
import DataTable, { Column } from "@/components/DataTable";
import { data as tableData, type Item } from "@/data/mock/tableData";

const dashboardCardItems = [
  {
    key: 1,
    imgSrc: "/current-bids.svg",
    title: "Current Bids",
    color: "#0F1E7A",
    value: 40,
  },
  {
    key: 2,
    imgSrc: "/active-bids.svg",
    title: "Active Bids",
    color: "#F6B40E",
    value: 10,
  },
  {
    key: 3,
    imgSrc: "/completed-bids.svg",
    title: "Completed Bids",
    color: "#26850B",
    value: 10,
  },
  {
    key: 4,
    imgSrc: "/rejected-bids.svg",
    title: "Rejected Bids",
    color: "#DE1216",
    value: 10,
  },
  {
    key: 5,
    imgSrc: "/closed-bids.svg",
    title: "Closed Bids",
    color: "#767676",
    value: 10,
  }
]

const columns: Column<Item>[] = [
  { key: "description", label: "Item Description" },
  { key: "qty", label: "QTY" },
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
=======
import CardContent from "@/components/hhra/CardContent";
import HRTable from "@/components/hhra/HRTable";
import React from "react";
>>>>>>> vendorPage

const Page = () => {
  return (
    <>
<<<<<<< HEAD
      <div className="flex flex-col pb-16 px-4 md:px-6 gap-4">
        <p className="text-3xl text-[#0F1E7A] font-semibold mt-18">Summary</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-7">
          {dashboardCardItems.map((item) => (
            <DashboardCard key={item.key}>
              <div className={`flex gap-7 items-center text-[${item.color}]`}>
                <Image src={item.imgSrc} alt={item.title} width={59} height={59} />

                <div className="flex flex-col gap-2 text-center justify-center items-center">
                  <h2 className="text-2xl lg:text-[40px] font-bold">{item.value}</h2>
                  <p className="text-sm font-semibold">{item.title}</p>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-2xl text-[#0F1E7A] font-semibold mb-8">
              Request
            </p>
          </div>

          <DataTable columns={columns} data={tableData} />
=======
      <div className="flex flex-col py-4 px-4 md:px-6 gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-3xl text-[#0F1E7A] font-normal">Summary</p>
          <CardContent />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-2xl text-[#0F1E7A] font-medium ">
            Requests
          </p>
          <HRTable />
>>>>>>> vendorPage
        </div>
      </div>
    </>
  );
};

export default Page;
