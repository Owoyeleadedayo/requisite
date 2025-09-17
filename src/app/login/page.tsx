import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <>
      <div className="flex flex-col w-screen h-screen bg-[url('/back.png')] bg-[#e7e8f1]/80 bg-center bg-cover bg-blend-soft-light gap-3">
        <div className="flex flex-row items-center px-6 py-4 gap-3">
          <Image
            src="/daystar_logo.png"
            alt="daystar-logo"
            width={40}
            height={30}
            className="object-contain"
          />
          <p className="text-3xl text-[#0F1E7A] font-bold">requisite</p>
        </div>
        <div className="flex w-[400px] h-[350px] justify-center p-4 m-auto bg-white rounded-lg">
          <div className="flex flex-col items-center w-full gap-2">
            <p className="text-xl text-red-500 font-medium pt-2 pb-4">Login</p>
            <div className="flex w-full flex-col gap-4">
              <div className="grid w-full gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="border"
                />
              </div>
              <div className="grid w-full gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="border"
                />
              </div>
            </div>
            <div className="mt-5">
            <Button className="flex bg-[#0F1E7A] px-[100px] py-3 text-white text-base font-medium">Login</Button>
            </div>
            <div className="flex flex-col items-center mt-6">
                <p className="text-md text-[#7E848B]">Forgot password?</p>
                <p className="text-md text-[#7E848B]">New to Requisite Software? <span className="text-[#0F1E7A] cursor-pointer">Sign Up</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
