import { Suspense } from "react";
import NotificationsPage from "@/components/NotificationsPage";
import SuspenseFallback from "@/components/SuspenseFallback";

export default function UserNotifications() {
  return (
    <Suspense
      fallback={<SuspenseFallback message="Loading notifications..." />}
    >
      <NotificationsPage />
    </Suspense>
  );
}
