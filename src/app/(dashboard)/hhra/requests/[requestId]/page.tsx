// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import { data, type Item } from "@/data/mock/tableData";

// const RequestDetailPage = ({ params }: { params: { requestId: string } }) => {
//   const router = useRouter();
//   const requestId = parseInt(params.requestId);
//   const item = data.find(item => item.id === requestId);

//   if (!item) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
//         <h1 className="text-2xl font-semibold text-gray-600 mb-4">Request Not Found</h1>
//         <Button onClick={() => router.back()} className="bg-[#0F1E7A] hover:bg-blue-800">
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Go Back
//         </Button>
//       </div>
//     );
//   }

//   const statusColors: Record<string, string> = {
//     Complete: "text-green-500 bg-green-50 border-green-200",
//     Active: "text-yellow-600 bg-yellow-50 border-yellow-200",
//     Rejected: "text-red-500 bg-red-50 border-red-200",
//     Closed: "text-gray-500 bg-gray-50 border-gray-200",
//   };

//   return (
//     <div className="flex flex-col px-4 md:px-8 gap-6 pb-16">
//       <div className="flex items-center gap-4 mt-8">
//         <Button
//           variant="outline"
//           onClick={() => router.back()}
//           className="flex items-center gap-2"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </Button>
//         <h1 className="text-2xl font-semibold text-[#0F1E7A]">
//           Request Details - #{item.id}
//         </h1>
//       </div>

//       <div className="bg-white rounded-lg border shadow-sm p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Item Description</label>
//               <p className="text-lg font-semibold text-gray-900">{item.description}</p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-600">Quantity</label>
//                 <p className="text-lg text-gray-900">{item.qty}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-600">UOM</label>
//                 <p className="text-lg text-gray-900">{item.uom}</p>
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">Category</label>
//               <p className="text-lg text-gray-900">{item.category}</p>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">Price</label>
//               <p className="text-lg font-semibold text-gray-900">₦{item.price}</p>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-600">Request Date</label>
//               <p className="text-lg text-gray-900">{item.date}</p>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">Deadline</label>
//               <p className="text-lg text-gray-900">{item.deadline}</p>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-600">Status</label>
//               <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusColors[item.status] ?? "text-gray-500 bg-gray-50 border-gray-200"}`}>
//                 {item.status}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 pt-6 border-t">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
//           <div className="bg-gray-50 rounded-lg p-4">
//             <p className="text-gray-600">
//               This request was submitted on {item.date} with a deadline of {item.deadline}.
//               The current status is <span className="font-medium">{item.status}</span>.
//             </p>
//           </div>
//         </div>

//         <div className="mt-6 flex gap-3">
//           <Button className="bg-[#0F1E7A] hover:bg-blue-800">
//             Edit Request
//           </Button>
//           <Button variant="outline">
//             Download PDF
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RequestDetailPage;

"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, AtSign, AlarmClock } from "lucide-react";
import { data, type Item } from "@/data/mock/tableData";

