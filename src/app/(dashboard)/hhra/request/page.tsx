import ClosedBids from "@/components/hhra/ClosedBids";
import HistoryTable from "@/components/hhra/HistoryTable";
import AcceptedRequest from "@/components/hod/AcceptedRequest";
import DeniedRequest from "@/components/hod/DeniedRequest";
import HODTable from "@/components/hod/HODTable";
import NewRequest from "@/components/hod/NewRequest";
import ViewRequest from "@/components/hod/ViewRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const view = searchParams.view;

  if (view === "new") {
    return <ClosedBids />;
  }

  return (
    <div className="flex flex-col py-4 px-4 md:px-6 gap-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="relative w-[100%]">
          <Input
            type="text"
            placeholder="Search Item"
            className="bg-[#FFFFFF] pl-4 pr-4 py-2 w-full h-12 rounded-md shadow-md"
          />
          <Search
            color="black"
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
        <Button className="h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer capitalize">
          advanced search
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-2xl text-[#0F1E7A] font-medium ">
            Request History
          </p>
        </div>
        <HistoryTable />
      </div>
    </div>
  );
}
