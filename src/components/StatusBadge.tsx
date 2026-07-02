import React from "react";
import { cn } from "@/lib/utils";

export type RequisitionStatus =
  // Requisition lifecycle
  | "draft"
  | "submitted"
  | "pending"
  | "departmentApproved"
  | "departmentRejected"
  | "procurementApproved"
  | "cancelled"
  // Bidding
  | "vendorBidding"
  | "bidding"
  | "hrReview"
  | "hhraReview"
  | "hhraApproved"
  | "hhraRejected"
  | "negotiation"
  | "vendorAcknowledged"
  // PO approvals
  | "hofApproved"
  | "hhrApproved"
  // RFQ / PO lifecycle
  | "issued"
  | "approved"
  | "rejected"
  | string; // graceful fallback for unknown values

interface StatusMap {
  label: string;
  color: string;
}

const statusMap: Record<string, StatusMap> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  submitted: {
    label: "Pending HOD Approval",
    color: "bg-orange-100 text-orange-800",
  },
  pending: {
    label: "Pending",
    color: "bg-orange-100 text-orange-800",
  },
  departmentApproved: {
    label: "Approved by HOD",
    color: "bg-blue-100 text-blue-800",
  },
  departmentRejected: {
    label: "Rejected by HOD",
    color: "bg-red-100 text-red-800",
  },
  hrReview: {
    label: "Approved by HOD (hr review)",
    color: "bg-blue-100 text-blue-800",
  },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  vendorBidding: {
    label: "Active Bidding Ongoing",
    color: "bg-purple-100 text-purple-800",
  },
  bidding: {
    label: "Active Bidding Ongoing",
    color: "bg-purple-100 text-purple-800",
  },
  hhraReview: {
    label: "Bid Review Ongoing",
    color: "bg-yellow-100 text-yellow-800",
  },
  hhraApproved: {
    label: "Bids Approved for Negotiation",
    color: "bg-teal-100 text-teal-800",
  },
  hhraRejected: { label: "Bids Rejected", color: "bg-red-100 text-red-800" },
  negotiation: {
    label: "Active Bid Negotiation",
    color: "bg-indigo-100 text-indigo-800",
  },
  vendorAcknowledged: {
    label: "Winning Bid Approved",
    color: "bg-green-100 text-green-800",
  },
  procurementApproved: {
    label: "Approved by Procurement",
    color: "bg-green-100 text-green-800",
  },
  // ── PO approvals ──────────────────────────────────────────────────────────
  hofApproved: {
    label: "Approved by Finance",
    color: "bg-teal-100 text-teal-800",
  },
  hhrApproved: {
    label: "Approved by HHRA",
    color: "bg-teal-100 text-teal-800",
  },
  // ── RFQ / PO / generic ────────────────────────────────────────────────────
  issued: { label: "Issued", color: "bg-green-100 text-green-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const getStatus = (status: RequisitionStatus): StatusMap => {
  return statusMap[status] ?? { label: status, color: "bg-gray-100 text-gray-800" };
};

interface StatusBadgeProps {
  status: RequisitionStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, color } = getStatus(status);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        color,
        className,
      )}
    >
      {label}
    </span>
  );
}

