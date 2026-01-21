"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RelatedItem {
  _id: string;
  title: string;
  department: string;
}

interface RelatedTabsProps {
  requests?: RelatedItem[];
  rfqs?: RelatedItem[];
  pos?: RelatedItem[];
  onViewItem: (item: RelatedItem, type: "request" | "rfq" | "po") => void;
}

export default function Related({
  requests = [],
  rfqs = [],
  pos = [],
  onViewItem,
}: RelatedTabsProps) {
  const [activeTab, setActiveTab] = useState<"request" | "rfq" | "po">(
    "request"
  );

  const tabs = [
    { id: "request" as const, label: "REQUEST", data: requests },
    { id: "rfq" as const, label: "RFQs", data: rfqs },
    { id: "po" as const, label: "POs", data: pos },
  ];

  const activeData = tabs.find((tab) => tab.id === activeTab)?.data || [];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Section Header */}
      <h2 className="text-xl font-bold mb-6">Related</h2>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-lg font-semibold transition-colors relative ${
              activeTab === tab.id
                ? "text-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F1E7A]" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{" "}
          found
        </div>
      ) : (
        <div className="bg-white rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-semibold">
                  {activeTab === "request"
                    ? "Request Title"
                    : activeTab === "rfq"
                    ? "RFQ Title"
                    : "PO Title"}
                </TableHead>
                <TableHead className="text-base font-semibold">
                  Department
                </TableHead>
                <TableHead className="text-base font-semibold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-base">{item.title}</TableCell>
                  <TableCell className="text-base">{item.department}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onViewItem(item, activeTab)}
                      className="bg-[#0F1E7A] text-white hover:bg-[#0a1555] px-8 py-2 rounded-lg"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
