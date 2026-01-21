"use client";

import React, { useState } from "react";

interface POItemData {
  itemDescription: string;
  brand: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  totalPrice: number;
  detailsSpecification: string;
}

interface EditPOItemProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (itemData: POItemData) => void;
  itemData?: POItemData;
}

const EditPOItem: React.FC<EditPOItemProps> = ({
  isOpen,
  onClose,
  onUpdate,
  itemData,
}) => {
  const [formData, setFormData] = useState<POItemData>({
    itemDescription: itemData?.itemDescription || "HV DC disconnect (>=80A...",
    brand: itemData?.brand || "Pieces",
    quantity: itemData?.quantity || 12,
    uom: itemData?.uom || "Pieces",
    unitPrice: itemData?.unitPrice || 120000,
    totalPrice: itemData?.totalPrice || 1440000,
    detailsSpecification:
      itemData?.detailsSpecification ||
      "Our team requires new laptops with high performance specification to replace the old ones",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          name === "quantity" || name === "unitPrice"
            ? parseFloat(value) || 0
            : value,
      };

      // Auto-calculate total price when quantity or unit price changes
      if (name === "quantity" || name === "unitPrice") {
        updated.totalPrice = updated.quantity * updated.unitPrice;
      }

      return updated;
    });
  };

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with dotted border */}
        <div className="border-2 border-dashed border-blue-900 rounded-t-lg p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F1E7A]">
            Edit PO Item
          </h2>
        </div>

        {/* Form Content with dotted border */}
        <div className="border-x-2 border-b-2 border-dashed border-blue-900 rounded-b-lg p-6">
          <div className="space-y-6">
            {/* Item Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Item Description
              </label>
              <input
                type="text"
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-semibold mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* UMO */}
            <div>
              <label className="block text-sm font-semibold mb-2">UMO</label>
              <input
                type="text"
                name="uom"
                value={formData.uom}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Unit Price
              </label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Total Price
              </label>
              <input
                type="text"
                name="totalPrice"
                value={formData.totalPrice.toLocaleString()}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg text-sm bg-gray-50 focus:outline-none"
              />
            </div>

            {/* Details Specification */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Details Specification
              </label>
              <textarea
                name="detailsSpecification"
                value={formData.detailsSpecification}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleUpdate}
                className="flex-1 px-8 py-3 bg-[#0F1E7A] text-white rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors"
              >
                Update
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-8 py-3 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPOItem;
