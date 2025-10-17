"use client";

import Image from "next/image";
import { useState } from "react";
import { AlarmClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RequestData, RequestActionsProps } from "./types";

interface RequestCardProps {
  formData: RequestData;
  user: RequestActionsProps["user"];
}

export default function RequestCard({ formData, user }: RequestCardProps) {
  const [imageError, setImageError] = useState(false);

  const getImageSrc = () => {
    if (!formData.image || imageError) return "/no-image.svg";
    return formData.image;
  };

  return (
    <div className="request w-full space-y-5">
      <div className="flex justify-between items-center px-4 my-5">
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

      <div className="flex items-center gap-3 my-3 px-4">
        <AlarmClock color="#0F1E7A" />
        <p className="text-base text-[#0F1E7A] font-normal">
          Ending in <span className="font-semibold">10</span> days
        </p>
      </div>

      <div className="w-full space-y-2">
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-gray-100">
          <Image
            fill
            alt="Request Image"
            src={getImageSrc()}
            className="object-cover relative"
            onError={() => setImageError(true)}
          />

          {formData.status && (
            <div className="status-badge absolute top-5 right-1 z-[5]">
              <span
                className={`p-5 text-sm font-semibold text-white ${
                  formData.status === "submitted"
                    ? "bg-orange-500"
                    : formData.status === "departmentApproved"
                    ? "bg-green-500"
                    : formData.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {formData.status}
              </span>
            </div>
          )}
        </div>

        {formData.requester && (
          <p className="text-sm text-gray-600 font-semibold text-end px-4 pt-4">
            Requested by:{" "}
            {user?.id === formData.requester._id
              ? "You"
              : `${formData.requester.firstName} ${formData.requester.lastName}`}
          </p>
        )}
      </div>
    </div>
  );
}
