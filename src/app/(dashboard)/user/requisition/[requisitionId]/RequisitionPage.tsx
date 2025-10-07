"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TableContent from "@/components/TableContent";
import InpageSearch from "@/components/InpageSearch";

export default function RequisitionsPage() {
  return (
    <>
      <div className="flex flex-col py-4 px-4 md:px-6 gap-4">
        <InpageSearch size="large" className="w-full md:w-1/2" />

        <div className="flex justify-between items-center py-4 gap-2">
          <p className="text-md md:text-2xl text-[#0F1E7A] font-medium leading-5">
            Request
          </p>
          <Button className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer">
            <Plus size={22} /> New Request
          </Button>
        </div>

        <TableContent />
      </div>
    </>
  );
}
