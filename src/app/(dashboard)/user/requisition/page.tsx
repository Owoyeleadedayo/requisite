import { Suspense } from "react";
import RequisitionsPage from "./requisitionPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading requisitions...</div>}>
      <RequisitionsPage />
    </Suspense>
  );
}
