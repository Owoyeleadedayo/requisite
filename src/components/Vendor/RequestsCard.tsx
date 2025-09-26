import { AlarmClock } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const RequestsCard = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="flex flex-row w-full items-center bg-white gap-6 py-6 px-6 shadow-md">
          <div className="">
            <Image
              src="/product.png"
              alt="product"
              width={200}
              height={200}
              className="object-contain items-center"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base text-[#0F1E7A] font-medium">Alienware</p>
            <p className="text-sm text-[#0F1E7A] font-thin">
              Alienware Aurora R12 RTX{" "}
            </p>
            <p className="text-sm text-[#0F1E7A] font-medium">20 Units</p>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#F6B40E]" />
              <p className="text-base text-[#0F1E7A] font-medium">
                Active Bids
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#0F1E7A80] text-white">IT Dept</Badge>
              <Badge className="bg-[#0F1E7A80] text-white">General</Badge>
            </div>
            <div className="flex items-center gap-3 my-2">
              <AlarmClock color="#0F1E7A" />
              <p className="text-base text-[#0F1E7A] font-normal">Ending in <span className="font-semibold">10</span> days</p>
            </div>
            <Button className="bg-white border border-[#0F1E7A] text-lg text-[#0F1E7A] font-medium">Place Bid</Button>
          </div>
        </Card>
        <Card className="flex flex-row w-full items-center bg-white gap-6 py-6 px-6 shadow-md">
          <div className="">
            <Image
              src="/product.png"
              alt="product"
              width={200}
              height={200}
              className="object-contain items-center"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base text-[#0F1E7A] font-medium">Alienware</p>
            <p className="text-sm text-[#0F1E7A] font-thin">
              Alienware Aurora R12 RTX{" "}
            </p>
            <p className="text-sm text-[#0F1E7A] font-medium">20 Units</p>
            <div className="flex items-center gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#F6B40E]" />
              <p className="text-base text-[#0F1E7A] font-medium">
                Active Bids
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#0F1E7A80] text-white">IT Dept</Badge>
              <Badge className="bg-[#0F1E7A80] text-white">General</Badge>
            </div>
            <div className="flex items-center gap-3 my-2">
              <AlarmClock color="#0F1E7A" />
              <p className="text-base text-[#0F1E7A] font-normal">Ended Already!</p>
            </div>
            <p className="text-base text-[#0F1E7A] font-semibold">Bid Completed</p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default RequestsCard;
