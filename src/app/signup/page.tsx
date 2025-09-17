"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const page = () => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="flex flex-col w-screen h-screen bg-[url('/back.png')] bg-[#e7e8f1]/80 bg-center bg-cover bg-blend-soft-light ">
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
        <div className="flex w-[700px] h-[700px] p-4 m-auto bg-white rounded-lg">
          <div className="flex flex-col items-center w-full gap-6 ">
            <p className="text-xl text-red-500 font-medium py-4">Sign Up</p>
            <div className="grid grid-cols-2 w-full px-3 gap-6">
              <div className="flex flex-col gap-6">
                <div className="grid w-full gap-1">
                  <Label htmlFor="name-of-company"> Name of Company</Label>
                  <Input
                    type="text"
                    id="name-of-company"
                    placeholder=" Name of Company"
                    className="border"
                  />
                </div>
                <div className="grid w-full gap-1">
                  <Label htmlFor="name-of-company">
                    Name of Contact Person
                  </Label>
                  <Input
                    type="text"
                    id="name-of-contact-person"
                    placeholder="Name of Contact Person"
                    className="border"
                  />
                </div>
                <div className="grid w-full gap-1">
                  <Label htmlFor="name-of-company">Address</Label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="border"
                  />
                </div>
                <div className="grid w-full gap-1">
                  <Label htmlFor="name-of-company">Date of Incorporation</Label>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Address"
                    className="border"
                  />
                </div>
                <div className="grid w-full gap-1">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    type="text"
                    id="designation"
                    placeholder="Designation"
                    className="border"
                  />
                </div>
                <div className="grid w-full max-w-md items-center">
                  <Label htmlFor="attachment" className="text-md font-normal">
                    Attachment
                  </Label>
                  <label
                    htmlFor="attachment"
                    className="cursor-pointer border rounded-md px-4 py-2 text-xs text-gray-500 hover:bg-gray-100"
                  >
                    {fileName || "PDF, JPEG, or PNG"}
                  </label>
                  <div className="relative">
                    <Input
                      type="file"
                      id="attachment"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      onChange={(e) =>
                        setFileName(e.target.files?.[0]?.name || "")
                      }
                    />
                    <Upload
                      size={18}
                      color="gray"
                      className="absolute top-[-28px] right-5"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
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
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    type="number"
                    id="phone-number"
                    placeholder="Phone Number"
                    className="border"
                  />
                </div>
                <div className="grid w-full gap-1">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    type="text"
                    id="website"
                    placeholder="Website URL"
                    className="border"
                  />
                </div>
                <div className="grid w-full gap-1">
                  <Label>
                    Business Category
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-100 w-full border-1">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
            </div>
            <div className="mt-2">
              <Button className="flex bg-[#0F1E7A] px-[100px] py-3 text-white text-base font-medium">
              Register
              </Button>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-md text-[#7E848B]">Already have an account? <span className="text-[#0F1E7A] cursor-pointer">Log In</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
