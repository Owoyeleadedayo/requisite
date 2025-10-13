"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function VendorLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [showPassword, setShowPassword] = useState(false);
  const [showApprovalPending, setShowApprovalPending] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/vendor-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const htmlText = await res.text();
        const errorMatch = htmlText.match(/Error: ([^<]+)/);
        data = { message: errorMatch ? errorMatch[1] : "An error occurred" };
      }

      if (!res.ok) {
        if (data.message && data.message.includes("pending approval")) {
          setShowApprovalPending(true);
          setTimeRemaining(5);
        } else {
          toast.error(data.message || "Login failed");
        }
        return;
      }

      // Store auth data and redirect
      localStorage.setItem(
        "authData",
        JSON.stringify({
          token: data.token,
          user: data.user,
        })
      );

      toast.success("Login successful!");
      router.push("/vendor"); // Redirect to vendor dashboard
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showApprovalPending) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setShowApprovalPending(false);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showApprovalPending]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[url('/back.png')] bg-[#e7e8f1]/80 bg-center bg-cover bg-blend-soft-light">
      <div className="flex flex-row items-center px-4 sm:px-6 py-3 sm:py-4 gap-2 sm:gap-3">
        <Image
          src="/daystar_logo.png"
          alt="daystar-logo"
          width={40}
          height={30}
          className="object-contain w-8 h-6 sm:w-10 sm:h-8"
        />
        <p className="text-xl sm:text-2xl lg:text-3xl text-[#0F1E7A] font-bold">
          requisite
        </p>
      </div>

      <div className="flex-1 w-full flex justify-center items-center p-4 sm:p-6">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          {showApprovalPending ? (
            <div className="approval-in-progress text-center py-8 animate-in fade-in duration-500 relative overflow-hidden">
              {/* <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                <div
                  className="status-observer bg-orange-500 h-1 transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - timeRemaining) / 5) * 100}%` }}
                ></div>
              </div> */}
              <h2 className="text-2xl lg:text-[32px] font-semibold text-[var(--primary-color)] mb-2 mt-4">
                Approval in Progress
              </h2>
              <p className="text-base font-light text-[var(--primary-color)] mb-4">
                Final decision in progress
              </p>
              <div className="flex justify-center items-center mt-5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F1E7A]"></div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleLogin}
              className="animate-in fade-in duration-500"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Login</h1>
                {/* <p className="text-gray-600">Sign in to your vendor account</p> */}
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 border border-[#121212] rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 border border-[#121212] rounded-lg p-3 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A1A6B] text-white py-4 rounded-lg hover:bg-[#0C248A]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-[var(--primary-color)] hover:underline cursor-pointer">
                  Forgot password?
                </p>
                <p className="text-sm text-gray-500">
                  New to Rwquisite Software?{" "}
                  <Link
                    href="/signup"
                    className="text-[#0A1A6B] hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
