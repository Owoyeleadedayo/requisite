"use client";

import { useParams } from "next/navigation";
import ViewEditVendor from "@/components/Vendor/ViewEditVendor/ViewEditVendor";

export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = params.id as string;

  return <ViewEditVendor vendorId={vendorId} />;
}
