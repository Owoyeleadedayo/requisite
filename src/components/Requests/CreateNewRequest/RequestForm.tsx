"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { getToken } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { parseDate } from "chrono-node";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider, SliderProps } from "@mui/material";
import { log } from "console";

interface RequestFormProps {
  formData: {
    title: string;
    justification: string;
    deliveryLocation: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      justification: string;
      deliveryLocation: string;
    }>
  >;
  urgency: number[];
  setUrgency: React.Dispatch<React.SetStateAction<number[]>>;
  dateStart: Date | undefined;
  setDateStart: React.Dispatch<React.SetStateAction<Date | undefined>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

interface Location {
  _id: string;
  name: string;
}

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const marks = [{ value: 0 }, { value: 1 }, { value: 2 }];
export default function RequestForm({
  formData,
  setFormData,
  urgency,
  setUrgency,
  dateStart,
  setDateStart,
  handleSubmit,
  loading,
}: RequestFormProps) {
  const [openStart, setOpenStart] = useState(false);
  const [mydateStart, setMydateStart] = useState(formatDate(dateStart));
  const [monthStart, setMonthStart] = useState<Date | undefined>(dateStart);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/locations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data) {
          setLocations(data);
        }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white max-w-xl space-y-5 border-2 border-[#e5e5e5e5] shadow-xl p-5 rounded-xl"
    >
      <div className="space-y-2 mb-6">
        <Label>Request Title</Label>
        <Input
          placeholder="Request title"
          className="!p-4 rounded-md border shadow-sm bg-white"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2 mb-6">
        <Label>Urgency</Label>
        <div className="w-full py-3 shadow-md rounded-md bg-white">
          <div className="pl-3 pr-6">
            <Slider
              value={urgency[0]}
              onChange={(e, val) =>
                setUrgency(Array.isArray(val) ? val : [val])
              }
              marks={marks}
              step={1}
              max={2}
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
          className="rounded-md min-h-[100px] border shadow-sm bg-white"
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
          value={formData.deliveryLocation}
          onValueChange={(value) =>
            setFormData({ ...formData, deliveryLocation: value })
          }
          required
        >
          <SelectTrigger className="w-full bg-white">
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

      <div className="flex flex-col gap-1">
        <Label>Preferred Delivery Date *</Label>
        <div className="relative flex gap-2">
          <Input
            id="date-start"
            value={mydateStart}
            placeholder="Select date"
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
  );
}
