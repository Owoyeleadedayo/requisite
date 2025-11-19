import CardContent from "@/components/hhra/CardContent";
import HRTable from "@/components/hhra/HRTable";
import React from "react";

const Page = () => {
  return (
    <>
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
        </div>
      </div>
    </>
  );
};

export default Page;
