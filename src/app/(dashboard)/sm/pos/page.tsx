"use client";

// Store Manager POs list — reuses PM's PO dashboard view
import PMDashboard from "@/components/pm/PMDashboard";

export const dynamic = "force-dynamic";

export default function SMPOsPage() {
  return <PMDashboard page="pos" routePrefix="/sm" />;
}
