"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
import DashboardCard from "@/components/DashboardCard";
import DataTable, { Column } from "@/components/DataTable";
import { API_BASE_URL } from "@/lib/config";
import { getToken, getUserId, getAuthData } from "@/lib/auth";

interface ProcurementManagerDashboardProps {
  page?:
    | "procurementDashboard"
    | "procurementRequisitions"
    | "pmRequests"
    | "procurementBids";
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
  requester: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
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
        procurementApproved: "text-blue-500",
        cancelled: "text-red-500",
        pending: "text-orange-500",
        bidding: "text-purple-500",
      };
      return (
        <span className={statusColors[value] ?? "text-gray-500"}>{value}</span>
      );
    },
  },
  {
    key: "department",
    label: "Department",
    render: (value) => value.name,
  },
  {
    key: "_id",
    label: "Action",
    render: (_, row) => (
      <div className="flex gap-2 items-center">
        <Button
          asChild
          className="bg-blue-900 hover:bg-blue-800 text-white px-4"
        >
          <Link href={`/pm/requests/${row._id}`}>View</Link>
        </Button>
        {/* <Button
          asChild
          className="bg-green-600 hover:bg-green-700 text-white px-4"
        >
          <Link href={`/procurement/bids/${row._id}`}>Manage Bids</Link>
        </Button> */}
      </div>
    ),
  },
];

export default function PMDashboard({
  page = "procurementDashboard",
}: ProcurementManagerDashboardProps = {}) {
  const [loading, setLoading] = useState(false);
  const [requisitions, setRequisitions] = useState<RequisitionShape[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    bidding: 0,
  });

  const itemsPerPage: number = 10;

  const userId = getUserId();
  const token = getToken();
  const authdata = getAuthData();

  const dashboardCardItems = [
    {
      key: 1,
      imgSrc: "/vendor-application.svg",
      title: "Vendor Application",
      color: "#0F1E7A",
      value: dashboardStats.total,
    },
    {
      key: 2,
      imgSrc: "/current-bids.svg",
      title: "Bids Created",
      color: "#0F1E7A",
      value: dashboardStats.pending,
    },
    {
      key: 3,
      imgSrc: "/requisition-requests.svg",
      title: "Requisitions Requests",
      color: "#0F1E7A",
      value: dashboardStats.approved,
    },
    {
      key: 4,
      imgSrc: "/pm-requests.svg",
      title: "My Requests",
      color: "#0F1E7A",
      value: dashboardStats.bidding,
    },
  ];

  const fetchRequisitions = useCallback(
    async (pageNum: number = 1) => {
      setLoading(true);

      try {
        const endpoint =
          page === "procurementDashboard" || page === "procurementRequisitions"
            ? `${API_BASE_URL}/requisitions?page=${pageNum}&limit=${itemsPerPage}`
            : `${API_BASE_URL}/users/${userId}/requisitions?page=${pageNum}&limit=${itemsPerPage}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success) {
          setRequisitions(data.data);

          if (data.pagination) {
            setCurrentPage(data.pagination.page);
            setTotalPages(data.pagination.pages);
            setTotalCount(data.pagination.total);
          } else {
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setTotalCount(data.total);
          }

          const stats = {
            total: data.pagination?.total || data.total,
            pending: 0,
            approved: 0,
            bidding: 0,
          };

          data.data.forEach((req: RequisitionShape) => {
            if (req.status === "departmentApproved") stats.pending++;
            else if (req.status === "procurementApproved") stats.approved++;
            else if (req.status === "bidding") stats.bidding++;
          });

          setDashboardStats(stats);
        }
      } catch (error) {
        console.error("Error fetching requisitions:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, page, userId]
  );

  useEffect(() => {
    if (token) {
      fetchRequisitions(1);
    }
  }, [token, fetchRequisitions]);

  const handlePageChange = (page: number) => {
    fetchRequisitions(page);
  };

  return (
    <div className="flex flex-col gap-4 p-6 lg:p-12 !pb-16">
      {page === "procurementDashboard" && (
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
          {page === "procurementBids"
            ? "Bid Management"
            : page === "pmRequests"
            ? "My Requests"
            : "Requests"}
        </p>

        {/* {page !== "procurementRequisitions" && (
          <Button
            asChild
            className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
          >
            <Link href="/pm/my-request/create-new">
              <Plus size={22} />{" "}
              <span className="hidden lg:flex">New Request</span>
            </Link>
          </Button>
        )} */}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A]"></div>
          <span className="ml-2 text-gray-600">Loading requisitions...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={requisitions}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}
