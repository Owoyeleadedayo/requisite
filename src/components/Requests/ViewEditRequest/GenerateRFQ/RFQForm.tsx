"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  Plus,
  ChevronsUpDown,
  Check,
  X,
  SquarePen,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { parseDate } from "chrono-node";
import { Vendor } from "../../types";
import { useState } from "react";
import AddVendorDialog from "@/components/Vendor/AddVendorDialog";

interface Location {
  _id: string;
  name: string;
}

interface SuggestedVendor {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
}

interface SelectedVendor {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
}

interface Item {
  _id: string;
  recommendedVendor?: string;
}

interface RFQFormProps {
  rfqTitle: string;
  setRfqTitle: (title: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  locations: Location[];
  locationsLoading: boolean;
  mydateStart: string;
  setMydateStart: (date: string) => void;
  dateStart: Date | undefined;
  setDateStart: (date: Date | undefined) => void;
  monthStart: Date | undefined;
  setMonthStart: (month: Date | undefined) => void;
  openStart: boolean;
  setOpenStart: (open: boolean) => void;
  vendors: Vendor[];
  vendorsLoading: boolean;
  selectedVendor: string;
  setSelectedVendor: (vendor: string) => void;
  comboboxOpen: boolean;
  setComboboxOpen: (open: boolean) => void;
  handleCompleteRFQ: () => void;
  items: Item[];
  recommendedVendors?: Vendor[];
  onVendorAdded?: () => void;
}

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RFQForm({
  rfqTitle,
  setRfqTitle,
  selectedLocation,
  setSelectedLocation,
  locations,
  locationsLoading,
  mydateStart,
  setMydateStart,
  dateStart,
  setDateStart,
  monthStart,
  setMonthStart,
  openStart,
  setOpenStart,
  vendors,
  vendorsLoading,
  selectedVendor,
  setSelectedVendor,
  comboboxOpen,
  setComboboxOpen,
  handleCompleteRFQ,
  items,
  recommendedVendors = [],
  onVendorAdded,
}: RFQFormProps) {
  const [selectedVendors, setSelectedVendors] = useState<SelectedVendor[]>([]);

  // Convert recommended vendors to suggested vendors format, filtering out selected ones
  const suggestedVendors: SuggestedVendor[] = recommendedVendors
    .filter(vendor => 
      !selectedVendors.some(sv => sv.id === vendor._id)
    )
    .map(vendor => ({
      id: vendor._id,
      name: vendor.name,
      contact: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
    }));

  const addVendorToSelected = (vendor: SuggestedVendor) => {
    if (!selectedVendors.some(sv => sv.id === vendor.id)) {
      setSelectedVendors((prev) => [...prev, vendor]);
    }
  };

  const removeSelectedVendor = (id: string) => {
    setSelectedVendors((prev) => prev.filter((vendor) => vendor.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 my-5 rounded-md shadow-md bg-white">
      <div className="space-y-2">
        <Label>
          RFQ Title <span className="text-red-500 -ml-1">*</span>
        </Label>
        <Input
          value={rfqTitle}
          onChange={(e) => setRfqTitle(e.target.value)}
          className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <Label>
          Location<span className="text-red-500 -ml-1">*</span>
        </Label>
        <Select
          value={selectedLocation}
          onValueChange={setSelectedLocation}
          disabled={locationsLoading}
          required
        >
          <SelectTrigger className="w-full bg-white border border-[#9f9f9f]">
            <SelectValue
              placeholder={locationsLoading ? "Loading..." : "Select Location"}
            />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {locations.map((location) => (
              <SelectItem
                key={location._id}
                value={location._id}
                className="hover:bg-gray-100 data-[state=checked]:bg-[#0F1E7A] data-[state=checked]:text-white"
              >
                {location.name.charAt(0).toUpperCase() + location.name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Evaluation Criteria<span className="text-red-500 -ml-1">*</span>
        </Label>
        <Textarea
          id="criteria"
          className="min-h-[100px] rounded-xl border border-[#9f9f9f] shadow-sm"
        />
      </div>

      <div className="space-y-2">
        <Label>
          Expected Delivery Date
          <span className="text-red-500 -ml-1">*</span>
        </Label>
        <div className="relative flex gap-2">
          <Input
            id="date-start"
            value={mydateStart}
            placeholder="Select date"
            className="!p-4 rounded-xl border border-[#9f9f9f] shadow-sm pr-10"
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

      <div className="space-y-2">
        <Label htmlFor="itemDescription">
          Terms of Service <span className="text-red-500 -ml-1">*</span>
        </Label>
        <Textarea
          id="itemDescription"
          name="itemDescription"
          className="min-h-[100px] rounded-xl border border-[#9f9f9f] shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">VENDOR INFORMATION</h2>
        <div className="w-full flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-[50%] flex gap-4">
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger className="!bg-white !w-[200px]" asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between bg-white hover:bg-white border border-[#9f9f9f]"
                >
                  {selectedVendor
                    ? vendors.find((vendor) => vendor._id === selectedVendor)
                        ?.name
                    : vendorsLoading
                    ? "Loading vendors..."
                    : "Choose a vendor"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-0 bg-white">
                <Command>
                  <CommandInput placeholder="Search vendor..." />
                  <CommandList>
                    <CommandEmpty>No vendor found.</CommandEmpty>
                    <CommandGroup>
                      {vendors.map((vendor) => (
                        <CommandItem
                          key={vendor._id}
                          value={vendor.name}
                          onSelect={() => {
                            setSelectedVendor(
                              vendor._id === selectedVendor ? "" : vendor._id
                            );
                            setComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedVendor === vendor._id
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {vendor.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
              <Button
                className="bg-[#0F1E7A] text-white cursor-pointer"
                onClick={() => {
                  if (selectedVendor) {
                    const vendor = vendors.find((v) => v._id === selectedVendor);
                    if (
                      vendor &&
                      !selectedVendors.find((sv) => sv.id === vendor._id)
                    ) {
                      const newVendor = {
                        id: vendor._id,
                        name: vendor.name,
                        contact: vendor.contactPerson,
                        phone: vendor.phone,
                        email: vendor.email,
                        address: vendor.address,
                      };
                      setSelectedVendors((prev) => [...prev, newVendor]);
                      setSelectedVendor("");
                    }
                  }
                }}
              >
              Add
            </Button>
          </div>

          <div className="w-full lg:w-[50%] flex justify-center lg:justify-end items-center">
            <AddVendorDialog
              onVendorAdded={onVendorAdded || (() => {})} // fallback empty function to handle the case when onVendorAdded is undefined.
              trigger={
                <Button className="bg-[#0F1E7A] text-white cursor-pointer">
                  <Plus size={22} /> New Vendor
                </Button>
              }
            />
          </div>
        </div>

        {suggestedVendors.length > 0 && (
          <div className="vendor-suggestions my-3">
            <p className="text-base font-normal">
              {suggestedVendors.length === 1
                ? `Suggested Vendor`
                : `Suggested Vendors`}
            </p>

            <div className="suggestions w-full flex items-center gap-5 pt-1 pb-4 overflow-x-auto">
              {suggestedVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="w-fit flex-shrink-0 flex flex-col gap-2 border border-gray-200 rounded-md shadow-sm hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  onClick={() => addVendorToSelected(vendor)}
                >
                  <div className="p-3">
                    <h4 className="font-bold whitespace-nowrap">
                      {vendor.name}
                    </h4>
                    <p className="whitespace-nowrap">{vendor.contact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedVendors.length > 0 && (
          <div className="selected-vendors w-full flex flex-col gap-4 my-3">
            {selectedVendors.map((vendor, index) => (
              <div
                key={vendor.id}
                className={`vendor-selected-${
                  index + 1
                } w-full flex flex-col gap-3 p-3 border border-gray-200 rounded-md shadow-sm text-sm font-bold`}
              >
                <p>
                  Company Name:{" "}
                  <span className="font-normal">{vendor.name}</span>
                </p>
                <p>
                  Contact Person:{" "}
                  <span className="font-normal">{vendor.contact}</span>
                </p>
                <p>
                  Phone No.: <span className="font-normal">{vendor.phone}</span>
                </p>
                <p>
                  Email Address:{" "}
                  <span className="font-normal">{vendor.email}</span>
                </p>
                <p>
                  Address: <span className="font-normal">{vendor.address}</span>
                </p>

                <div className="selected-vendor-action-buttons flex flex-row justify-start items-center">
                  <div className="flex gap-2">
                    <div className="cursor-pointer">
                      <SquarePen size={20} color="#0F1E7A" />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => removeSelectedVendor(vendor.id)}
                    >
                      <Trash size={20} color="#ED3237" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button
          type="button"
          onClick={handleCompleteRFQ}
          className="font-bold text-base bg-[#0F1E7A] hover:bg-[#0b154b] text-white py-6 px-10"
        >
          Complete RFQ
        </Button>

        <Button
          type="button"
          className="font-bold text-base bg-red-600 hover:bg-red-700 text-white py-6 px-10"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
