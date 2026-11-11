"use client";

// Store Manager — own requisitions list
import PMDashboard from "@/components/pm/PMDashboard";

export const dynamic = "force-dynamic";

export default function SMMyRequestsPage() {
  return <PMDashboard page="pmRequests" routePrefix="/sm" />;
}
