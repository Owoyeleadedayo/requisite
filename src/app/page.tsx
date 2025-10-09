"use client";

import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { useEffect, useState, Suspense } from "react";
import VendorLogin from "@/components/VendorLogin";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [showVendorLogin, setShowVendorLogin] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      const userId = searchParams.get("userId");
      const bypass = searchParams.get("bypass");

      if (!userId || !bypass) {
        setShowVendorLogin(true);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, bypass }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("authData", JSON.stringify(data.data));
          toast.success(data.message);

          const role = data.data.user.role;
          switch (role) {
            case "staff":
              router.push("/user");
              break;
            case "departmentHead":
              router.push("/hod");
              break;
            case "procurementManager":
              router.push("/pm");
              break;
            case "hhra":
              router.push("/hhra");
              break;
            default:
              setShowVendorLogin(true);
              setLoading(false);
          }
        } else {
          console.error("Authentication failed:", data);
          toast.error("Error authenticating");
          setShowVendorLogin(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Error authenticating");
        setShowVendorLogin(true);
        setLoading(false);
      }
    };

    authenticateUser();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F1E7A]"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    );
  }

  if (showVendorLogin) {
    return <VendorLogin />;
  }

  return null;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F1E7A]"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>}>
      <HomeContent />
    </Suspense>
  );
}
