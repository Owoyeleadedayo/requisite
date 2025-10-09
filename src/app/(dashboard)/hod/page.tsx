// import CardContent from "@/components/CardContent";
// import HODTable from "@/components/hod/HODTable";
// import TableContent from "@/components/TableContent";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Plus, Search } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// const Page = () => {
//   return (
//     <>
//       <div className="flex flex-col py-4 px-4 md:px-6 gap-4">
//         <div className="flex flex-col gap-4">
//           <p className="text-3xl text-[#0F1E7A] font-normal">Summary</p>
//           <CardContent />
//         </div>
//         <div className="flex flex-col md:flex-row gap-4 md:gap-6">
//           <div className="relative w-[100%]">
//             <Input
//               type="text"
//               placeholder="Search Item"
//               className="bg-[#FFFFFF] pl-4 pr-4 py-2 w-full h-12 rounded-md shadow-md"
//             />
//             <Search
//               color="black"
//               className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
//             />
//           </div>
//           <Button className="h-12 px-6 py-4 bg-[#0F1E7A] text-md text-white cursor-pointer capitalize">
//             advanced search
//           </Button>
//         </div>
//         <div className="flex flex-col gap-4">
//           <div className="flex justify-between items-center">
//             <p className="text-2xl text-[#0F1E7A] font-medium ">
//               Request Summary
//             </p>
//             <Link href="/hod/requisitions?view=new">
//               <Button className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer">
//                 <Plus size={22} /> New Request
//               </Button>
//             </Link>
//           </div>
//           <HODTable />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;

import HODDashboard from "@/components/HODDashboard";

export default function HODPage() {
  return <HODDashboard />;
}
