import RequestsCard from "@/components/Vendor/RequestsCard";
import VendorCard from "@/components/Vendor/VendorCard";
import React from "react";

const page = () => {
  return (
    <>
      <div className="flex flex-col py-4 px-4 md:px-6 gap-10">
        <div className="flex flex-col gap-4">
          <p className="text-3xl text-[#0F1E7A] font-normal">Summary</p>
          <VendorCard />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-3xl text-[#0F1E7A] font-normal">Requests</p>
          <RequestsCard />
        </div>
      </div>
    </>
  );
};

export default page;
