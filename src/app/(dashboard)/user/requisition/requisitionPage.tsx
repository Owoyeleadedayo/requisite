"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Upload, Ellipsis, Send } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

// Mock data (in practice, fetch from an API)
const tableItems = [
  {
    id: "1",
    ItemDesc: "Laptop XPS 13",
    qty: 12,
    uom: "pcs",
    date: "08-May-2025",
    brand: "Dell",
    price: 100000,
    status: "Pending HOD Approval",
    department: "IT",
    message: "High-performance laptops for development team",
    category: "apple",
    document: null,
    notes: "",
  },
  {
    id: "2",
    ItemDesc: "Office Chair",
    qty: 20,
    uom: "pcs",
    date: "12-May-2025",
    brand: "Ikea",
    price: 45000,
    status: "Approved",
    department: "Facilities",
    message: "Ergonomic chairs for office",
    category: "banana",
    document: null,
    notes: "",
  },
  {
    id: "3",
    ItemDesc: "Projector",
    qty: 5,
    uom: "pcs",
    date: "15-May-2025",
    brand: "Epson",
    price: 120000,
    status: "Pending Procurement",
    department: "Training",
    message: "Projectors for training sessions",
    category: "blueberry",
    document: null,
    notes: "",
  },
  {
    id: "4",
    ItemDesc: "Printer Toner",
    qty: 30,
    uom: "packs",
    date: "18-May-2025",
    brand: "HP",
    price: 15000,
    status: "Rejected",
    department: "Admin",
    message: "Toner for office printers",
    category: "grapes",
    document: null,
    notes: "",
  },
  {
    id: "5",
    ItemDesc: "Conference Table",
    qty: 2,
    uom: "pcs",
    date: "20-May-2025",
    brand: "Lagos Furnitures",
    price: 200000,
    status: "Pending HOD Approval",
    department: "Facilities",
    message: "Tables for meeting rooms",
    category: "pineapple",
    document: null,
    notes: "",
  },
  {
    id: "6",
    ItemDesc: "External Hard Drive",
    qty: 15,
    uom: "pcs",
    date: "23-May-2025",
    brand: "Seagate",
    price: 25000,
    status: "Approved",
    department: "IT",
    message: "Storage for backups",
    category: "apple",
    document: null,
    notes: "",
  },
  {
    id: "7",
    ItemDesc: "Air Conditioner",
    qty: 4,
    uom: "units",
    date: "26-May-2025",
    brand: "Samsung",
    price: 180000,
    status: "Pending Installation",
    department: "Facilities",
    message: "AC units for new office",
    category: "banana",
    document: null,
    notes: "",
  },
  {
    id: "8",
    ItemDesc: "Desk Lamp",
    qty: 50,
    uom: "pcs",
    date: "29-May-2025",
    brand: "Philips",
    price: 8000,
    status: "Approved",
    department: "Admin",
    message: "Lamps for workstations",
    category: "grapes",
    document: null,
    notes: "",
  },
];

