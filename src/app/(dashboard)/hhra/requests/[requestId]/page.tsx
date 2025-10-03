"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { data, type Item } from "@/data/mock/tableData";

const RequestDetailPage = ({ params }: { params: { requestId: string } }) => {
  const router = useRouter();
  const requestId = parseInt(params.requestId);
  const item = data.find(item => item.id === requestId);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <h1 className="text-2xl font-semibold text-gray-600 mb-4">Request Not Found</h1>
        <Button onClick={() => router.back()} className="bg-[#0F1E7A] hover:bg-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    Complete: "text-green-500 bg-green-50 border-green-200",
    Active: "text-yellow-600 bg-yellow-50 border-yellow-200",
    Rejected: "text-red-500 bg-red-50 border-red-200",
    Closed: "text-gray-500 bg-gray-50 border-gray-200",
  };

  return (
    <div className="flex flex-col px-4 md:px-8 gap-6 pb-16">
      <div className="flex items-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-[#0F1E7A]">
          Request Details - #{item.id}
        </h1>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Item Description</label>
              <p className="text-lg font-semibold text-gray-900">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Quantity</label>
                <p className="text-lg text-gray-900">{item.qty}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">UOM</label>
                <p className="text-lg text-gray-900">{item.uom}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Category</label>
              <p className="text-lg text-gray-900">{item.category}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Price</label>
              <p className="text-lg font-semibold text-gray-900">₦{item.price}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Request Date</label>
              <p className="text-lg text-gray-900">{item.date}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Deadline</label>
              <p className="text-lg text-gray-900">{item.deadline}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusColors[item.status] ?? "text-gray-500 bg-gray-50 border-gray-200"}`}>
                {item.status}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">
              This request was submitted on {item.date} with a deadline of {item.deadline}.
              The current status is <span className="font-medium">{item.status}</span>.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="bg-[#0F1E7A] hover:bg-blue-800">
            Edit Request
          </Button>
          <Button variant="outline">
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;