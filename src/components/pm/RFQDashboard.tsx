"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/config";
import DataTable, { Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PMDashboard from "./PMDashboard";

interface RFQ {
  _id: string;
  title: string;
  requisition: string;
  vendor: string;
  status: string;
  createdAt: string;
}

export default function RFQDashboard() {
  return <PMDashboard page="rfqs" />;
}