"use client";

import { SquarePen, LayoutGrid, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    icon: LayoutGrid,
    label: "Dashboard",
    href: "/user",
  },
  {
    icon: SquarePen,
    label: "Requisition",
    href: "/requisition",
  },
  {
    icon: User,
    label: "Profile",
    href: "/profile",
  },
];

const Menu = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-[100%] flex-col p-4 gap-2 bg-[#f0f1f7]">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            href={item.href}
            key={item.label}
            className={`flex items-center justify-center lg:justify-start gap-3 text-md py-2 md:px-2 rounded-md transition-colors
              ${
                isActive
                  ? "bg-[#0F1E7A] text-white"
                  : "text-#4F7396 hover:bg-[#0F1E7A] hover:text-white"
              }`}
          >
            <Icon size={20} /> 
            <p className="hidden lg:block text-base">{item.label}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default Menu;
