"use client";

import { Bell, FileText, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_BASE_URL } from "@/lib/config";

interface Notification {
  _id: string;
  type: string;
  metadata: {
    title?: string;
    message?: string;
    resourceNumber?: string;
    text?: string;
  };
  actor: {
    firstName: string;
    lastName: string;
  };
  resource?: {
    kind: string;
    id: string;
    commentId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  notificationsPath: string;
}

export default function NotificationDropdown({
  notificationsPath,
}: NotificationDropdownProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/notifications?limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data.success) {
          setNotifications(data.data);
          setUnreadCount(
            data.data.filter((n: Notification) => !n.isRead).length
          );
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const getNotificationTypeDisplay = (type: string) => {
    switch (type) {
      case "requisition_status_changed":
        return {
          label: "Status Changed",
          icon: FileText,
          color: "bg-blue-600"
        };
      case "comment_replied":
        return {
          label: "Comment Reply",
          icon: MessageCircle,
          color: "bg-green-600"
        };
      default:
        return {
          label: type.replace("_", " "),
          icon: FileText,
          color: "bg-gray-600"
        };
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "requisition_status_changed" && notification.resource) {
      router.push(`/user/requisition/${notification.resource.id}`);
    } else {
      router.push(`${notificationsPath}?id=${notification._id}`);
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell color="#FFF" className="w-5 h-5 sm:w-7 sm:h-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[400px] bg-white border-none mr-20">
        <DropdownMenuLabel className="flex justify-between items-center">
          <p className="text-lg font-medium">NOTIFICATIONS</p>
          <p
            className="text-sm font-light cursor-pointer"
            onClick={markAllAsRead}
          >
            Mark all read
          </p>
        </DropdownMenuLabel>
        <div className="border-b-1 border-[#e5e5e5]" />

        <DropdownMenuGroup>
          {notifications.map((notification) => (
            <div key={notification._id}>
              <DropdownMenuItem 
                className="flex flex-col items-start py-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-center gap-2 mb-1">
                  {(() => {
                    const typeDisplay = getNotificationTypeDisplay(notification.type);
                    const Icon = typeDisplay.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium text-white px-2 py-1 rounded-md ${typeDisplay.color}`}>
                        <Icon size={10} />
                        {typeDisplay.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-sm font-medium">
                  {notification.metadata.title || "Notification"}
                </p>
                {notification.type === "comment_replied" ? (
                  <>
                    <p className="text-xs font-normal">
                      {truncateText(notification.metadata.text || "")}
                    </p>
                    <p className="text-xs text-gray-500">
                      From: {notification.actor.firstName} {notification.actor.lastName}
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-normal">
                    {notification.metadata.message}
                  </p>
                )}
                <div className="flex justify-between w-full mt-1">
                  <p className="text-xs font-normal">
                    {formatDate(notification.createdAt)}
                  </p>
                  {notification.type === "comment_replied" && (
                    <p className="text-xs font-light underline cursor-pointer">
                      View full notification
                    </p>
                  )}
                </div>
              </DropdownMenuItem>
              <div className="border-b-1 border-[#e5e5e5]" />
            </div>
          ))}
          <DropdownMenuItem
            className="flex justify-center items-center py-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push(notificationsPath)}
          >
            <p className="text-xs font-light underline cursor-pointer">
              View all notifications
            </p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
