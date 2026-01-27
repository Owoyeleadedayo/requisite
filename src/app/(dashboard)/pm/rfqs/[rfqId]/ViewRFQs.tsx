"use client";

import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/config";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import Related from "@/components/Requests/ViewEditRequest/Related";

interface VendorCard {
  id: string;
  companyName: string;
  contactPerson: string;
  phoneNo: string;
  emailAddress: string;
  address: string;
}

interface APIVendor {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

interface RequestItem {
  id: string;
  itemId: string;
  itemDescription: string;
  detailedSpecification: string;
  uom: string;
  quantity: number;
  expectedDeliveryDate: string;
}

interface RelatedRequest {
  title: string;
  department: string;
}

interface RFQData {
  _id: string;
  rfqNumber: string;
  title: string;
  requisition: {
    _id: string;
    title: string;
    requisitionNumber: string;
  };
  vendor: APIVendor | APIVendor[];
  items: RequestItem[];
  evaluationCriteria: string;
  termsAndConditions: string;
  deliveryLocation: {
    _id: string;
    name: string;
    address: string;
  };
  expectedDeliveryDate: string;
  status: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ViewRFQs = () => {
  const params = useParams();
  const router = useRouter();
  const rfqId = params.rfqId as string;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"REQUEST" | "RFQs" | "POs">(
    "REQUEST",
  );
  const [bulkAction, setBulkAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [rfqData, setRfqData] = useState<RFQData | null>(null);
  const [vendors, setVendors] = useState<VendorCard[]>([]);
  const [items, setItems] = useState<RequestItem[]>([]);

  const relatedRequest: RelatedRequest = {
    title: "Request for Microphones",
    department: "IT Dept",
  };

  useEffect(() => {
    if (!rfqId) {
      router.push("/pm/rfqs");
      return;
    }
    const fetchRFQData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          setRfqData(data.data);
          // Assuming vendor is an array, if single, wrap in array
          const vendorArray = Array.isArray(data.data.vendor)
            ? data.data.vendor
            : [data.data.vendor];
          setVendors(
            vendorArray.map((v: APIVendor) => ({
              ...v,
              id: v._id,
              companyName: v.name,
            })),
          );
          setItems(
            data.data.items.map((item: RequestItem) => ({
              ...item,
              id: item.itemId,
            })),
          );
        } else {
          toast.error("Failed to fetch RFQ data");
        }
      } catch (error) {
        console.error("Error fetching RFQ:", error);
        toast.error("Failed to fetch RFQ data");
      } finally {
        setLoading(false);
      }
    };
    fetchRFQData();
  }, [rfqId, router]);

  const toggleVendor = (id: string) => {
    setSelectedVendor((prev) => (prev === id ? null : id));
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAllItems = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.itemId));
    }
  };

  const generatePO = () => {
    if (!selectedVendor || selectedItems.length === 0 || !rfqData) return;
    // Store data in localStorage for GeneratePO component
    localStorage.setItem(
      "poData",
      JSON.stringify({
        selectedVendor,
        selectedItems,
        rfqData,
        vendors,
        items,
      }),
    );
    router.push(`/pm/rfqs/${rfqId}/generate-po`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-4 md:py-8">
      <div className="max-w-7xl">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A]"></div>
            <span className="ml-2 text-gray-600">Loading RFQ data...</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <button className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-900 text-blue-900 hover:bg-blue-50 mb-4">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-blue-900">
                VIEW RFQs
              </h1>

              <p className="text-sm text-gray-600 mt-2">
                Choose the approved vendor below to generate the PO
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Section - Vendor Cards */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 relative shadow-sm cursor-pointer"
                      onClick={() => toggleVendor(vendor.id)}
                    >
                      <div className="absolute top-4 right-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 cursor-pointer ${
                            selectedVendor === vendor.id
                              ? "bg-[#0F1E7A] border-[#0F1E7A]"
                              : "border-gray-300"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVendor(vendor.id);
                          }}
                        ></div>
                      </div>

                      <div className="space-y-2 pr-8">
                        <div>
                          <span className="font-semibold text-sm">
                            Company Name:{" "}
                          </span>
                          <span className="text-sm">{vendor.companyName}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm">
                            Contact Person:{" "}
                          </span>
                          <span className="text-sm">
                            {vendor.contactPerson}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm">
                            Phone No.:{" "}
                          </span>
                          <span className="text-sm">{vendor.phoneNo}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm">
                            Email Address:{" "}
                          </span>
                          <span className="text-sm">{vendor.emailAddress}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-sm">
                            Address:{" "}
                          </span>
                          <span className="text-sm">{vendor.address}</span>
                        </div>
                      </div>

                      <button
                        className="mt-4 px-6 py-2 border-2 border-blue-900 text-blue-900 hover:text-white rounded-md font-semibold hover:bg-blue-900 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download RFQ
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Section - Related Tab */}
              <div className="lg:col-span-1">
                <Related
                  requests={[
                    {
                      _id: "1",
                      title: "Request for Microphones",
                      department: "IT Dept",
                    },
                  ]}
                  rfqs={[
                    {
                      _id: "2",
                      title: "RFQ for Equipment",
                      department: "HR Dept",
                    },
                  ]}
                  pos={[
                    {
                      _id: "2",
                      title: "RFQ for Equipment",
                      department: "HR Dept",
                    },
                  ]}
                  onViewItem={(item, type) => {
                    console.log("View", type, item);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
              {/* Request Details */}
              <div className="lg:col-span-2 h-auto w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold mb-4">REQUEST DETAILS</h2>

                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <p>
                      <span className="font-semibold">RFQ Title:</span>{" "}
                      {rfqData?.title || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {rfqData?.deliveryLocation?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Evaluation Criteria:
                      </span>{" "}
                      {rfqData?.evaluationCriteria || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Expected Delivery Date:
                      </span>{" "}
                      {rfqData?.expectedDeliveryDate
                        ? new Date(
                            rfqData.expectedDeliveryDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Terms of Service:</span>{" "}
                      {rfqData?.termsAndConditions || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="lg:col-span-2 w-full bg-white rounded-lg border border-gray-200 p-6 overflow-x-auto shadow-sm">
                <div className="flex gap-2 justify-end mb-4">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Bulk actions</option>
                    <option value="delete">Delete Selected</option>
                    <option value="edit">Edit Selected</option>
                  </select>
                  <button className="px-6 py-2 bg-gray-400 text-white rounded-md font-medium hover:bg-gray-500">
                    Apply
                  </button>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === items.length}
                          onChange={toggleAllItems}
                          className="w-4 h-4 text-blue-900 rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Item Description
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        UOM
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        QTY
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.itemId}
                        className="border-b border-gray-100"
                      >
                        <td className="py-4 px-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.itemId)}
                            onChange={() => toggleItem(item.itemId)}
                            className="w-4 h-4 text-blue-900 rounded border-gray-300"
                          />
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {item.itemDescription}
                        </td>
                        <td className="py-4 px-4 text-sm">{item.uom}</td>
                        <td className="py-4 px-4 text-sm">{item.quantity}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-gray-100 rounded">
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded">
                              <Trash2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={generatePO}
              disabled={!selectedVendor || selectedItems.length === 0}
              className={`my-6 w-full md:w-auto px-8 py-3 rounded-md font-semibold transition-colors ${
                selectedVendor && selectedItems.length > 0
                  ? "bg-blue-900 text-white hover:bg-blue-800"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              Generate PO
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewRFQs;
