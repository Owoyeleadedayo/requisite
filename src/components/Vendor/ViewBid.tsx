"use client";
import { ChevronsDown, ChevronsUp, Ellipsis, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const ViewBid = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      
      <div className="grid grid-cols-[50%_40%] py-4 px-4 md:px-6 gap-24">
        <div className="flex flex-col bg-white gap-4 py-6 rounded-md shadow-md">
          <p className="text-4xl text-[#0F1E7A] font-semibold px-4">
            View Request
          </p>

          <div className="flex flex-col relative">
            <div className="flex bg-[#D9D9D9] justify-center items-center mt-2">
              <Image
                src="/product.png"
                alt="product"
                width={250}
                height={250}
                className="object-contain items-center py-10"
              />
            </div>
            <div className="absolute top-0 right-0 translate-y-3">
              <Badge className="bg-[#FF3B30] text-white font-medium rounded-none">
                You have already made a bid
              </Badge>
            </div>
          </div>

          <div className="flex flex-col px-4 gap-2">
            <p className="text-base font-light">
              Alienware Aurora R12 RTX 3080 Gaming Desktop- NVIDIA GEForce
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">Bid Amount(₦)</p>
                <p className="text-base font-light">5,000,000</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">Quantity</p>
                <p className="text-base font-light">20</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">Category</p>
                <p className="text-base font-light">
                  New office laptop for office use
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold">Delivery Date</p>
                <p className="text-base font-light">24th of June, 2025</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold">Status</p>
              <p className="text-base text-[#F6B40E] font-light">Active</p>
            </div>

            <div className="flex flex-col gap-4">
              {expanded && (
                <>
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold">Item Description</p>
                    <p className="text-base font-light line-clamp-2">
                      GeForce RTX 3080 10GB GDDR6X, Intel Core i7 11700KF, 16GB
                      HyperX Fury DDR4 XMP RAM, 1TB HDD + 512GB SSD, Lunar Light
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold">
                      Additional Information
                    </p>
                    <p className="text-base font-light">Nil</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold">
                      Comment from Procurement Manager
                    </p>
                    <p className="text-base font-light">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud
                    </p>
                  </div>
                </>
              )}

              <Button
                variant="ghost"
                className="self-start text-base px-0 text-[#0F1E7A] font-medium capitalize cursor-pointer"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    See Less <ChevronsUp />{" "}
                  </>
                ) : (
                  <>
                    See More <ChevronsDown />
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-center items-center mt-2">
              <Button className="bg-[#ED3237] text-xl text-white font-medium px-10 cursor-pointer">
                Close
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[500px] h-[430px] bg-white gap-6 py-6 px-4 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <p className="text-xl text-[#0F1E7A] font-medium">Comments</p>
            <X />
          </div>
          <div className="flex gap-3 ">
            <div>
              <Image
                src="/avatar.png"
                alt=""
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col ">
              <div className="flex items-center justify-between">
                <div className="flex flex-col ">
                  <p className="text-md font-semibold">Benson John</p>
                  <p className="text-sm font-light">27 Mins ago</p>
                </div>
              </div>

            </div>
          </div>
          <div className="flex items-center gap-4">
          <Badge className="bg-[#0F1E7A26] text-sm text-[#0F1E7A] font-medium">daramola@daystar.org</Badge>
          <Badge className="bg-[#7A0F4A26] text-sm text-[#7A0F4A] font-medium">Nkemjika@daystar.org</Badge>
          </div>
          <div className="flex flex-col mt-4 gap-1">
            <p className="text-base text-[#4F7396] font-medium">Reply</p>
            <div className="relative">
            <Textarea className="bg-[#F0F1F7] h-[150px] " placeholder="Enter your comment" />
            <Button className="absolute bottom-2 right-2  bg-[#0F1E7A] px-4 py-2 text-white text-sm font-medium">Send</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewBid;
