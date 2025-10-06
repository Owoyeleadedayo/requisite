"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import TableContent from "@/components/TableContent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import ViewRequest from "@/components/user/ViewRequest";
import NewRequest from "@/components/user/NewRequest";
import EditRequest from "@/components/user/EditRequest";

export default function RequisitionsPage() {
  const searchParams = useSearchParams();
  const newRequest = searchParams.get("newRequest");

  if (newRequest === "newRequest") {
    return <NewRequest />;
  }

  if (newRequest === "view") {
    return <ViewRequest />;
  }

  if (newRequest === "edit") {
    return <EditRequest />;
  }
  return (
    <>
      <div className="flex flex-col py-4 px-4 md:px-6 gap-4">
        <div className="flex flex-col md:flex-row py-4 gap-4 md:gap-6">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer capitalize">
                advanced search
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#F3F3F3] w-[800px] h-[400px]">
              <DialogHeader>
                <DialogDescription>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row py-4 gap-4 md:gap-6">
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
                    <div className="grid w-full max-w-md">
                      <Label className="text-md font-medium">Category</Label>
                      <Select>
                        <SelectTrigger className="bg-white w-[200px] border-1 border-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectGroup>
                            <SelectItem
                              value="apple"
                              className="hover:bg-[#e5e5e5]"
                            >
                              Apple
                            </SelectItem>
                            <SelectItem
                              value="banana"
                              className="hover:bg-[#e5e5e5]"
                            >
                              Banana
                            </SelectItem>
                            <SelectItem
                              value="blueberry"
                              className="hover:bg-[#e5e5e5]"
                            >
                              Blueberry
                            </SelectItem>
                            <SelectItem
                              value="grapes"
                              className="hover:bg-[#e5e5e5]"
                            >
                              Grapes
                            </SelectItem>
                            <SelectItem
                              value="pineapple"
                              className="hover:bg-[#e5e5e5]"
                            >
                              Pineapple
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex justify-between items-center py-4 gap-2">
          <p className="text-md md:text-2xl text-[#0F1E7A] font-medium leading-5">
            Request
          </p>
          <Button className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer">
            <Plus size={22} /> New Request
          </Button>
        </div>
        <TableContent />
      </div>
    </>
  );
}
