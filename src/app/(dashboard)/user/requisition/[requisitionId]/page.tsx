import { Suspense } from "react";
import SuspenseFallback from "@/components/SuspenseFallback";
import RequisitionsPage from "./RequisitionPage";

export default function Page() {
  return (
    <Suspense fallback={<SuspenseFallback message="Loading Requisitions..." />}>
      <RequisitionsPage />
    </Suspense>
  );
}
