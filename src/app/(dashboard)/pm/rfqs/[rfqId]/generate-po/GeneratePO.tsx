"use client";

import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/config";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Trash2, Upload } from "lucide-react";
import EditPOItem from "./EditPOItem";

interface POItem {
  id: string;
  itemDescription: string;
  uom: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  total: number;
  selected: boolean;
  detailsSpecification: string;
}

interface VendorInfo {
  companyName: string;
  contactPerson: string;
  phoneNo: string;
  emailAddress: string;
  address: string;
}

interface VendorCard {
  id: string;
  companyName: string;
  contactPerson: string;
  phoneNo: string;
  emailAddress: string;
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

interface APIVendor {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
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

interface POData {
  selectedVendor: string;
  selectedItems: string[];
  rfqData: RFQData;
  vendors: VendorCard[];
  items: RequestItem[];
}

interface POItemData {
  itemDescription: string;
  brand: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalPrice: number;
  detailsSpecification: string;
}

const GeneratePO = () => {
  const params = useParams();
  const router = useRouter();
  const rfqId = params.rfqId as string;

  const [loading, setLoading] = useState(true);
  const [bulkAction, setBulkAction] = useState("");
  const [vendorId, setVendorId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [requisitionId, setRequisitionId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<POItem | null>(null);
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);

  const [formData, setFormData] = useState({
    poTitle: "",
    deliveryLocation: "",
    shipping: "",
    deliveryContact: "",
    evaluationCriteria: "",
    expectedDeliveryDate: "",
    termsOfService: "",
    paymentTerms: "",
    totalAmount: "",
  });

  const [items, setItems] = useState<POItem[]>([]);

  useEffect(() => {
    const poData = localStorage.getItem("poData");
    if (!poData) {
      router.push("/pm/rfqs");
      return;
    }
    try {
      const parsedData: POData = JSON.parse(poData);
      const {
        selectedVendor,
        selectedItems: selItems,
        rfqData,
        vendors,
        items: reqItems,
      } = parsedData;
      const vendor = vendors.find((v: VendorCard) => v.id === selectedVendor);
      if (!vendor) {
        router.push("/pm/rfqs");
        return;
      }
      setVendorInfo({
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        phoneNo: vendor.phoneNo,
        emailAddress: vendor.emailAddress,
        address: vendor.address,
      });
      setVendorId(selectedVendor);
      setRequisitionId(rfqData.requisition._id);
      const selectedItemDetails = reqItems
        .filter((item: RequestItem) => selItems.includes(item.itemId))
        .map((item: RequestItem) => ({
          id: item.itemId,
          itemDescription: item.itemDescription,
          uom: item.uom,
          brand: "",
          quantity: item.quantity,
          unitPrice: 0,
          total: 0,
          selected: false,
          detailsSpecification: item.detailedSpecification || "",
        }));
      setItems(selectedItemDetails);
      setFormData({
        poTitle: rfqData.title,
        deliveryLocation: rfqData.deliveryLocation?.name || "",
        shipping: rfqData.deliveryLocation?.name || "",
        deliveryContact: "",
        evaluationCriteria: rfqData.evaluationCriteria || "",
        expectedDeliveryDate: rfqData.expectedDeliveryDate
          ? new Date(rfqData.expectedDeliveryDate).toLocaleDateString()
          : "",
        termsOfService: rfqData.termsAndConditions || "",
        paymentTerms: "",
        totalAmount: "",
      });
    } catch (error) {
      console.error("Error parsing PO data:", error);
      router.push("/pm/rfqs");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAllItems = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompletePO = async () => {
    if (!requisitionId || !vendorId) return;
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/requisitions/${requisitionId}/purchase-orders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vendorId,
            items: items.map((item) => ({
              itemId: item.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
            // Add other form data as needed
            poTitle: formData.poTitle,
            deliveryLocation: formData.deliveryLocation,
            shipping: formData.shipping,
            deliveryContact: formData.deliveryContact,
            evaluationCriteria: formData.evaluationCriteria,
            expectedDeliveryDate: formData.expectedDeliveryDate,
            termsOfService: formData.termsOfService,
            paymentTerms: formData.paymentTerms,
            totalAmount: formData.totalAmount,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Purchase Order created successfully");
        localStorage.removeItem("poData"); // Clean up
        router.push("/pm/pos");
      } else {
        toast.error("Failed to create Purchase Order");
      }
    } catch (error) {
      console.error("Error creating PO:", error);
      toast.error("Failed to create Purchase Order");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-16 py-4 md:py-8">
      <div className="max-w-7xl">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A]"></div>
            <span className="ml-2 text-gray-600">Loading PO data...</span>
          </div>
        ) : !vendorInfo ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-gray-600">No vendor data available.</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-900 text-blue-900 hover:bg-blue-50 mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-blue-900">
                GENERATE PO
              </h1>
            </div>

            {/* Items Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6 shadow-sm">
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

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
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
                        Brand
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        QTY
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Unit Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-4 h-4 text-blue-900 rounded border-gray-300"
                          />
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {item.itemDescription}
                        </td>
                        <td className="py-4 px-4 text-sm">{item.uom}</td>
                        <td className="py-4 px-4 text-sm">{item.brand}</td>
                        <td className="py-4 px-4 text-sm">{item.quantity}</td>
                        <td className="py-4 px-4 text-sm">
                          ₦{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          ₦{item.total.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              className="p-1.5 hover:bg-gray-100 rounded"
                              onClick={() => {
                                setEditingItem(item);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit2 className="w-4 h-4 text-blue-900" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Section - Form */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
                <div className="space-y-4">
                  {/* PO Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      PO Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="poTitle"
                      value={formData.poTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Delivery Location and Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Delivery Location{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="deliveryLocation"
                        value={formData.deliveryLocation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="Alimosho">Alimosho</option>
                        <option value="Ikeja">Ikeja</option>
                        <option value="Lekki">Lekki</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Shipping <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="shipping"
                        value={formData.shipping}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="Alimosho">Alimosho</option>
                        <option value="Ikeja">Ikeja</option>
                        <option value="Lekki">Lekki</option>
                      </select>
                    </div>
                  </div>

                  {/* Delivery Contact */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Delivery Contact <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="deliveryContact"
                      value={formData.deliveryContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="">Delivery Contact</option>
                      <option value="contact1">Contact 1</option>
                      <option value="contact2">Contact 2</option>
                    </select>
                  </div>

                  {/* Evaluation Criteria */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Evaluation Criteria
                    </label>
                    <textarea
                      name="evaluationCriteria"
                      value={formData.evaluationCriteria}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Expected Delivery Date */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Expected Delivery Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="expectedDeliveryDate"
                      value={formData.expectedDeliveryDate}
                      onChange={handleInputChange}
                      placeholder="MM/DD/YYYY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Terms of Service */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Terms of Service
                    </label>
                    <textarea
                      name="termsOfService"
                      value={formData.termsOfService}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Payment Terms
                    </label>
                    <textarea
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>

                  {/* Upload Vendor's Quote */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Upload Vendor&apos;s Quote{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        placeholder="Upload file"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Total Amount
                    </label>
                    <input
                      type="text"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* Right Section - Vendor Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm h-fit">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-sm">
                      Company Name:{" "}
                    </span>
                    <span className="text-sm">{vendorInfo.companyName}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">
                      Contact Person:{" "}
                    </span>
                    <span className="text-sm">{vendorInfo.contactPerson}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Phone No.: </span>
                    <span className="text-sm">{vendorInfo.phoneNo}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">
                      Email Address:{" "}
                    </span>
                    <span className="text-sm">{vendorInfo.emailAddress}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Address: </span>
                    <span className="text-sm">{vendorInfo.address}</span>
                  </div>
                  {/* <div className="pt-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <Edit2 className="w-4 h-4 text-blue-900" />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full md:max-w-md flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleCompletePO}
                className="flex-1 px-6 py-3 bg-[#0F1E7A] text-white rounded-md font-semibold hover:bg-blue-800 transition-colors"
              >
                Complete PO
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
      <EditPOItem
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={(itemData) => {
          setItems((prev) =>
            prev.map((i) =>
              i.id === editingItem?.id
                ? { ...i, ...itemData, total: itemData.totalPrice }
                : i,
            ),
          );
        }}
        itemData={
          editingItem
            ? {
                itemDescription: editingItem.itemDescription,
                brand: editingItem.brand,
                quantity: editingItem.quantity,
                uom: editingItem.uom,
                unitPrice: editingItem.unitPrice,
                totalPrice: editingItem.total,
                detailsSpecification: editingItem.detailsSpecification,
              }
            : undefined
        }
      />
    </div>
  );
};

export default GeneratePO;
