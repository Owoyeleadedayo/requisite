"use client"
import { Bell, CircleUser, Crown, Gem, LogOut, Mail, Search, SquareMenu } from "lucide-react";
import Image from "next/image";
import Menu from "./Menu";
import { Button } from "./ui/button";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "@mui/material";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();
  const user = getUser();

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
    <div className="flex sticky top-0 z-10 py-4 px-4 md:px-6 lg:px-6 xl:px-6  justify-end md:justify-between items-end md:items-center bg-[#0F1E7A] border-b-1 border-[#FFF]">
      <div className="hidden md:flex justify-center items-center gap-2">
        <Image
          src="/daystar_logo.png"
          alt="logo"
          width={40}
          height={20}
          className="object-cover"
        />
        <p className="text-3xl text-white font-bold">requisite</p>
      </div>
      {/* ICONS AND USER */}
      <div className="flex justify-center items-center gap-6">
        <div className="flex justify-center items-center gap-[14px]">
          <AdvancedSearchModal
            trigger={<Search color="#FFF" className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6" />}
            onSearch={(query) => console.log("Search:", query)}
          />

          <div>
            <Settings color="#FFF" className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>


      <div className="flex justify-center items-center gap-6">
        <div className="flex justify-center items-center gap-[14px]">
          <Dialog>
            <DialogTrigger asChild>
              <Search color="#FFF" className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="flex flex-col w-[90vw] max-w-[1000px] bg-[#F3F3F3] p-10 border-none gap-6">
              <div className="flex gap-4 py-4 ">
                <div className="relative w-[100%]">
                  <Input
                    type="text"
                    placeholder="Search Item"
                    className="bg-[#FFFFFF] pl-4 pr-4 py-2 w-full h-12 rounded-md shadow-md"
                  />
                  <Search
                    color="black"
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
                <Button className="h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer capitalize">
                  advanced search
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-md font-normal">Category</Label>
                <Select>
                  <SelectTrigger className="bg-[#FFFFFF] w-[250px] border-white">
                    <SelectValue
                      className="text-[#767676] text-md font-light"
                      placeholder="Select Category"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-md font-normal">Select Date</Label>
                  <Select>
                    <SelectTrigger className="bg-[#FFFFFF] w-[250px] border-white">
                      <SelectValue
                        className="text-[#767676] text-md font-light"
                        placeholder="Custom Date"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button className="text-md font-medium border border-[#000]">
                  Cancel
                </Button>
                <Button className="bg-[#0F1E7A] text-md text-white font-medium">
                  Apply
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                      onClick={() => router.push('/notifications')}
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
                      onClick={() => router.push('/notifications')}
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
                      onClick={() => router.push('/notifications')}
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
                      onClick={() => router.push('/notifications')}
                    >
                      View full notification
                    </p>
                  </div>
                </DropdownMenuItem>
                <div className="border-b-1 border-[#e5e5e5]" />
                <DropdownMenuItem 
                  className="flex justify-center items-center py-4 hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push('/notifications')}
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
