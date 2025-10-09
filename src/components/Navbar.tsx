"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { getUser } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import AdvancedSearchModal from "./AdvancedSearchModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Bell,
  CircleUser,
  Crown,
  Gem,
  LogOut,
  Mail,
  Menu as MenuIcon,
  Search,
  Settings,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Menu from "./Menu";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = getUser();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Get current role from URL or user data
  const currentRole = pathname.split('/')[1] || user?.role || 'user';
  const notificationsPath = `/${currentRole}/notifications`;

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
    <div className="flex sticky top-0 z-10 py-4 px-4 md:px-6 lg:px-6 xl:px-6  justify-between items-center bg-[#0F1E7A] border-b-1 border-[#FFF]">
      <div className="flex justify-center items-center gap-2">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger className="md:hidden mr-2">
            <MenuIcon color="white" size={24} />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="!bg-[#0F1E7A] !text-white pt-10 w-[260px] flex flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <Menu />
            </div>
          </SheetContent>
        </Sheet>
        <Image
          src="/daystar_logo.png"
          alt="logo"
          width={40}
          height={20}
          className="object-cover"
        />
        <p className="text-2xl lg:text-3xl text-white font-bold">requisite</p>
      </div>
      
      <div className="flex justify-center items-center gap-6">
        <div className="flex justify-center items-center gap-[14px]">
          <AdvancedSearchModal
            trigger={
              <Search
                color="#FFF"
                className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
              />
            }
            onSearch={(query) => console.log("Search:", query)}
          />

          <div>
            <Settings color="#FFF" className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer">
                <Bell color="#FFF" className="w-5 h-5 sm:w-7 sm:h-7" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                  8
                </span>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[400px] bg-white border-none mr-20">
              <DropdownMenuLabel className="flex justify-between items-center">
                <p className="text-lg font-medium">NOTIFICATIONS</p>
                <p className="text-sm font-light cursor-pointer">
                  Mark all read
                </p>
              </DropdownMenuLabel>
              <div className="border-b-1 border-[#e5e5e5]" />

              <DropdownMenuGroup>
                <DropdownMenuItem className="flex flex-col items-start py-3 hover:bg-gray-100 cursor-pointer">
                  <p className="text-sm font-medium">New Microphones</p>
                  <p className="text-xs font-normal">
                    Your request has been approved by the HOD
                  </p>
                  <div className="flex justify-between w-full mt-1">
                    <p className="text-xs font-normal">6 hours 33 mins ago</p>
                    <p
                      className="text-xs font-light underline cursor-pointer"
                      onClick={() => router.push(notificationsPath)}
                    >
                      View full notification
                    </p>
                  </div>
                </DropdownMenuItem>
                <div className="border-b-1 border-[#e5e5e5]" />

                <DropdownMenuItem className="flex flex-col items-start py-3 hover:bg-gray-100 cursor-pointer">
                  <p className="text-sm font-medium">Laptop Request</p>
                  <p className="text-xs font-normal">
                    Your request has been declined by the Manager
                  </p>
                  <div className="flex justify-between w-full mt-1">
                    <p className="text-xs font-normal">1 day ago</p>
                    <p
                      className="text-xs font-light underline cursor-pointer"
                      onClick={() => router.push(notificationsPath)}
                    >
                      View full notification
                    </p>
                  </div>
                </DropdownMenuItem>
                <div className="border-b-1 border-[#e5e5e5]" />

                <DropdownMenuItem className="flex flex-col items-start py-3 hover:bg-gray-100 cursor-pointer">
                  <p className="text-sm font-medium">Budget Update</p>
                  <p className="text-xs font-normal">
                    Finance team updated the Q3 budget
                  </p>
                  <div className="flex justify-between w-full mt-1">
                    <p className="text-xs font-normal">2 days ago</p>
                    <p
                      className="text-xs font-light underline cursor-pointer"
                      onClick={() => router.push(notificationsPath)}
                    >
                      View full notification
                    </p>
                  </div>
                </DropdownMenuItem>
                <div className="border-b-1 border-[#e5e5e5]" />

                <DropdownMenuItem className="flex flex-col items-start py-3 hover:bg-gray-100 cursor-pointer">
                  <p className="text-sm font-medium">Meeting Reminder</p>
                  <p className="text-xs font-normal">
                    Don&apos;t forget the weekly staff meeting at 10 AM
                  </p>
                  <div className="flex justify-between w-full mt-1">
                    <p className="text-xs font-normal">3 days ago</p>
                    <p
                      className="text-xs font-light underline cursor-pointer"
                      onClick={() => router.push(notificationsPath)}
                    >
                      View full notification
                    </p>
                  </div>
                </DropdownMenuItem>
                <div className="border-b-1 border-[#e5e5e5]" />
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
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image
              src="/avatar.png"
              alt=""
              width={28}
              height={28}
              className="rounded-full cursor-pointer sm:w-9 sm:h-9"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[287px] bg-white border-none mr-4">
            <DropdownMenuLabel className="!p-0">
              <div className="flex flex-col items-start gap-2">
                <div className="text-sm text-[var(--primary-color)] pt-5 px-5">
                  <p className="font-semibold flex items-center gap-2 mb-4">
                    <span className="">
                      <CircleUser size={25} />
                    </span>
                    <span>
                      {user?.firstName} {user?.lastName}
                    </span>
                  </p>

                  <p className="font-semibold flex items-center gap-2 mb-4">
                    <span className="">
                      <Mail size={25} />
                    </span>
                    <span>{user?.email}</span>
                  </p>

                  <p className="font-semibold flex items-center gap-2 mb-4">
                    <span className="">
                      <Crown size={25} />
                    </span>
                    <span>{user?.designation}</span>
                  </p>

                  <p className="font-semibold flex items-center gap-2 mb-4">
                    <span className="">
                      <Gem size={25} />
                    </span>
                    <span>{user?.department?.name || ""}</span>
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <div className="border-b border-gray-200 mx-4" />
            <div className="p-4 mx-auto w-full flex items-center justify-center">
              <Button
                onClick={handleLogout}
                className="w-auto bg-[var(--primary-color)] hover:bg-red-500 text-white cursor-pointer"
              >
                <div className="flex justify-center items-center gap-2">
                  <LogOut size={20} />
                  <span>Logout</span>
                </div>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;