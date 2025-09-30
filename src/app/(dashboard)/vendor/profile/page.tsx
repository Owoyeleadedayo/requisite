import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import React from "react";

const ProfilePage = () => {
  return (
    <>
      <div className="flex flex-col py-4 px-4 md:px-6 gap-4">
        <p className="text-3xl text-[#0F1E7A] font-normal">PROFILE</p>
        <div className="grid grid-cols-[30%_60%] w-full gap-4">
          <div>
            <Image
              src="/avatar.png"
              alt=""
              width={120}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full gap-8 border">
            <div className="flex w-full items-center gap-4">
             <div className="w-[200px]">
             <Label
                htmlFor="nameOfCompany"
                className="text-md font-normal whitespace-nowrap"
              >
                Name of Company:
              </Label>
             </div>
              <Input
                type="text"
                id="nameOfCompany"
                name="nameOfCompany"
                className="bg-[#E8EDF2] border-1 w-[400px]"
              />
            </div>
            <div className="flex w-full items-center gap-4">
              <div className="w-[200px]">
              <Label
                htmlFor="nameOfCompany"
                className="text-md font-normal whitespace-nowrap"
              >
                Email Address:
              </Label>
              </div>
              <Input
                type="text"
                id="nameOfCompany"
                name="nameOfCompany"
                className="bg-[#E8EDF2] border-1 w-[400px]"
              />
            </div>
            <div className="flex w-full items-center gap-4">
             <div className="w-[200px] ">
             <Label
                htmlFor="nameOfCompany"
                className="text-md font-normal whitespace-nowrap"
              >
                Contact Person:
              </Label>
             </div>
              <Input
                type="text"
                id="nameOfCompany"
                name="nameOfCompany"
                className="bg-[#E8EDF2] border-1 w-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
