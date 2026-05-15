"use client";

import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Related from "@/components/Requests/ViewEditRequest/Related";

interface POItem {
  _id: string;
  itemId: string;
  itemDescription: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalPrice: number;
}

interface PODetails {
  _id: string;
  poNumber: string;
  requisition: { _id: string; title: string };
  rfq: { _id: string; rfqNumber: string };
  vendor: {
    _id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
  };
  items: POItem[];
  totalAmount: number;
  deliveryLocation: { _id: string; name: string; address: string };
  deliveryDate: string;
  deliveryContact: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  evaluationCriteria: string;
  termsOfService: string;
  status: string;
}

export default function ViewPO() {
  const router = useRouter();
  const token = getToken();
  const { poId } = useParams();
  const [loading, setLoading] = useState(true);
  const [po, setPo] = useState<PODetails | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingQuote, setDownloadingQuote] = useState(false);

  useEffect(() => {
    const fetchPODetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/purchase-orders/${poId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) setPo(data.data);
        } else {
          console.error("Failed to fetch PO details");
        }
      } catch (error) {
        console.error("Error fetching PO details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPODetails();
  }, [poId, token]);

  const handleDownloadPO = async () => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/purchase-orders/${poId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to download PO");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PO-${po?.poNumber || poId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Purchase Order downloaded successfully");
    } catch (error) {
      console.error("Error downloading PO:", error);
      toast.error("Failed to download Purchase Order");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadVendorQuote = async () => {
    if (!po) return;
    setDownloadingQuote(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/rfqs/${po.rfq._id}/download?vendorIds=${po.vendor._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vendor-quote-${po.rfq.rfqNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Vendor quote downloaded successfully");
      } else {
        toast.error("Failed to download vendor quote");
      }
    } catch (error) {
      console.error("Error downloading vendor quote:", error);
      toast.error("Failed to download vendor quote");
    } finally {
      setDownloadingQuote(false);
    }
  };

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <button
        onClick={() => router.back()}
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#1a2e6e] text-[#1a2e6e] hover:bg-[#f0f3fa] transition-colors"
      >
        <ArrowLeft size={16} />
      </button>

      <h1 className="mb-6 text-3xl font-bold text-[#1a2e6e]">View PO</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2e6e]" />
        </div>
      ) : !po ? (
        <p className="text-gray-500">PO not found.</p>
      ) : (
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Left Column */}
          <div className="flex flex-1 flex-col gap-5">
            {/* Line Items Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-5 py-4 text-left font-semibold text-gray-800">
                      Item Description
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-800">
                      QTY
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-800">
                      UOM
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-800">
                      Unit Price
                    </th>
                    <th className="px-4 py-4 text-left font-semibold text-gray-800">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {po.items.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-5 py-3 text-gray-700">
                        {item.itemDescription}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{item.uom}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatCurrency(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Purchase Order Details */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h2 className="mb-5 text-base font-bold text-gray-900 uppercase tracking-wide">
                Purchase Order Details
              </h2>
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="font-bold text-gray-800">PO Number: </span>
                  <span className="text-gray-700">{po.poNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">Status: </span>
                  <span className="text-gray-700 capitalize">{po.status}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Delivery Location:{" "}
                  </span>
                  <span className="text-gray-700">
                    {po.deliveryLocation?.name}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Delivery Contact:{" "}
                  </span>
                  <span className="text-gray-700">
                    {po.deliveryContact?.firstName}{" "}
                    {po.deliveryContact?.lastName}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Evaluation Criteria:{" "}
                  </span>
                  <span className="text-gray-700">{po.evaluationCriteria}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Expected Delivery Date:{" "}
                  </span>
                  <span className="text-gray-700">
                    {formatDate(po.deliveryDate)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Terms of Service:{" "}
                  </span>
                  <span className="text-gray-700">{po.termsOfService}</span>
                </div>
                <div className="mt-1">
                  <span className="font-bold text-gray-900 text-base">
                    Total Amount:{" "}
                  </span>
                  <span className="font-semibold text-gray-900 text-base">
                    {formatCurrency(po.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleDownloadVendorQuote}
                  disabled={downloadingQuote}
                  className="rounded-lg border border-[#1a2e6e] px-5 py-3 text-sm font-semibold text-[#1a2e6e] hover:bg-[#f0f3fa] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingQuote
                    ? "Downloading..."
                    : "Download Vendor Quote"}
                </button>
                <button
                  onClick={handleDownloadPO}
                  disabled={downloading}
                  className="rounded-lg bg-[#1a2e6e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#142559] transition-colors disabled:opacity-50"
                >
                  {downloading ? "Downloading..." : "Download PO"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex w-full flex-col gap-5 lg:w-[400px]">
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

            {/* Vendor Info Card */}
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="font-bold text-gray-800">
                    Company Name:{" "}
                  </span>
                  <span className="text-gray-700">{po.vendor?.name}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Contact Person:{" "}
                  </span>
                  <span className="text-gray-700">
                    {po.vendor?.contactPerson}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">Phone No.: </span>
                  <span className="text-gray-700">{po.vendor?.phone}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    Email Address:{" "}
                  </span>
                  <span className="text-gray-700">{po.vendor?.email}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">Address: </span>
                  <span className="text-gray-700">{po.vendor?.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
