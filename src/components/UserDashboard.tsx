"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
import InpageSearch from "@/components/InpageSearch";
import DashboardCard from "@/components/DashboardCard";
import DataTable, { Column } from "@/components/DataTable";
import { API_BASE_URL } from "@/lib/config";
import { getToken, getUser, getUserId } from "@/lib/auth";

interface UserDashboardProps {
  page?: "userDashboard" | "userRequisition";
}

type RequisitionShape = {
  _id: string;
  title: string;
  category: string;
  description: string;
  quantityNeeded: number;
  image: string;
  estimatedUnitPrice: number;
  priority: string;
  justification: string;
  requester: string;
  department: {
    _id: string;
    name: string;
    code: string;
  };
  status: string;
  selectedVendors: [];
  paymentStatus: string;
  paymentAmount: 0;
  shortlistedVendors: [];
  deadlineExtensions: [];
  approvals: [
    {
      stage: string;
      approver: string;
      status: string;
      timestamp: string;
      _id: string;
      comments: string;
    }
  ];
  requisitionNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

const columns: Column<RequisitionShape>[] = [
  { key: "title", label: "Title" },
  { key: "quantityNeeded", label: "QTY" },
  { key: "category", label: "Category" },
  {
    key: "createdAt",
    label: "Date",
    render: (value) => {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
  {
    key: "estimatedUnitPrice",
    label: "Price",
    render: (value) => (
      <NumericFormat
        prefix="₦ "
        value={value}
        decimalScale={2}
        fixedDecimalScale
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
        draft: "text-gray-500",
        departmentApproved: "text-green-500",
        cancelled: "text-red-500",
        pending: "text-orange-500",
      };
      return (
        <span className={statusColors[value] ?? "text-gray-500"}>{value}</span>
      );
    },
  },
  { key: "requisitionNumber", label: "Req. Number" },
  {
    key: "_id",
    label: "Action",
    render: (_, row) => (
      <div className="flex gap-2 items-center">
        <Button
          asChild
          className="bg-blue-900 hover:bg-blue-800 text-white px-4"
        >
          <Link href={`/user/requisition/${row._id}`}>View</Link>
        </Button>

        <Button
          asChild
          className="bg-blue-900 hover:bg-blue-800 text-white px-4"
        >
          <Link href={`/user/requisition/${row._id}?mode=edit`}>Edit</Link>
        </Button>
      </div>
    ),
  },
];

export default function UserDashboard({
  page = "userDashboard",
}: UserDashboardProps = {}) {
  const [loading, setLoading] = useState(false);
  const [requisitions, setRequisitions] = useState<RequisitionShape[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // const user = getUser();
  const userId = getUserId();
  const token = getToken();

  const dashboardCardItems = [
    {
      key: 1,
      imgSrc: "/requisition-requests.svg",
      title: "Total Requests",
      color: "#0F1E7A",
      value: dashboardStats.total,
    },
    {
      key: 2,
      imgSrc: "/pending-requests.svg",
      title: "Pending Requests",
      color: "#F59313",
      value: dashboardStats.pending,
    },
    {
      key: 3,
      imgSrc: "/approved-requests.svg",
      title: "Approved Requests",
      color: "#26850B",
      value: dashboardStats.approved,
    },
    {
      key: 4,
      imgSrc: "/rejected-requests.svg",
      title: "Rejected Requests",
      color: "#DE1216",
      value: dashboardStats.rejected,
    },
  ];

  useEffect(() => {
    const fetchRequisitions = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/users/${userId}/requisitions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          setRequisitions(data.data);

          const stats = data.data.reduce(
            (acc: any, req: RequisitionShape) => {
              //eslint-disable-line @typescript-eslint/no-explicit-any
              acc.total++;
              if (req.status === "draft" || req.status === "pending")
                acc.pending++;
              else if (req.status === "departmentApproved") acc.approved++;
              else if (req.status === "cancelled") acc.rejected++;
              return acc;
            },
            { total: 0, pending: 0, approved: 0, rejected: 0 }
          );
          setDashboardStats(stats);
        }
      } catch (error) {
        console.error("Error fetching requisitions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequisitions();
  }, [userId, token]);

  return (
    <div className="flex flex-col gap-4 p-6 lg:p-12 !pb-16">
      {page === "userDashboard" && (
        <div className="flex flex-col gap-4">
          <p className="text-2xl text-[#0F1E7A] font-semibold font-normal">
            Summary
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      )}

      <div className="flex justify-between items-center py-4">
        <p className="text-md md:text-2xl text-[#0F1E7A] font-semibold leading-5">
          Requests
        </p>
        <Button
          asChild
          className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
        >
          <Link href="/user/requisition/create-new">
            <Plus size={22} /> New Request
          </Link>
        </Button>
      </div>

      {/* <InpageSearch size="large" className="mb-7" /> */}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A]"></div>
          <span className="ml-2 text-gray-600">Loading requisitions...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={requisitions} />
      )}
    </div>
  );
}
