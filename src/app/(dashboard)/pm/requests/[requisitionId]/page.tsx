"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ViewEditRequest from "@/components/Requests/ViewEditRequest/ViewEditRequest";

export default function HODViewEditRequest() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { requisitionId } = params;

  const [isEditMode, setIsEditMode] = useState(
    searchParams.get("mode") === "edit"
  );

  return (
    <ViewEditRequest
      requisitionId={requisitionId as string}
      userType="procurementManager"
      isEditMode={isEditMode}
      onEditModeChange={setIsEditMode}
    />
  );
}
