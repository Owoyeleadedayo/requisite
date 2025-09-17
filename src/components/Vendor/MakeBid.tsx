import { AlarmClock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const MakeBid = () => {
  return (
    <>
      <div className="flex flex-col  gap-4">
        <p className="text-3xl text-[#0F1E7A] font-semibold px-4 py-4 md:px-6">View Request</p>
        <div className="grid grid-cols-[50%_40%] px-4 md:px-6 gap-24">
        <div className="flex flex-col bg-white gap-2 py-6  rounded-md shadow-md">
          <div className="flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F6B40E]" />
              <p className="text-sm text-[#F6B40E] font-medium">Active Bids</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white border border-[#0F1E7A] text-[#0F1E7A] font-medium">
                IT Dept
              </Badge>
              <Badge className="bg-white border border-[#0F1E7A] text-[#0F1E7A] font-medium">
                General
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 my-2 px-4">
            <AlarmClock color="#0F1E7A" />
            <p className="text-base text-[#0F1E7A] font-normal">
              Ending in <span className="font-semibold">10</span> days
            </p>
          </div>
          <div className="flex bg-[#D9D9D9] justify-center items-center">
            <Image
              src="/product.png"
              alt="product"
              width={200}
              height={200}
              className="object-contain items-center py-8"
            />
          </div>
          <div className="flex flex-col gap-3 px-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-base text-[#0F1E7A] font-semibold">
                  Alienware
                </p>
                <p className="text-base text-[#0F1E7A] font-light">
                  Aurora R12 RTX{" "}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-base text-end text-[#DE1216] font-semibold">
                  Deadline
                </p>
                <p className="text-base text-[#DE1216] font-light">
                  26th of June, 2025
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-base text-[#0F1E7A] font-semibold">
                Item Description
              </p>
              <p className="text-base text-[#0F1E7A] font-light">
                GeForce RTX 3080 10GB GDDR6X, Intel Core i7 11700KF, 16GB HyperX
                Fury DDR4 XMP RAM, 1TB HDD + 512GB SSD, Lunar Light
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-base text-[#0F1E7A] font-semibold">
                Department
              </p>
              <p className="text-base text-[#0F1E7A] font-light">
                Information Technology
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-base text-[#0F1E7A] font-semibold">Quantity</p>
              <p className="text-base text-[#0F1E7A] font-light">20 Units</p>
            </div>
            <div className="flex flex-col">
              <p className="text-base text-[#0F1E7A] font-semibold">Comments</p>
              <p className="text-base text-[#0F1E7A] font-light">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[500px] h-[500px] bg-white gap-4 py-6 px-4 rounded-md shadow-md">
          <p className="text-3xl text-[#0F1E7A] font-semibold">Make Bid</p>
          <div className="grid w-full">
            <Label htmlFor="bidamount" className="text-base">
              Bid Amount(₦)
            </Label>
            <Input type="number" id="bidamount" className="border h-12" />
          </div>
          <div className="grid w-full">
            <Label htmlFor="deliverydate" className="text-base">
              Delivery Date
            </Label>
            <Input type="text" id="deliverydate" className="border h-12" />
          </div>
          <div className="grid w-full">
            <Label className="text-base">Additional Information</Label>
            <Textarea className="h-30" />
          </div>

          <div className="flex justify-center items-center gap-6 mt-2">
            <Dialog
            >
              <DialogTrigger asChild>
                <Button className="bg-[#0F1E7A] px-6 text-base text-white cursor-pointer">
                  Make Bid
                </Button>
              </DialogTrigger>
              <DialogContent className="flex flex-col bg-white w-[400px] h-[200px] justify-center items-center">
                <DialogHeader className="flex items-center">
                  <p className="text-2xl text-[#0F1E7A] font-semibold">Bid Received</p>
                  <p className="text-sm text-[#0F1E7A] font-light">You bid is in review</p>
                  <Link href={"/vendor"}>
                  <Button className="bg-[#0F1E7A] px-12  text-base text-white mt-4 cursor-pointer">Go to Dashboard</Button>
                  </Link>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button className="bg-[#ED3237] px-8 text-base text-white cursor-pointer">
              Close
            </Button>
          </div>
        </div>
      </div>
      </div>
      
    </>
  )
}

export default MakeBid
