"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import clsx from "clsx";

interface Notification {
  id: number;
  type: "Payment" | "Request" | "Delivery" | "Message" | "Meeting" | "Vendor";
  title: string;
  description: string;
  date: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: "Payment",
    title: "New Microphones",
    description: "Payment has been completed for a request",
    date: "21 May 2025 at 11:30 AM",
  },
  {
    id: 2,
    type: "Request",
    title: "New Microphones",
    description: "A request has been submitted",
    date: "21 May 2025 at 11:30 AM",
  },
  {
    id: 3,
    type: "Delivery",
    title: "New Microphones",
    description: "Vendor has failed to deliver",
    date: "21 May 2025 at 11:30 AM",
  },
  {
    id: 4,
    type: "Message",
    title: "New Microphones",
    description: "Nancy sent a message",
    date: "21 May 2025 at 11:30 AM",
  },
  {
    id: 5,
    type: "Delivery",
    title: "New Microphones",
    description: "This request has been marked as complete",
    date: "21 May 2025 at 11:30 AM",
  },
  {
    id: 6,
    type: "Vendor",
    title: "New Microphones",
    description: "This vendor has been chosen as the winning bidder",
    date: "21 May 2025 at 11:30 AM",
  },
  {
    id: 7,
    type: "Meeting",
    title: "New Microphones",
    description:
      "You have a meeting scheduled for 24th of June, 2025. 11:00 WAT",
    date: "21 May 2025 at 11:30 AM",
  },
];

const filterTabs = ["Message", "Request", "Delivery", "Meeting", "Vendor"];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("Message");

  const filteredNotifications = notifications.filter((n) =>
    activeTab === "Message" ? true : n.type === activeTab
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F6F7FB] to-white px-4 sm:px-8 py-8 sm:py-20">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0A1A6B] mb-4 sm:mb-6 uppercase">
        Notifications
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
        {filterTabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "rounded-xl px-4 sm:px-8 py-3 sm:py-6 font-medium text-sm sm:text-base",
              activeTab === tab
                ? "bg-[#0A1A6B] text-white shadow"
                : "bg-white text-[#0A1A6B] hover:bg-[#E9ECFF]"
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notif) => (
          <Card
            key={notif.id}
            className="border-none shadow-sm bg-white hover:bg-[#F8F8F8] transition-colors cursor-pointer"
          >
            <CardContent className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 sm:p-5 gap-3 sm:gap-0">
              <div className="space-y-2 flex-1">
                <span
                  className={clsx(
                    "inline-block text-xs font-medium text-white px-2 py-1 rounded-md",
                    {
                      "bg-[#5A6ACF]": notif.type === "Payment",
                      "bg-[#0A1A6B]": notif.type === "Request",
                      "bg-[#6B7280]": notif.type === "Delivery",
                      "bg-[#3B82F6]": notif.type === "Message",
                      "bg-[#2563EB]": notif.type === "Meeting",
                      "bg-[#4B5563]": notif.type === "Vendor",
                    }
                  )}
                >
                  {notif.type}
                </span>

                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  {notif.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 pr-0 sm:pr-4">{notif.description}</p>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 sm:whitespace-nowrap">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{notif.date}</span>
              </div>
            </CardContent>
            <Separator />
          </Card>
        ))}
      </div>
    </div>
  );
}
