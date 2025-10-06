"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
import InpageSearch from "@/components/InpageSearch";
import DashboardCard from "@/components/DashboardCard";
import DataTable, { Column } from "@/components/DataTable";
import { UserTableData, userTableData } from "@/data/mock/tableData";

const dashboardCardItems = [
  {
    key: 1,
    imgSrc: "/requisition-requests.svg",
    title: "Requisition Requests",
    color: "#0F1E7A",
    value: 53,
  },
  {
    key: 2,
    imgSrc: "/pending-requests.svg",
    title: "Pendiing Requests",
    color: "#F59313",
    value: 9,
  },
  {
    key: 3,
    imgSrc: "/approved-requests.svg",
    title: "Approved Requests",
    color: "#26850B",
    value: 84,
  },
  {
    key: 4,
    imgSrc: "/rejected-requests.svg",
    title: "Rejected Requests",
    color: "#DE1216",
    value: 20,
  },
];

const columns: Column<UserTableData>[] = [
  { key: "description", label: "Item Description" },
  { key: "qty", label: "QTY" },
  { key: "uom", label: "UOM" },
  { key: "date", label: "Date" },
  { key: "brand", label: "Brand" },
  {
    key: "price",
    label: "Price",
    render: (value) => (
      <NumericFormat
        prefix="₦ "
        value={value}
        displayType="text"
        thousandSeparator=","
      />
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (value) => {
      const statusColors: Record<string, string> = {
        Approved: "text-green-500",
        "Pending HOD Approval": "text-orange-500",
        "Pending Procurement": "text-orange-400",
        "Pending Installation": "text-orange-300",
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
      <div className="flex gap-2 items-center">
        <Button
          asChild
          className="bg-blue-900 hover:bg-blue-800 text-white px-4"
        >
          <Link href={`/hhra/requests/${row.id}`}>View</Link>
        </Button>

        <Button
          asChild
          className="bg-blue-900 hover:bg-blue-800 text-white px-4"
        >
          <Link href={`/hhra/requests/${row.id}`}>Edit</Link>
        </Button>
      </div>
    ),
  },
];

const RequestionPage = () => {
  return (
    <div className="flex flex-col py-4 px-4 md:px-6 gap-4 !p-12 !pb-16">
      <div className="flex flex-col gap-4">
        <p className="text-2xl text-[#0F1E7A] font-semibold font-normal my-7">
          Summary
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-7">
          {dashboardCardItems.map((item) => (
            <DashboardCard key={item.key}>
              <div className={`flex gap-7 items-center text-[${item.color}]`}>
                <Image
                  src={item.imgSrc}
                  alt={item.title}
                  width={59}
                  height={59}
                />

                <div className="flex flex-col gap-2 text-center justify-center items-center">
                  <h2 className="text-2xl lg:text-[40px] font-bold">
                    {item.value}
                  </h2>

                  <p className="text-sm font-semibold">{item.title}</p>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center py-4">
        <p className="text-md md:text-2xl text-[#0F1E7A] font-semibold leading-5">
          Requests
        </p>
        <Button
          asChild
          className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
        >
          <Link href="/user/requisition?newRequest=newRequest">
            <Plus size={22} /> New Request
          </Link>
        </Button>
      </div>

      <InpageSearch size="large" className="mb-7" />

      <DataTable columns={columns} data={userTableData} />
    </div>
  );
};

export default RequestionPage;
