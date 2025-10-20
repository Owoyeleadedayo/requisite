"use client";

import NotificationsPage from "@/components/NotificationsPage";
import { Suspense } from "react";

export default function PMNotifications() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationsPage />
    </Suspense>
  );
}
