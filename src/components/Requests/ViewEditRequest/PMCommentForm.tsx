import React, { useState, useRef, useEffect } from "react";
import {
  CalendarIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/config";

interface VendorCategory {
  _id: string;
  name: string;
  description: string;
}

export default function PMCommentForm() {
  const [bidStart, setBidStart] = useState<Date>();
  const [bidDeadline, setBidDeadline] = useState<Date>();
  const [vendorCategory, setVendorCategory] = useState<string>("");
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>(
    []
  );
  const [additionalInfo, setAdditionalInfo] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const [errors, setErrors] = useState({
    bidStart: "",
    bidDeadline: "",
    vendorCategory: "",
    additionalInfo: "",
    dateRange: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchVendorCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vendor-categories`);
        if (response.ok) {
          const data = await response.json();
          setVendorCategories(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch vendor categories:", error);
      }
    };
    fetchVendorCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {
      bidStart: "",
      bidDeadline: "",
      vendorCategory: "",
      additionalInfo: "",
      dateRange: "",
    };
    let isValid = true;

    // Validate Bid Start
    if (!bidStart) {
      newErrors.bidStart = "Bid start date is required";
      isValid = false;
    }

    // Validate Bid Deadline
    if (!bidDeadline) {
      newErrors.bidDeadline = "Bid deadline is required";
      isValid = false;
    }

    // Validate Vendor Category
    if (!vendorCategory) {
      newErrors.vendorCategory = "Vendor category is required";
      isValid = false;
    }

    // Validate Additional Information
    const textContent = editorRef.current?.textContent || "";
    if (!textContent.trim()) {
      newErrors.additionalInfo = "Additional information is required";
      isValid = false;
    } else if (textContent.trim().length < 10) {
      newErrors.additionalInfo =
        "Additional information must be at least 10 characters";
      isValid = false;
    }

    // Validate date range
    if (bidStart && bidDeadline) {
      if (bidDeadline <= bidStart) {
        newErrors.dateRange = "Bid deadline must be after bid start date";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Clear previous status
    setSubmitStatus({ type: "", message: "" });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://your-api-endpoint.com/api/procurement/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bidStart: bidStart?.toISOString(),
            bidDeadline: bidDeadline?.toISOString(),
            vendorCategory,
            additionalInfo: editorRef.current?.innerHTML || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setSubmitStatus({
        type: "success",
        message: "Comment submitted successfully!",
      });

      // Reset form
      setBidStart(undefined);
      setBidDeadline(undefined);
      setVendorCategory("");
      setAdditionalInfo("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setErrors({
        bidStart: "",
        bidDeadline: "",
        vendorCategory: "",
        additionalInfo: "",
        dateRange: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to submit comment. Please try again.",
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <h1 className="text-base font-semibold mb-8 text-[#121212]">
        Comment from Procurement Manager
      </h1>

      <div className="space-y-6">
        {/* Status Alert */}
        {submitStatus.message && (
          <Alert
            className={
              submitStatus.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }
          >
            <AlertDescription
              className={
                submitStatus.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Date Range Error */}
        {errors.dateRange && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {errors.dateRange}
            </AlertDescription>
          </Alert>
        )}

        {/* Bid Start */}
        <div className="space-y-2">
          <Label>Bid Start</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left font-normal bg-white border border-[#9f9f9f] rounded-xl p-4 h-auto shadow-sm",
                  !bidStart && "text-muted-foreground",
                  errors.bidStart && "border-red-500"
                )}
              >
                {bidStart ? format(bidStart, "PPP") : "Select date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={bidStart}
                onSelect={(date) => {
                  setBidStart(date);
                  setErrors((prev) => ({
                    ...prev,
                    bidStart: "",
                    dateRange: "",
                  }));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.bidStart && (
            <p className="text-red-500 text-sm mt-1">{errors.bidStart}</p>
          )}
        </div>

        {/* Bid Deadline */}
        <div className="space-y-2">
          <Label>Bid Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left font-normal bg-white border border-[#9f9f9f] rounded-xl p-4 h-auto shadow-sm",
                  !bidDeadline && "text-muted-foreground",
                  errors.bidDeadline && "border-red-500"
                )}
              >
                {bidDeadline ? format(bidDeadline, "PPP") : "Select date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={bidDeadline}
                onSelect={(date) => {
                  setBidDeadline(date);
                  setErrors((prev) => ({
                    ...prev,
                    bidDeadline: "",
                    dateRange: "",
                  }));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.bidDeadline && (
            <p className="text-red-500 text-sm mt-1">{errors.bidDeadline}</p>
          )}
        </div>

        {/* Vendor Category */}
        <div className="space-y-2">
          <Label>Vendor Category</Label>
          <Select
            value={vendorCategory}
            onValueChange={(value) => {
              setVendorCategory(value);
              setErrors((prev) => ({ ...prev, vendorCategory: "" }));
            }}
          >
            <SelectTrigger
              className={cn(
                "w-full bg-white border border-[#9f9f9f] rounded-xl p-4 h-auto shadow-sm",
                errors.vendorCategory && "border-red-500"
              )}
            >
              <SelectValue placeholder="Select vendor category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {vendorCategories.map((category) => (
                <SelectItem 
                  key={category._id} 
                  value={category._id}
                  className="hover:bg-[#0F1E7A] hover:text-white focus:bg-[#0F1E7A] focus:text-white data-[highlighted]:bg-[#0F1E7A] data-[highlighted]:text-white"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vendorCategory && (
            <p className="text-red-500 text-sm mt-1">{errors.vendorCategory}</p>
          )}
        </div>

        {/* Additional Information */}
        <div className="space-y-2">
          <Label>Additional Information</Label>
          <div
            className={`border rounded-xl shadow-sm ${
              errors.additionalInfo ? "border-red-500" : "border-[#9f9f9f]"
            }`}
          >
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  document.execCommand("bold", false);
                  setActiveFormats((prev) => ({ ...prev, bold: !prev.bold }));
                }}
                className={`h-8 w-8 p-0 ${
                  activeFormats.bold
                    ? "bg-[#0F1E7A] text-white hover:bg-[#0F1E7A]/90"
                    : ""
                }`}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  document.execCommand("italic", false);
                  setActiveFormats((prev) => ({
                    ...prev,
                    italic: !prev.italic,
                  }));
                }}
                className={`h-8 w-8 p-0 ${
                  activeFormats.italic
                    ? "bg-[#0F1E7A] text-white hover:bg-[#0F1E7A]/90"
                    : ""
                }`}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  document.execCommand("underline", false);
                  setActiveFormats((prev) => ({
                    ...prev,
                    underline: !prev.underline,
                  }));
                }}
                className={`h-8 w-8 p-0 ${
                  activeFormats.underline
                    ? "bg-[#0F1E7A] text-white hover:bg-[#0F1E7A]/90"
                    : ""
                }`}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  document.execCommand("insertUnorderedList", false)
                }
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => document.execCommand("insertOrderedList", false)}
                className="h-8 w-8 p-0"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
            {/* Editor */}
            <div
              ref={editorRef}
              contentEditable
              className="min-h-[200px] p-3 outline-none"
              style={{ wordBreak: "break-word" }}
              onInput={() => {
                setErrors((prev) => ({ ...prev, additionalInfo: "" }));
              }}
              onMouseUp={() => {
                setActiveFormats({
                  bold: document.queryCommandState("bold"),
                  italic: document.queryCommandState("italic"),
                  underline: document.queryCommandState("underline"),
                });
              }}
              onKeyUp={() => {
                setActiveFormats({
                  bold: document.queryCommandState("bold"),
                  italic: document.queryCommandState("italic"),
                  underline: document.queryCommandState("underline"),
                });
              }}
              suppressContentEditableWarning={true}
            />
          </div>
          {errors.additionalInfo && (
            <p className="text-red-500 text-sm mt-1">{errors.additionalInfo}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#0F1E7A] hover:bg-blue-800 text-white px-16 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
