"use client";

import { API_BASE_URL } from "@/lib/config";
import type { LucideIcon } from "lucide-react";
import {
  SquarePen,
  LayoutGrid,
  User,
  Gavel,
  Package,
  FileCog,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const menuItems: Record<string, MenuItem[]> = {
  user: [
    { icon: LayoutGrid, label: "Dashboard", href: "/user" },
    { icon: SquarePen, label: "Requisition", href: "/user/requisition" },
    // { icon: User, label: "Profile", href: "/user/profile" },
  ],
  vendor: [
    { icon: LayoutGrid, label: "Dashboard", href: "/vendor" },
    { icon: Gavel, label: "Bids", href: "/vendor/bids" },
    // { icon: User, label: "Profile", href: "/vendor/profile" },
  ],
  hod: [
    { icon: LayoutGrid, label: "Dashboard", href: "/hod" },
    { icon: FileCog, label: "Requisitions", href: "/hod/requisitions" },
    { icon: Package, label: "My Request", href: "/hod/myrequests" },
    // { icon: User, label: "Profile", href: "/vendor/profile" },
  ],
  hhra: [
    { icon: LayoutGrid, label: "Dashboard", href: "/hhra" },
    { icon: FileCog, label: "Requests", href: "/hhra/requests" },
    { icon: Package, label: "Vendors", href: "/hhra/vendors" },
    // { icon: User, label: "Profile", href: "/hhra/profile" },
  ],
};

const Menu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const role = pathname.split("/")[1] as keyof typeof menuItems;
  const items = menuItems[role] || menuItems.hod;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authData");
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col py-4 gap-2 h-full">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === `/${role}`
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            href={item.href}
            key={item.label}
            className={`flex items-center justify-center lg:justify-start gap-3 text-md py-2 px-4 md:px-6 transition-colors
              ${
                isActive
                  ? "bg-[#FFF] text-[#0F1E7A]"
                  : "text-[#FFF] hover:bg-[#FFF] hover:text-[#0F1E7A]"
              }`}
          >
            <Icon className="w-7 h-7 lg:w-5 lg:h-5" />
            <p className="hidden lg:block text-base">{item.label}</p>
          </Link>
        );
      })}
      <button
        key="logout"
        onClick={handleLogout}
        className="flex items-center justify-center lg:justify-start gap-3 text-md py-2 px-4 md:px-6 transition-colors text-red-500 hover:bg-red-500 hover:text-white cursor-pointer mt-auto"
      >
        <LogOut className="w-7 h-7 lg:w-5 lg:h-5" />
        <p className="hidden lg:block text-base">Logout</p>
      </button>
    </div>
  );
};

export default Menu;
