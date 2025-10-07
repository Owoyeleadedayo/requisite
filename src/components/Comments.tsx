import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { Ellipsis, Send } from "lucide-react";

export default function Comments() {
  return (
    <div className="flex flex-col py-5  h-[600px] border border-[#E5E5E5] rounded-md">
      <div className="flex items-center px-4 gap-2">
        <Image
          src="/avatar.png"
          alt=""
          width={36}
          height={36}
          className="rounded-full"
        />
        <Textarea
          placeholder="Start a conversation"
          className="h-[10px] border border-[#9F9F9F]"
        />
      </div>
      <div className="border-b-1 border-[#4F7396] py-3" />
      <div className="flex justify-between items-center px-4 mt-4">
        <div className="flex gap-3">
          <div>
            <Image
              src="/avatar.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-md font-semibold">Benson John</p>
                <p className="text-sm font-light">27 Mins ago</p>
              </div>
              <Ellipsis className="cursor-pointer" />
            </div>

            <p className="max-w-lg text-sm font-normal">
              A better understanding of usage can aid in prioritizing future
              efforts, be clear on the laptop requirements and also adjust the
              price
            </p>
            <p className="text-sm font-normal text-[#0F1E7A] cursor-pointer">
              Reply
            </p>

            {/* Nested reply */}
            <div className="">
              <div className="flex justify-between items-center  mt-4">
                <div className="flex gap-3">
                  <div>
                    <Image
                      src="/avatar.png"
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-md font-semibold">Benson John</p>
                        <p className="text-sm font-light">27 Mins ago</p>
                      </div>
                      <Ellipsis className="cursor-pointer" />
                    </div>
                    <p className="max-w-lg text-sm font-normal">
                      Totally agree with you! Clearer specs will really help.
                    </p>
                    <p className="text-sm font-normal text-[#0F1E7A] cursor-pointer">
                      Reply
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* End nested reply */}
            <div className="">
              <div className="flex justify-between items-center  mt-4">
                <div className="flex gap-3">
                  <div>
                    <Image
                      src="/avatar.png"
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-md font-semibold">Benson John</p>
                        <p className="text-sm font-light">27 Mins ago</p>
                      </div>
                      <Ellipsis className="cursor-pointer" />
                    </div>
                    <p className="max-w-lg text-sm font-normal">
                      Totally agree with you! Clearer specs will really help.
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-normal text-[#0F1E7A] cursor-pointer">
                        Reply
                      </p>
                      <div className="relative items-center">
                        <Textarea />
                        <div className="absolute translate-y-5 top-0 right-2 cursor-pointer">
                          <Send color="#9F9F9F" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