export default function RequisitionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"table" | "new" | "view" | "edit">("table");
  const [selectedItem, setSelectedItem] = useState<
    (typeof tableItems)[0] | null
  >(null);
  const [formData, setFormData] = useState({
    ItemDesc: "",
    department: "",
    message: "",
    category: "",
    qty: 0,
    uom: "",
    price: 0,
    brand: "",
    notes: "",
  });
  const [fileName, setFileName] = useState("");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Parse query parameters to determine mode
  useEffect(() => {
    const viewId = searchParams.get("view");
    const editId = searchParams.get("edit");
    const newRequest = searchParams.get("new");

    if (viewId) {
      const item = tableItems.find((item) => item.id === viewId);
      if (item) {
        setMode("view");
        setSelectedItem(item);
        setFormData({
          ItemDesc: item.ItemDesc,
          department: item.department,
          message: item.message,
          category: item.category,
          qty: item.qty,
          uom: item.uom,
          price: item.price,
          brand: item.brand,
          notes: item.notes,
        });
        setFileName(item.document || "");
      } else {
        setMode("table");
      }
    } else if (editId) {
      const item = tableItems.find((item) => item.id === editId);
      if (item) {
        setMode("edit");
        setSelectedItem(item);
        setFormData({
          ItemDesc: item.ItemDesc,
          department: item.department,
          message: item.message,
          category: item.category,
          qty: item.qty,
          uom: item.uom,
          price: item.price,
          brand: item.brand,
          notes: item.notes,
        });
        setFileName(item.document || "");
      } else {
        setMode("table");
      }
    } else if (newRequest === "true") {
      setMode("new");
      setSelectedItem(null);
      setFormData({
        ItemDesc: "",
        department: "",
        message: "",
        category: "",
        qty: 0,
        uom: "",
        price: 0,
        brand: "",
        notes: "",
      });
      setFileName("");
    } else {
      setMode("table");
      setSelectedItem(null);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "new") {
      setIsSubmitDialogOpen(true); // Show dialog for new requests
    } else {
      submitForm();
    }
  };

  const submitForm = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
      ];
      if (!validTypes.includes(file.type)) {
        alert(
          "Please upload a valid document (PDF, DOC, DOCX, XLS, XLSX, TXT)."
        );
        return;
      }
      setFileName(file.name);
      // Handle file upload (e.g., send to an API)
      console.log("Selected file:", file.name);
    }
    // Handle form submission (e.g., save new or updated item)
    console.log("Form data:", formData);
    if (mode === "new") {
      toast.success("Request successfully created", {
        description: "Your new request has been submitted.",
      });
    }
    setMode("table");
    setIsSubmitDialogOpen(false);
    router.replace("/requisition");
  };

  const handleCancelRequest = () => {
    if (selectedItem) {
      // Handle cancellation (e.g., update status to 'Cancelled' via API)
      console.log(`Cancelling request with ID: ${selectedItem.id}`);
    }
    setIsCancelDialogOpen(false);
    setMode("table");
    router.replace("/requisition");
  };

  const handleClose = () => {
    setMode("table");
    router.replace("/requisition");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  return (
    <>
      <div className="flex flex-col py-4 px-4 md:px-6 gap-6">
        {mode === "table" ? (
          <>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
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
            <div className="flex justify-between items-center py-4 gap-2">
            <p className='text-md md:text-2xl text-[#0F1E7A] font-medium leading-5'>Request Submitted</p>
              <Button
                onClick={() => router.push("/user/requisition?new=true")}
                className='px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer'
              >
                <Plus size={22} /> New Request
              </Button>
            </div>
            <TableContent />
          </>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl text-[#0F1E7A] font-medium">
              {mode === "new"
                ? "Create New Request"
                : mode === "view"
                ? "View Request"
                : "Edit Request"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-[60%_40%]">
                <div className="flex flex-col space-y-3">
                  <div className="grid w-full max-w-md items-center">
                    <Label htmlFor="ItemDesc" className="text-md font-normal">
                      Request Title
                    </Label>
                    <Input
                      type="text"
                      id="ItemDesc"
                      name="ItemDesc"
                      value={formData.ItemDesc}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="border-1"
                    />
                  </div>
                  <div className="grid w-full max-w-md items-center">
                    <Label htmlFor="department" className="text-md font-normal">
                      Department
                    </Label>
                    <Input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="border-1"
                    />
                  </div>
                  <div className="grid w-full max-w-md">
                    <Label htmlFor="message" className="text-md font-normal">
                      Your message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="h-[80px] overflow-y-auto"
                    />
                  </div>
                  <div className="grid w-full max-w-md">
                    <Label className="text-md font-normal">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleSelectChange}
                      disabled={mode === "view"}
                    >
                      <SelectTrigger className="bg-gray-100 w-full border-1">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
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
                  <div className="grid w-full max-w-md items-center">
                    <Label htmlFor="qty" className="text-md font-normal">
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      id="qty"
                      name="qty"
                      value={formData.qty}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="border-1"
                    />
                  </div>
                  <div className="grid w-full max-w-md items-center">
                    <Label htmlFor="uom" className="text-md font-normal">
                      Units
                    </Label>
                    <Input
                      type="text"
                      id="uom"
                      name="uom"
                      value={formData.uom}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="border-1"
                    />
                  </div>
                  <div className="grid w-full max-w-md items-center">
                    <Label htmlFor="price" className="text-md font-normal">
                      (₦) Unit Price
                    </Label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="border-1"
                    />
                  </div>
                  <div className="grid w-full max-w-md items-center">
                    <Label htmlFor="brand" className="text-md font-normal">
                      Preferred Brand (Top 3)
                    </Label>
                    <Input
                      type="text"
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="border-1"
                    />
                  </div>
                  <div className="grid w-full max-w-md items-center">
                    <Label htmlFor="attachment" className="text-md font-normal">
                      Attachment
                    </Label>
                    <label
                      htmlFor="attachment"
                      className="cursor-pointer border rounded-md px-4 py-2 text-xs text-gray-500 hover:bg-gray-100"
                    >
                      {fileName ||
                        "Upload invoice, image, quotation, or supporting document"}
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        id="attachment"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        disabled={mode === "view"}
                        onChange={(e) =>
                          setFileName(e.target.files?.[0]?.name || "")
                        }
                      />
                      <Upload
                        size={18}
                        color="gray"
                        className="absolute top-[-28px] right-5"
                      />
                    </div>
                  </div>
                  <div className="grid w-full max-w-md">
                    <Label htmlFor="notes" className="text-md font-normal">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      disabled={mode === "view"}
                      className="h-[80px] overflow-y-auto"
                    />
                  </div>
                  <div className="flex gap-4">
                    {(mode === "edit" || mode === "view") && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="px-8 py-4 bg-[#ED3237] border-none text-white text-md font-medium"
                      >
                        Close
                      </Button>
                    )}
                    {mode === "view" && (
                      <Button
                        type="button"
                        onClick={() =>
                          router.push(`/requisition?edit=${selectedItem?.id}`)
                        }
                        className="bg-[#0F1E7A] px-8 py-4 text-white text-md font-medium"
                      >
                        Edit
                      </Button>
                    )}
                    {(mode === "new" || mode === "edit") &&
                      (mode === "new" ? (
                        <Dialog
                          open={isSubmitDialogOpen}
                          onOpenChange={setIsSubmitDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="submit"
                              className="bg-[#0F1E7A] px-10 text-white text-md font-medium"
                            >
                              Proceed
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Submission</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to submit this new
                                request?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsSubmitDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={submitForm}
                                className="bg-[#0F1E7A] text-white"
                              >
                                Confirm
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button
                          type="submit"
                          className="bg-[#0F1E7A] px-10 text-white text-md font-medium"
                        >
                          Save
                        </Button>
                      ))}
                    {(mode === "view" || mode === "edit") && (
                      <Dialog
                        open={isCancelDialogOpen}
                        onOpenChange={setIsCancelDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="px-6 py-4"
                          >
                            Cancel Request
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Cancellation</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel this request?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsCancelDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleCancelRequest}
                              className="bg-[#0F1E7A] text-white"
                            >
                              Confirm
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                <div className="flex flex-col py-5  h-[600px] border border-[#E5E5E5] rounded-md">
                  <div className="flex items-center px-4 gap-2">
                    <Image
                      src="/avatar.png"
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <Textarea
                      placeholder="Start a conversation"
                      className="h-[10px] border border-[#9F9F9F]"
                    />
                  </div>
                  <div className="border-b-1 border-[#4F7396] py-3" />
                  <div className="flex justify-between items-center px-4 mt-4">
                    <div className="flex gap-3">
                      <div>
                        <Image
                          src="/avatar.png"
                          alt=""
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-md font-semibold">Benson John</p>
                            <p className="text-sm font-light">27 Mins ago</p>
                          </div>
                          <Ellipsis className="cursor-pointer" />
                        </div>

                        <p className="max-w-lg text-sm font-normal">
                          A better understanding of usage can aid in
                          prioritizing future efforts, be clear on the laptop
                          requirements and also adjust the price
                        </p>
                        <p className="text-sm font-normal text-[#0F1E7A] cursor-pointer">
                          Reply
                        </p>

                        {/* Nested reply */}
                        <div className="">
                          <div className="flex justify-between items-center  mt-4">
                            <div className="flex gap-3">
                              <div>
                                <Image
                                  src="/avatar.png"
                                  alt=""
                                  width={36}
                                  height={36}
                                  className="rounded-full"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <p className="text-md font-semibold">
                                      Benson John
                                    </p>
                                    <p className="text-sm font-light">
                                      27 Mins ago
                                    </p>
                                  </div>
                                  <Ellipsis className="cursor-pointer" />
                                </div>
                                <p className="max-w-lg text-sm font-normal">
                                  Totally agree with you! Clearer specs will
                                  really help.
                                </p>
                                <p className="text-sm font-normal text-[#0F1E7A] cursor-pointer">
                                  Reply
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* End nested reply */}
                        <div className="">
                          <div className="flex justify-between items-center  mt-4">
                            <div className="flex gap-3">
                              <div>
                                <Image
                                  src="/avatar.png"
                                  alt=""
                                  width={36}
                                  height={36}
                                  className="rounded-full"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <p className="text-md font-semibold">
                                      Benson John
                                    </p>
                                    <p className="text-sm font-light">
                                      27 Mins ago
                                    </p>
                                  </div>
                                  <Ellipsis className="cursor-pointer" />
                                </div>
                                <p className="max-w-lg text-sm font-normal">
                                  Totally agree with you! Clearer specs will
                                  really help.
                                </p>
                                <div className="flex flex-col gap-2">
                                  <p className="text-sm font-normal text-[#0F1E7A] cursor-pointer">
                                    Reply
                                  </p>
                                  <div className="relative items-center">
                                  <Textarea />
                                  <div className="absolute translate-y-5 top-0 right-2 cursor-pointer">
                                  <Send color="#9F9F9F" />
                                  </div>
                                  </div>
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
