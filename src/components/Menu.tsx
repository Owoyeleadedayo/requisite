"use client";

import { LucideIcon, ShoppingCart } from "lucide-react";
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
    { icon: User, label: "Profile", href: "/hod/profile" },
  ],
  hhra: [
    { icon: LayoutGrid, label: "Dashboard", href: "/hhra" },
    { icon: FileCog, label: "Request", href: "/hhra/request" },
    { icon: ShoppingCart, label: "Vendor", href: "/hhra/vendor" },
    { icon: User, label: "Profile", href: "/hhra/profile" },
  ],
};

type MenuProps = {
  role?: keyof typeof menuItems;
  showText?: boolean;
};

const Menu = ({ role = "hhra", showText = true }: MenuProps) => {
  const pathname = usePathname();
  const items = menuItems[role] || [];

  return (
    <div className="flex flex-col py-6 gap-1 h-full">
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
            className={`flex items-center gap-3 text-md py-3 px-8 mx-4 rounded-md border transition-colors duration-200 ${
              isActive
                ? "bg-white text-[#0F1E7A] font-semibold"
                : "text-white hover:bg-[#FFFFFF33] hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5" />
            {showText && <p className="text-base">{item.label}</p>}
          </Link>
        );
      })}
    </div>
  );
};

export default Menu;
