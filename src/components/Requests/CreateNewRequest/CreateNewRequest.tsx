"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CalendarIcon,
  Folder,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { getToken } from "@/lib/auth";
import AdvancedSearchModal from "@/components/AdvancedSearchModal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { parseDate } from "chrono-node";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider, SliderProps, styled } from "@mui/material";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CustomSlider = styled(Slider)({
  "& .MuiSlider-mark": {
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#0F1E7A",
  },
  "& .MuiSlider-markActive": {
    opacity: 1,
    backgroundColor: "#0F1E7A",
  },
});

const marks = [{ value: 0 }, { value: 50 }, { value: 98 }];

interface CreateNewRequestProps {
  page: "user" | "hod" | "pm";
  data: unknown[];
}

export default function CreateNewRequest({
  page,
  data,
}: CreateNewRequestProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const router = useRouter();
  const [urgency, setUrgency] = useState([1]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    quantityNeeded: "",
    estimatedUnitPrice: "",
    justification: "",
    image: "https://example.com/image.jpg",
  });

  const priorityMap = ["low", "medium", "high"];

  const token = getToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create requisition
      const createResponse = await fetch(`${API_BASE_URL}/requisitions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          quantityNeeded: parseInt(formData.quantityNeeded),
          image: formData.image,
          estimatedUnitPrice: parseFloat(formData.estimatedUnitPrice),
          priority: priorityMap[urgency[0]],
          justification: formData.justification,
        }),
      });

      const createData = await createResponse.json();

      if (createData.success) {
        if (page === "hod") {
          // For HOD: Requisition is already approved in response
          toast.success("Requisition created and approved successfully!");
          router.push("/hod/my-requests/");
        } else {
          // For user: Submit requisition
          const submitResponse = await fetch(
            `${API_BASE_URL}/requisitions/${createData.data._id}/submit`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const submitData = await submitResponse.json();

          if (submitData.success) {
            toast.success("Requisition created and submitted successfully!");
            router.push("/user/requisition/");
          } else {
            toast.error("Failed to submit requisition");
          }
        }
      } else {
        toast.error("Failed to create requisition");
      }
    } catch (error) {
      console.error("Error creating requisition:", error);
      toast.error("Error creating requisition");
    } finally {
      setLoading(false);
    }
  };

  const [openStart, setOpenStart] = useState(false);
  const [mydateStart, setMydateStart] = useState("12/12/25");
  const [dateStart, setDateStart] = useState<Date | undefined>(
    parseDate(mydateStart) || undefined
  );
  const [monthStart, setMonthStart] = useState<Date | undefined>(dateStart);

  const [value, setValue] = useState<number[]>([2, 52]);

  const handleChange: SliderProps["onChange"] = (event, newValue) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <div className="w-full lg:w-full flex flex-col px-4 py-8 pb-16">
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center">
          <Link
            href={
              page === "hod"
                ? "/hod/my-requests"
                : page === "user"
                ? "/user/requisition"
                : ""
            }
            className="flex items-center gap-2 text-[#0d1b5e] hover:underline border rounded-full p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-[#0F1E7A] mb-6">
          Create New Request
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[50%_45%]  w-full gap-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl space-y-5 border-2 border-[#e5e5e5e5] shadow-xl p-5 rounded-xl"
        >
          <div className="space-y-2 mb-6">
            <Label>Request Title</Label>
            <Input
              placeholder="Request title"
              className="!p-4 rounded-md border shadow-sm"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 mb-6">
            <Label>Urgency</Label>
            <div className="w-full py-3 shadow-md rounded-md">
              <div className="pl-3 pr-6">
                <Slider
                  value={value}
                  onChange={handleChange}
                  marks={marks}
                  sx={{
                    color: "#0F1E7A", 
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#0F1E7A",
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "#0F1E7A",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "#e5e5e5",
                    },
                    "& .MuiSlider-mark": {
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: "#e5e5e5",
                      border: "1px solid #e5e5e5",
                    },
                  }}
                />
              </div>
              <div className="flex justify-between items-center px-2">
                <p className="font-normal">Low</p>
                <p className="pl-3 text-center font-normal">Medium</p>
                <p className="font-normal">High</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label>Justification</Label>
            <Textarea
              placeholder="Justification"
              className="rounded-md min-h-[100px] border shadow-sm"
              value={formData.justification}
              onChange={(e) =>
                setFormData({ ...formData, justification: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2 mb-6">
            <Label>Delivery Location *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              required
            >
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

          <div className="flex flex-col gap-1">
            <Label>Preferred Delivery Date *</Label>
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

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0d1b5e] hover:bg-[#0b154b] text-white rounded-lg text-base p-6"
            >
              {loading ? "Creating..." : "Proceed"}
            </Button>
          </div>
        </form>

        <div className="flex lg:flex-col">
          <div className="search-filter w-full flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-2 mb-8">
            <div className=" search relative w-[100%]">
              <Input
                type="text"
                value={searchQuery}
                placeholder="Search table"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#FFFFFF] pl-4 pr-4 py-2 w-full h-12 rounded-md shadow-md"
              />

              {searchQuery && filteredData.length !== data.length ? (
                <Button className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent hover:bg-transparent p-0 h-auto">
                  <X color="black" size={20} />
                </Button>
              ) : (
                <Button className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent hover:bg-transparent p-0 h-auto">
                  <Search color="black" size={20} />
                </Button>
              )}
            </div>

            <AdvancedSearchModal
              trigger={
                <Button
                  asChild
                  variant="default"
                  className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-sm lg:text-base text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>Advanced Search</span>
                  </div>
                </Button>
              }
            />
          </div>
          <div className="flex flex-col items-center mt-20 ">
            <Folder size={80} />
            <p className="text-center max-w-sm">
              Your item list is empty. Click the button below to create an item.
            </p>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex flex-row border border-[#0F1E7A] mt-5 cursor-pointer">
                    <Plus /> Add New Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md flex flex-col bg-white items-center">
                  <DialogHeader className="flex justify-center items-center">
                    <DialogTitle className="text-2xl">New Item</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new item below
                    </DialogDescription>
                  </DialogHeader>
                  <form className="flex flex-col w-full max-w-xl space-y-5">
                    <div className="space-y-2">
                      <Label>Name of Item *</Label>
                      <Input
                        placeholder="Request title"
                        className="!p-4 rounded-md border shadow-sm"
                        required
                      />
                    </div>
                    <div className="w-full flex gap-3">
                      <div className="w-full space-y-2">
                        <Label>Item Type *</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full space-y-2">
                        <Label>Brand</Label>
                        <Input
                          placeholder="Brand"
                          className="!p-4 rounded-md border shadow-sm"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Item Description *</Label>
                      <Textarea className="min-h-[100px] rounded-md border shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label>Attach Image</Label>
                      <div className="flex items-center gap-2 border border-[#9f9f9f] px-3 rounded-md shadow-sm py-0">
                        <Upload className="h-w w-5 text-gray-500" />
                        <Input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="border-none shadow-none focus-visible:ring-0 p-0 text-sm"
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-3">
                      <div className="w-full space-y-2">
                        <Label>Units</Label>
                        <Input
                          placeholder="Units"
                          className="!p-4 rounded-md border shadow-sm"
                          required
                        />
                      </div>
                      <div className="w-full space-y-2">
                        <Label>UOM (Unit of Measure)</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="UOM" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="w-full flex gap-3">
                      <div className="w-full space-y-2">
                        <Label>Recommended Vendor</Label>
                        <Input
                          placeholder="Vendor"
                          className="!p-4 rounded-md border shadow-sm"
                          required
                        />
                      </div>
                      <div className="w-full space-y-2">
                        <Label>Is this a worktool? *</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </form>

                  <div className="w-full flex gap-3">
                    <Button className="bg-[#0F1E7A] text-white px-18 cursor-pointer">
                      Submit
                    </Button>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="border border-[#DE1216] text-[#DE1216] px-19"
                      >
                        Close
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
