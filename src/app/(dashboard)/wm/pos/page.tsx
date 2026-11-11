/* Superseded — role "storeManager" now routes to /sm. See src/app/(dashboard)/sm/pos/page.tsx */
// "use client";
// import PMDashboard from "@/components/pm/PMDashboard";
// export const dynamic = "force-dynamic";
// export default function WMPOsPage() {
//   return <PMDashboard page="pos" />;
// }
import { redirect } from "next/navigation";
export default function WMPOsPage() {
  redirect("/sm/pos");
}
