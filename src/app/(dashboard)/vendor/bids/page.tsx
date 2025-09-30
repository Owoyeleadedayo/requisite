"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BidTable from "@/components/Vendor/BidTable";
import MakeBid from "@/components/Vendor/MakeBid";
import ViewBid from "@/components/Vendor/ViewBid";
import ViewRequest from "@/components/Vendor/ViewRequest";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function BidsPageContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  if (view === "new") {
    return <ViewRequest />;
  }

  if (view === "make-bid") {
    return <ViewBid />;
  }

  if (view === "view-bid") {
    return <MakeBid />;
  }

  return (
    <div className="flex flex-col py-4 px-4 md:px-6 gap-10">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
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
        <Button className="h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer capitalize">
          advanced search
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-2xl text-[#0F1E7A] font-medium ">Requests</p>
      </div>
      <BidTable />
    </div>
  );
}

export default function BidsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BidsPageContent />
    </Suspense>
  );
}