const RequestDetailPage = ({ params }: { params: { requestId: string } }) => {
  const [replyText, setReplyText] = useState("");
  const requestId = parseInt(params.requestId);
  const item = data.find(item => item.id === requestId);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <h1 className="text-2xl font-semibold text-gray-600 mb-4">Request Not Found</h1>
        <Button onClick={() => window.history.back()} className="bg-[#0F1E7A] hover:bg-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  // Mock bids data
  const bids = [
    { vendor: "HP Nigeria", price: "100,000", status: null },
    { vendor: "Dell Nigeria", price: "100,000", status: null },
    { vendor: "Lenovo", price: "100,000", status: "Shortlisted" },
    { vendor: "HP Nigeria", price: "100,000", status: null },
    { vendor: "HP Nigeria", price: "100,000", status: null },
    { vendor: "HP Nigeria", price: "100,000", status: null },
  ];

  // Mock comments data
  const comments = [
    {
      name: "Procurement Manager",
      time: "27 minutes ago",
      avatar: "",
      emails: ["daramola@daystar.org", "Nkemjika@daystar.org"]
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Request Details */}
          <div className="bg-white rounded-xl shadow-sm p-o lg:p-8">
            {/* Status Badge */}
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-start mb-4">
              <div className="flex flex-row lg:flex-col items-start gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`dot w-2 h-2 rounded-full ${item.status === 'Complete' ? 'bg-green-400' :
                    item.status === 'Active' ? 'bg-yellow-400' :
                      item.status === 'Rejected' ? 'bg-red-400' :
                        'bg-gray-400'
                    }`}></div>
                  <span className="text-gray-600">{item.status} Request</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-[#0F1E7A] flex items-center justify-center">
                    <AlarmClock className="text-white" size={16} />
                  </div>
                  <span className={`font-medium status ${
                    item.status === 'Complete' ? 'text-green-500' :
                    item.status === 'Active' ? 'text-yellow-500' :
                    item.status === 'Rejected' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>Status: {item.status}</span>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300">IT Dept</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300">General</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center">
              <h1 className="text-3xl font-bold text-[#0F1E7A] mb-6">View Request</h1>


            </div>

            {/* Product Image */}
            <div className="bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl relative">
                {/* Simplified computer tower illustration */}
                {/* <div className="absolute inset-4 border-4 border-cyan-400 rounded-2xl opacity-30"></div> */}
              </div>

              <Image src="/request-image.png" alt="Request image" width={593} height={406} />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 justify-start lg:justify-between items-start lg:items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#0F1E7A] mb-1">{item.description}</h2>
                  <p className="text-gray-600">{item.category} Equipment</p>
                </div>

                <div className="flex flex-col justify-between items-start lg:items-end text-red-500 ">
                  <span className="text-base font-semibold">Deadline</span>
                  <span className="text-sm font-medium">{item.deadline}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Item Description</h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-1">Quantity</h3>
                <p className="text-gray-600">{item.qty} {item.uom}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-1">Unit cost</h3>
                <p className="text-gray-900 font-semibold">₦{item.price}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-1">Request Date</h3>
                <p className="text-gray-600">{item.date}</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Additional Information</h3>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                </p>
              </div>

              <div className="flex">
                <Button className="w-full lg:w-1/2 mx-auto bg-red-500 hover:bg-red-600 text-white py-6 rounded-lg text-lg font-semibold mt-6">
                  Close
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Bids and Comments */}
          <div className="space-y-6">
            {/* Bids Section */}
            <div className="rounded-xl shadow-sm p-8">
              <h2 className="text-3xl font-bold text-[#0F1E7A] mb-6">Bids</h2>

              <div className="space-y-1">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-200">
                  <div className="font-semibold text-gray-900">Vendor</div>
                  <div className="font-semibold text-gray-900 text-right">Price</div>
                  <div className="font-semibold text-gray-900 text-right">Action</div>
                </div>

                {/* Bid Rows */}
                {bids.map((bid, index) => (
                  <div key={index} className="bg-white grid grid-cols-3 gap-4 py-4 border-b border-gray-100 items-center">
                    <div className="text-gray-700">{bid.vendor}</div>
                    <div className="text-right">
                      <span className="text-gray-900">{bid.price}</span>
                      {bid.status && (
                        <span className="ml-2 text-gray-500 text-sm">{bid.status}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <Button className="bg-[#0F1E7A] hover:bg-blue-800 text-white px-6 py-1 text-sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0F1E7A]">Comments</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6 text-red-500" />
                </button>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[#0F1E7A] text-sm md:text-base">Procurement Manager</h3>
                      <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                        <AtSign className="w-4 h-4 md:w-5 md:h-5 text-[#0F1E7A] bg-gray-400 rounded-full" />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">27 minutes ago</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-300 break-all">
                        daramola@daystar.org
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-300 break-all">
                        Nkemjika@daystar.org
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Reply</h3>
                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Don't Accept Lenovo"
                    className="w-full border-2 border-gray-300 rounded-lg p-3 md:p-4 pr-16 md:pr-20 min-h-[100px] focus:outline-none focus:border-[#0F1E7A] resize-none text-sm md:text-base"
                  />
                  <Button className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-[#0F1E7A] hover:bg-blue-800 text-white px-4 md:px-6 text-sm">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
