"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import getLocationName from "@/lib/getLocationName";
import { NumericFormat } from "react-number-format";
import { Vendor } from "@/components/Requests/types";
import DashboardCard from "@/components/DashboardCard";
import DataTable, { Column } from "@/components/DataTable";
import { getToken, getUserId, getAuthData } from "@/lib/auth";
import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function VendorDashboard() {
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [locations, setLocations] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    bidding: 0,
  });
  const [searchResults, setSearchResults] = useState<Vendor[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const token = getToken();
  const userId = getUserId();
  const authdata = getAuthData();
  const itemsPerPage: number = 10;

  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data) {
        setLocations(data);
      }
    } catch (error) {
      console.error("Failed to fetch locations", error);
    }
  }, [token]);

  const columns: Column<Vendor>[] = [
    { key: "name", label: "Vendor Name" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "categories",
      label: "Categories",
      render: (value) =>
        value
          ?.map((cat: { _id: string; name: string }) => cat.name)
          .join(", ") || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const statusColors: Record<string, string> = {
          approved: "text-green-500",
          pending: "text-orange-500",
          rejected: "text-red-500",
        };
        return (
          <span className={statusColors[value || "pending"] ?? "text-gray-500"}>
            {value || "pending"}
          </span>
        );
      },
    },
    {
      key: "isVerified",
      label: "Verified",
      render: (value) => (
        <span className={value ? "text-green-500" : "text-red-500"}>
          {value ? "Yes" : "No"}
        </span>
      ),
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
            <Link href={`/pm/vendors/${row._id}`}>View</Link>
          </Button>
        </div>
      ),
    },
  ];

  const dashboardCardItems = [
    {
      key: 1,
      imgSrc: "/vendor-application.svg",
      title: "Total Vendors",
      color: "#0F1E7A",
      value: dashboardStats.total,
    },
    {
      key: 2,
      imgSrc: "/current-bids.svg",
      title: "Approved Vendors",
      color: "#0F1E7A",
      value: dashboardStats.pending,
    },
    {
      key: 3,
      imgSrc: "/requisition-requests.svg",
      title: "Pendng Vendors",
      color: "#0F1E7A",
      value: dashboardStats.approved,
    },
    {
      key: 4,
      imgSrc: "/pm-requests.svg",
      title: "Deactivated Vendors",
      color: "#0F1E7A",
      value: dashboardStats.bidding,
    },
  ];

  const fetchVendors = useCallback(
    async (pageNum: number = 1) => {
      setLoading(true);

      try {
        const endpoint = `${API_BASE_URL}/vendors?page=${pageNum}&limit=${itemsPerPage}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success) {
          setVendors(data.data);

          if (data.pagination) {
            setCurrentPage(data.pagination.page);
            setTotalPages(data.pagination.pages);
            setTotalCount(data.pagination.total);
          }

          const stats = {
            total: data.pagination?.total || data.total,
            pending: 0,
            approved: 0,
            bidding: 0,
          };

          data.data.forEach((vendor: Vendor) => {
            if (vendor.status === "pending") stats.pending++;
            else if (vendor.status === "approved") stats.approved++;
            if (vendor.isVerified) stats.bidding++;
          });

          setDashboardStats(stats);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchLocations();
      fetchVendors(1);
    }
  }, [token, fetchVendors, fetchLocations]);

  const handlePageChange = (page: number) => {
    fetchVendors(page);
  };

  const handleSearchResults = (results: unknown[], totalPages: number) => {
    setSearchResults(results as Vendor[]);
    setIsSearchActive(true);
    setTotalPages(totalPages);
  };

  const handleClearSearch = () => {
    setIsSearchActive(false);
    setSearchResults([]);
    fetchVendors(1); // Restore original data
  };

  return (
    <div className="flex flex-col gap-4 p-6 lg:p-12 !pb-16">
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

      <div className="flex justify-between items-center py-4">
        <p className="text-md md:text-2xl text-[#0F1E7A] font-semibold leading-5">
          Vendors
        </p>

        {/* <Button
          asChild
          className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
        >
          <Link href="/pm/my-requests/create-new">
            <Plus size={22} />{" "}
            <span className="hidden lg:flex">Add Vendor</span>
          </Link>
        </Button> */}
        <Dialog>
          <DialogTrigger className="bg-white" asChild>
            <Button className="bg-[#0F1E7A] text-white cursor-pointer">
              <Plus size={22} /> Add New Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-[500px]">
            <DialogHeader></DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex justify-center items-center">
                  <p className="text-xl font-semibold text-center text-[#100A1A]">
                    New Vendor
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <p className="text-md text-center font-normal">
                    Enter the details of vendor below
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="space-y-2">
                    <Label>
                      Company Name <span className="text-red-500 -ml-1">*</span>
                    </Label>
                    <Input
                      type={"text"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Contact Person
                      <span className="text-red-500 -ml-1">*</span>
                    </Label>
                    <Input
                      type={"text"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Contact Person Designation
                      <span className="text-red-500 -ml-1">*</span>
                    </Label>
                    <Input
                      type={"text"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type={"email"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Phone Number
                      <span className="text-red-500 -ml-1">*</span>
                    </Label>
                    <Input
                      type={"tel"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      type={"text"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Website
                      <span className="text-red-500 -ml-1">*</span>
                    </Label>
                    <Input
                      type={"text"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Date of Incroporation
                      <span className="text-red-500 -ml-1">*</span>
                    </Label>
                    <Input
                      type={"text"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Categories
                      <span className="text-red-500 -ml-1">*</span>
                    </Label>
                    <Input
                      type={"text"}
                      className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <Button className="bg-[#0F1E7A] text-white cursor-pointer">
                    Add Vendor
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A]"></div>
          <span className="ml-2 text-gray-600">Loading vendors...</span>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={isSearchActive ? searchResults : vendors}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={loading}
          searchEndpoint="/vendors"
          onSearchResults={handleSearchResults}
          onClearSearch={handleClearSearch}
        />
      )}
    </div>
  );
}
