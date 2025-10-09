"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const VendorDetails = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col py-4 px-4 md:px-6 gap-4">
        <div
          onClick={() => router.back()}
          className="flex w-7 h-7 border-1 border-[#0F1E7A] rounded-full justify-center items-center"
        >
          <ArrowLeft color="#0F1E7A" size={18} className="cursor-pointer" />
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col bg-white w-[600px] px-6 py-8 rounded-xl shadow-md">
            <div className="flex flex-col gap-3">
              <p className="text-3xl text-[#0F1E7A] font-medium capitalize">vendor application</p>
              <p>HP Nigeria </p>
              <div className="flex flex-col">
                <p>Contact Person</p>
                <p className="font-semibold">Nancy</p>
              </div>
              <div className="flex flex-col">
                <p>Phone Number</p>
                <p className="font-semibold">+234 808xxxxxx</p>
              </div>
              <div className="flex flex-col">
                <p>Email Address</p>
                <p className="font-semibold">nancy@gmail.com </p>
              </div>
              <div className="flex flex-col">
                <p>Category</p>
                <p className="font-semibold">IT, Office Supplies</p>
              </div>
              <div className="flex flex-col">
                <p>Address</p>
                <p className="font-semibold">2 Ziatech Road, Oregun, Ikeja</p>
              </div>
              <div className="flex flex-col">
                <p>Date of Incorporation</p>
                <p className="font-semibold">24th of May, 2016</p>
              </div>
              <div className="flex flex-col">
                <p>Designation</p>
                <p className="font-semibold">xxxxx</p>
              </div>
              <div className="flex flex-col">
                <p>CAC Document</p>
                <p className="font-semibold">view file</p>
              </div>
              <div className="flex flex-col">
                <p>Website</p>
                <p className="font-semibold">https:xxxxxxxxxxxxxx</p>
              </div>
            </div>
            <div className="flex justify-center items-center my-4 gap-4">
                <Button className="bg-[#0F1E7A] border border-[#0F1E7A] px-10 text-white font-medium">Approve</Button>
                <Button className="bg-[#ED323726] border border-[#DE1216] px-10 text-[#DE1216] font-medium">Remove</Button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDetails;
