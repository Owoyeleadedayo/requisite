import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function InpageSearch() {
    return (
        <div className="w-full lg:w-[848px] flex flex-col md:flex-row gap-2 md:gap-6 mt-20 mb-11">
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

            <Button className="h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer">
                Advanced search
            </Button>
        </div>
    );
}