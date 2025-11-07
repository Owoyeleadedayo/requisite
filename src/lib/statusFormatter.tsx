import React from "react";

export function formatStatus(status: string): React.ReactNode {
  const statusColors: Record<string, string> = {
    draft: "text-gray-500",
    submitted: "text-blue-500",
    departmentApproved: "text-green-500",
    cancelled: "text-red-500",
    pending: "text-orange-500",
  };

  return (
    <span className={`${statusColors[status] ?? "text-gray-500"} capitalize`}>
      {status}
    </span>
  );
}
