"use client";

import type { LucideIcon } from "lucide-react";
import { SquarePen, LayoutGrid, User, Gavel, Package, FileCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const menuItems: Record<string, MenuItem[]> = {
  user: [
    { icon: LayoutGrid, label: "Dashboard", href: "/user" },
    { icon: SquarePen, label: "Requisition", href: "/user/requisition" },
    { icon: User, label: "Profile", href: "/user/profile" },
  ],
  vendor: [
    { icon: LayoutGrid, label: "Dashboard", href: "/vendor" },
    { icon: Gavel, label: "Bids", href: "/vendor/bids" },
    { icon: User, label: "Profile", href: "/vendor/profile" },
  ],
  hod: [
    { icon: LayoutGrid, label: "Dashboard", href: "/hod" },
    { icon: FileCog, label: "Requisitions", href: "/hod/requisitions" },
    { icon: Package, label: "My Request", href: "/hod/myrequests" },
    { icon: User, label: "Profile", href: "/vendor/profile" },
  ],
};

type MenuProps = {
  role?: keyof typeof menuItems;
};

const Menu = ({ role = "hod" }: MenuProps) => {
  const pathname = usePathname();
  const items = menuItems[role] || [];

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
    </div>
  );
};

export default Menu;
