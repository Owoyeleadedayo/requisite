"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { parseDate } from "chrono-node";
import { ArrowLeft, CalendarIcon, Plus, SquarePen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const GenerateRFQ = () => {
  const router = useRouter();
  const [openStart, setOpenStart] = useState(false);
  const [mydateStart, setMydateStart] = useState("12/12/25");
  const [dateStart, setDateStart] = useState<Date | undefined>(
    parseDate(mydateStart) || undefined
  );
  const [monthStart, setMonthStart] = useState<Date | undefined>(dateStart);
  return (
    <>
      <div className="flex flex-col p-6 gap-6">
        <div className="w-full flex items-center">
          <Button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#0d1b5e] hover:underline border rounded-full "
          >
            <ArrowLeft />
          </Button>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E7A]">
          Generate RFQ
        </h1>
        <div className="grid grid-cols-[50%_45%] gap-18">
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <Label className="text-md font-normal inline-flex items-center">
                RFQ Title <span className="text-red-500 -ml-1">*</span>
              </Label>
              <Input className="p-4 rounded-md border shadow-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-md font-normal inline-flex items-center">
                Location<span className="text-red-500 -ml-1">*</span>
              </Label>
              <Select required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    className="hover:bg-[#0F1E7A] hover:text-white"
                    value="alimosho"
                  >
                    Alimosho
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-[#0F1E7A] hover:text-white"
                    value="oregun"
                  >
                    Oregun
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-[#0F1E7A] hover:text-white"
                    value="ikorodu"
                  >
                    Ikorodu
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-[#0F1E7A] hover:text-white"
                    value="lekki"
                  >
                    Lekki
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-[#0F1E7A] hover:text-white"
                    value="badagry"
                  >
                    Badagry
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-md font-normal inline-flex items-center">
                Evaluation Criteria<span className="text-red-500 -ml-1">*</span>
              </Label>
              <Textarea id="criteria" className="h-[80px] overflow-y-auto" />
            </div>
            <div className="space-y-1">
              <Label className="text-md font-normal inline-flex items-center">
                Expected Delivery Date
                <span className="text-red-500 -ml-1">*</span>
              </Label>
              <div className="relative flex gap-2">
                <Input
                  id="date-start"
                  value={mydateStart}
                  placeholder="12/12/25"
                  className="bg-background pr-10 border"
                  onChange={(e) => {
                    setMydateStart(e.target.value);
                    const date = parseDate(e.target.value);
                    if (date) {
                      setDateStart(date);
                      setMonthStart(date);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setOpenStart(true);
                    }
                  }}
                />
                <Popover open={openStart} onOpenChange={setOpenStart}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-picker-start"
                      variant="ghost"
                      className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                    >
                      <CalendarIcon className="size-3.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden bg-white p-0"
                    align="end"
                  >
                    <Calendar
                      mode="single"
                      selected={dateStart}
                      captionLayout="dropdown"
                      month={monthStart}
                      onMonthChange={setMonthStart}
                      onSelect={(date) => {
                        setDateStart(date);
                        setMydateStart(formatDate(date));
                        setOpenStart(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="itemDescription"
                className="text-md font-normal inline-flex items-center"
              >
                Terms of Service <span className="text-red-500 -ml-1">*</span>
              </Label>
              <Textarea
                id="itemDescription"
                name="itemDescription"
                className="h-[80px] overflow-y-auto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">VENDOR INFORMATION</h2>
              <div className="flex gap-10">
                <div className="flex gap-4">
                  <Select required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a vendor" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem
                        className="hover:bg-[#0F1E7A] hover:text-white"
                        value="alimosho"
                      >
                        Alimosho
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-[#0F1E7A] hover:text-white"
                        value="oregun"
                      >
                        Oregun
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-[#0F1E7A] hover:text-white"
                        value="ikorodu"
                      >
                        Ikorodu
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-[#0F1E7A] hover:text-white"
                        value="lekki"
                      >
                        Lekki
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-[#0F1E7A] hover:text-white"
                        value="badagry"
                      >
                        Badagry
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-[#0F1E7A] text-white cursor-pointer">
                    Add
                  </Button>
                </div>

                <Dialog>
                  <DialogTrigger className="bg-white" asChild>
                    <Button className="bg-[#0F1E7A] text-white cursor-pointer">
                      <Plus size={22} />{" "}
                      <span className="hidden lg:flex">New Vendor</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white max-w-[500px]">
                    <DialogHeader></DialogHeader>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-center items-center">
                          <p className="text-xl font-semibold text-center text-[#100A1A]">
                            New Vendor
                          </p>
                        </div>
                        <div className="flex justify-center items-center">
                          <p className="text-md text-center font-normal">
                            Enter the details of vendor below
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="">
                            <Label className="text-md font-normal inline-flex items-center">
                              Company Name{" "}
                              <span className="text-red-500 -ml-1">*</span>
                            </Label>
                            <Input
                              type={"text"}
                              className="p-4 rounded-md border shadow-sm"
                            />
                          </div>
                          <div className="">
                            <Label className="text-md font-normal inline-flex items-center">
                              Contact Person
                              <span className="text-red-500 -ml-1">*</span>
                            </Label>
                            <Input
                              type={"text"}
                              className="p-4 rounded-md border shadow-sm"
                            />
                          </div>
                          <div className="">
                            <Label className="text-md font-normal inline-flex items-center">
                              Phone Number
                              <span className="text-red-500 -ml-1">*</span>
                            </Label>
                            <Input
                              type={"tel"}
                              className="p-4 rounded-md border shadow-sm"
                            />
                          </div>
                          <div className="">
                            <Label className="text-md font-normal">
                              Email Address
                            </Label>
                            <Input
                              type={"email"}
                              className="p-4 rounded-md border shadow-sm"
                            />
                          </div>
                          <div className="">
                            <Label className="text-md font-normal">
                              Address
                            </Label>
                            <Input
                              type={"text"}
                              className="p-4 rounded-md border shadow-sm"
                            />
                          </div>
                        </div>
                        <div>
                        <Button className="bg-[#0F1E7A] text-white cursor-pointer">Add Vendor</Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-md font-bold ">REQUEST DETAILS</p>
            <p className="text-md font-normal text-[#4F7396]">
              Choose the items that you would like to add to the RFQ below. Note
              that you can edit any of the items to fit the relevant
              specifications.
            </p>

            <div className="flex flex-col w-full gap">
              <div className="flex gap-3">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Bulk Actions" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-[#0F1E7A] text-white cursor-pointer capitalize">
                  Apply
                </Button>
              </div>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Checkbox />
                      </TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>UOM</TableHead>
                      <TableHead>QTY</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>New Microphones</TableCell>
                      <TableCell>Pieces</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <div className="cursor-pointer">
                            <SquarePen size={18} color="#0F1E7A" />
                          </div>
                          <div className="cursor-pointer">
                            <Trash size={18} color="#ED3237" />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex  justify-center items-center">
              <Dialog>
                <DialogTrigger className="bg-white" asChild>
                  <Button className="border border-[#0F1E7A] cursor-pointer">
                    <Plus size={18} />{" "}
                    <span className="hidden lg:flex">Add New Item</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white">
                  <DialogHeader></DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col w-full gap">
                      <div className="flex gap-3">
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Add Items" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button className="bg-[#0F1E7A] text-white cursor-pointer capitalize">
                          Add Items
                        </Button>
                      </div>
                      <div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>
                                <Checkbox />
                              </TableHead>
                              <TableHead>Item Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Checkbox />
                              </TableCell>
                              <TableCell>New Microphones</TableCell>
                              <TableCell>Product</TableCell>
                              <TableCell className="text-[#F59313]">
                                Pending
                              </TableCell>
                              <TableCell>
                                <Button className="bg-[#0F1E7A] h-[35px] text-white cursor-pointer capitalize">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateRFQ;
