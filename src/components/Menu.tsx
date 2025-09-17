"use client";

import { SquarePen, LayoutGrid, User, Gavel, ClipboardPenLine, MapPin, Package, FileCog, Archive } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  icon: React.ComponentType<{ size?: number }>;
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
    { icon: ClipboardPenLine, label: "Requests", href: "/vendor/requests" },
    { icon: User, label: "Profile", href: "/vendor/profile" },
  ],
  hod: [
    { icon: LayoutGrid, label: "Dashboard", href: "/hod" },
    { icon: FileCog, label: "Requisitions", href: "/hod/requisitions" },
    { icon: Package, label: "Orders", href: "/hod/orders" },
    { icon: MapPin, label: "Tracker", href: "/vendor/tracker" },
    { icon: User, label: "Profile", href: "/vendor/profile" },
    { icon: Archive, label: "Archives", href: "/vendor/archives" },
  ],
};

type MenuProps = {
  role?: keyof typeof menuItems;
};

const Menu = ({ role = "vendor" }: MenuProps) => {
  const pathname = usePathname();
  const items = menuItems[role] || [];

  return (
    <div className="flex h-full flex-col py-4 gap-2 bg-[#0F1E7A]">
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
            className={`flex items-center justify-center lg:justify-start gap-3 text-md py-2 px-6 transition-colors
              ${
                isActive
                  ? "bg-[#FFF] text-[#0F1E7A]"
                  : "text-[#FFF] hover:bg-[#FFF] hover:text-[#0F1E7A]"
              }`}
          >
            <Icon size={22} />
            <p className="hidden lg:block text-base">{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default Menu;
