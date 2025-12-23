// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Edit, Eye, Folder, Plus, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { NumericFormat } from "react-number-format";
// import DashboardCard from "@/components/DashboardCard";
// import DataTable, { Column } from "@/components/DataTable";
// import { API_BASE_URL } from "@/lib/config";
// import { getToken, getUserId, getAuthData } from "@/lib/auth";
// import { RequisitionShape } from "@/types/requisition";
// import getLocationName from "@/lib/getLocationName";
// import LocationsFormDialog from "@/components/pm/LocationsFormDialog";
// import { locationService } from "@/services/locationService";
// import { Location } from "@/lib/getLocationName";
// import { toast } from "sonner";
// import { CONSTANTS } from "@/lib/constants";

// const PAGE_CAN_ROUTE_TO_NEW_REQUEST: string[] = [
//   "procurementDashboard",
//   "pmRequests",
//   "procurementBids",
// ];

// interface ProcurementManagerDashboardProps {
//   page?:
//     | "procurementDashboard"
//     | "procurementRequisitions"
//     | "pmRequests"
//     | "procurementBids"
//     | "locations"
//     | "rfqs";
// }

// const newLocation: Location = {
//   name: "",
//   address: "",
//   contactPerson: "",
//   phoneNumber: "",
//   email: "",
//   _id: "",
// };

// export default function PMDashboard({
//   page = "procurementDashboard",
// }: ProcurementManagerDashboardProps = {}) {
//   const [loading, setLoading] = useState(false);
//   const [isLocationLoading, setIsLocationLoading] = useState(false);
//   const [requisitions, setRequisitions] = useState<RequisitionShape[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   // const [locations, setLocations] = useState<{ _id: string; name: string }[]>(
//   //   []
//   // );
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [dashboardStats, setDashboardStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     bidding: 0,
//   });

//   const [currentLocation, setCurrentLocation] = useState<Location>(newLocation);
//   const loadingContext =
//     page === CONSTANTS.LOCATION.PAGE ? CONSTANTS.LOCATION.PAGE : "requisitions";
//   const itemsPerPage: number = 10;

//   const userId = getUserId();
//   const token = getToken();
//   const authdata = getAuthData();

//   const fetchLocations = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await locationService.fetchLocations();
//       if (data) {
//         setLocations(data);
//       }
//     } catch (error) {
//       console.error(
//         CONSTANTS.LOCATION.NOTIFICATION.FETCH_LOCATION_ERROR,
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const createLocation = async () => {
//     setIsLocationLoading(true);
//     try {
//       const data = await locationService.createLocation(currentLocation);
//       if (data) {
//         setLocations([...locations, data]);
//         toast.success(CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_SUCCESS);
//       } else {
//         throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_FAIL);
//       }
//     } catch (error) {
//       console.error(
//         CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_ERROR,
//         error
//       );
//       throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_ERROR);
//     } finally {
//       setIsLocationLoading(false);
//     }
//   };

//   const updateLocation = async () => {
//     setIsLocationLoading(true);
//     try {
//       const data = await locationService.updateLocation(currentLocation);
//       if (data) {
//         const updatedLocations: Location[] = locations.map((location) => {
//           if (location._id === data._id) {
//             return data;
//           }
//           return location;
//         });
//         setLocations(updatedLocations);
//         toast.success(CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_SUCCESS);
//       } else {
//         throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_FAIL);
//       }
//     } catch (error) {
//       console.error(
//         CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_ERROR,
//         error
//       );
//       throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_ERROR);
//     } finally {
//       setIsLocationLoading(false);
//     }
//   };

//   const deleteLocation = async (locationId: string) => {
//     setIsLocationLoading(true);
//     try {
//       const data = await locationService.deleteLocation(locationId);
//       if (data) {
//         setLocations(
//           locations.filter((location) => location._id !== locationId)
//         );
//         toast.success(
//           data.message ||
//             CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_SUCCESS
//         );
//       } else {
//         throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_FAIL);
//       }
//     } catch (error) {
//       console.error(
//         CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_ERROR,
//         error
//       );
//       throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_ERROR);
//     } finally {
//       setIsLocationLoading(false);
//     }
//   };

//   const columns: Column<RequisitionShape>[] = [
//     { key: "title", label: "Request Title" },
//     {
//       key: "items",
//       label: "No. of Items",
//       render: (value) => value.length,
//     },
//     {
//       key: "department",
//       label: "Department",
//       render: (value) => value.name,
//     },
//     {
//       key: "createdAt",
//       label: "Date Submitted",
//       render: (value) => {
//         const date = new Date(value);
//         const day = date.getDate().toString().padStart(2, "0");
//         const month = date.toLocaleString("default", { month: "long" });
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//       },
//     },
//     {
//       key: "requester",
//       label: page === "pmRequests" ? "Requisition Number" : "Staff",
//       render: (_, row) => {
//         if (page === "pmRequests") {
//           return row.requisitionNumber;
//         }
//         const currentUser = authdata?.user;
//         return currentUser?.id === row.requester._id
//           ? "You"
//           : `${row.requester.firstName} ${row.requester.lastName}`;
//       },
//     },
//     {
//       key: "deliveryLocation",
//       label: "Location",
//       render: (location) => getLocationName(location, locations),
//     },
//     {
//       key: "status",
//       label: "Status",
//       render: (value) => {
//         const statusColors: Record<string, string> = {
//           draft: "text-gray-500",
//           departmentApproved: "text-green-500",
//           procurementApproved: "text-blue-500",
//           cancelled: "text-red-500",
//           pending: "text-orange-500",
//           bidding: "text-purple-500",
//         };
//         return (
//           <span className={statusColors[value] ?? "text-gray-500"}>
//             {value}
//           </span>
//         );
//       },
//     },
//     {
//       key: "_id",
//       label: "Action",
//       render: (_, row) => (
//         <div className="flex gap-2 items-center">
//           <Button
//             asChild
//             className="bg-blue-900 hover:bg-blue-800 text-white px-4"
//           >
//             <Link href={`/pm/requisitions/${row._id}`}>View</Link>
//           </Button>
//           {/* <Button
//           asChild
//           className="bg-green-600 hover:bg-green-700 text-white px-4"
//         >
//           <Link href={`/procurement/bids/${row._id}`}>Manage Bids</Link>
//         </Button> */}
//         </div>
//       ),
//     },
//   ];

//   const locationsColumns: Column<Location>[] = [
//     { key: "name", label: "Name" },
//     { key: "address", label: "Address" },
//     { key: "contactPerson", label: "Contact Person" },
//     { key: "phoneNumber", label: "Phone Number" },
//     { key: "email", label: "Email" },
//     {
//       key: "_id",
//       label: "Action",
//       render: (_, row) => (
//         <div className="flex gap-2 items-center">
//           <LocationsFormDialog
//             handleLocationFormChange={handleLocationFormChange}
//             currentLocation={row}
//             mode="view"
//             isLocationLoading={isLocationLoading}
//           >
//             <Button variant="ghost" className="!px-2 !lg:px-1">
//               <Eye size={24} className="!text-[#0F1E7A]" />
//             </Button>
//           </LocationsFormDialog>
//           <LocationsFormDialog
//             handleLocationFormChange={handleLocationFormChange}
//             currentLocation={currentLocation}
//             submit={updateLocation}
//             mode="edit"
//             isLocationLoading={isLocationLoading}
//           >
//             <Button
//               variant="ghost"
//               className="!px-2 !lg:px-1"
//               onClick={() => {
//                 setCurrentLocation(row);
//               }}
//             >
//               <Edit size={24} className="!text-[#0F1E7A]" />
//             </Button>
//           </LocationsFormDialog>
//           <LocationsFormDialog
//             handleLocationFormChange={handleLocationFormChange}
//             currentLocation={row}
//             submit={deleteLocation}
//             mode="delete"
//             isLocationLoading={isLocationLoading}
//           >
//             <Button variant="ghost" className="!px-2 !lg:px-1">
//               <Trash2 size={24} className="!text-red-500" />
//             </Button>
//           </LocationsFormDialog>
//         </div>
//       ),
//     },
//   ];

//   const dashboardCardItems = [
//     {
//       key: 1,
//       imgSrc: "/vendor-application.svg",
//       title: "Vendor Application",
//       color: "#0F1E7A",
//       value: dashboardStats.total,
//     },
//     {
//       key: 2,
//       imgSrc: "/current-bids.svg",
//       title: "Bids Created",
//       color: "#0F1E7A",
//       value: dashboardStats.pending,
//     },
//     {
//       key: 3,
//       imgSrc: "/requisition-requests.svg",
//       title: "Requisitions Requests",
//       color: "#0F1E7A",
//       value: dashboardStats.approved,
//     },
//     {
//       key: 4,
//       imgSrc: "/pm-requests.svg",
//       title: "My Requests",
//       color: "#0F1E7A",
//       value: dashboardStats.bidding,
//     },
//   ];

//   const fetchRequisitions = useCallback(
//     async (pageNum: number = 1) => {
//       setLoading(true);

//       try {
//         const endpoint =
//           page === "procurementDashboard" || page === "procurementRequisitions"
//             ? `${API_BASE_URL}/requisitions?page=${pageNum}&limit=${itemsPerPage}`
//             : `${API_BASE_URL}/users/${userId}/requisitions?page=${pageNum}&limit=${itemsPerPage}`;

//         const response = await fetch(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const data = await response.json();

//         if (data.success) {
//           setRequisitions(data.data);

//           if (data.pagination) {
//             setCurrentPage(data.pagination.page);
//             setTotalPages(data.pagination.pages);
//             setTotalCount(data.pagination.total);
//           } else {
//             setCurrentPage(data.currentPage);
//             setTotalPages(data.totalPages);
//             setTotalCount(data.total);
//           }

//           const stats = {
//             total: data.pagination?.total || data.total,
//             pending: 0,
//             approved: 0,
//             bidding: 0,
//           };

//           data.data.forEach((req: RequisitionShape) => {
//             if (req.status === "departmentApproved") stats.pending++;
//             else if (req.status === "procurementApproved") stats.approved++;
//             else if (req.status === "bidding") stats.bidding++;
//           });

//           setDashboardStats(stats);
//         }
//       } catch (error) {
//         console.error("Error fetching requisitions:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [token, page, userId]
//   );

//   useEffect(() => {
//     if (token) {
//       fetchLocations();
//       if (page !== CONSTANTS.LOCATION.PAGE) {
//         fetchRequisitions(1);
//       }
//     }
//   }, [token, fetchRequisitions, fetchLocations, page]);

//   const handlePageChange = (page: number) => {
//     fetchRequisitions(page);
//   };

//   const handleLocationFormChange = (
//     field: keyof Location,
//     value: string | null
//   ) => {
//     setCurrentLocation((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="flex flex-col gap-4 p-6 lg:p-12 !pb-16">
//       {page === "procurementDashboard" && (
//         <div className="flex flex-col gap-4">
//           <p className="text-2xl text-[#0F1E7A] font-semibold font-normal">
//             Summary
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {dashboardCardItems.map((item) => (
//               <DashboardCard key={item.key}>
//                 <div className={`flex gap-7 items-center text-[${item.color}]`}>
//                   <Image
//                     src={item.imgSrc}
//                     alt={item.title}
//                     width={59}
//                     height={59}
//                   />

//                   <div className="flex flex-col gap-2 text-center justify-center items-center">
//                     <h2 className="text-2xl lg:text-[40px] font-bold">
//                       {item.value}
//                     </h2>

//                     <p className="text-sm font-semibold">{item.title}</p>
//                   </div>
//                 </div>
//               </DashboardCard>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center py-4">
//         <p className="w-full lg:w-1/2 text-md md:text-2xl text-[#0F1E7A] font-semibold leading-5">
//           {page === "procurementBids"
//             ? "Bid Management"
//             : page === "pmRequests"
//             ? "My Requests"
//             : page === CONSTANTS.LOCATION.PAGE
//             ? "List of Locations"
//             : "Requests"}
//         </p>

//         {PAGE_CAN_ROUTE_TO_NEW_REQUEST.includes(page) && (
//           <div className="w-full lg:w-1/2 flex justify-end items-center">
//             <Button
//               asChild
//               className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
//             >
//               <Link href="/pm/my-requests/create-new">
//                 <Plus size={22} />{" "}
//                 <span className="hidden lg:flex">New Request</span>
//               </Link>
//             </Button>
//           </div>
//         )}
//         <LocationsFormDialog
//           handleLocationFormChange={handleLocationFormChange}
//           currentLocation={currentLocation}
//           submit={createLocation}
//           mode="create"
//           isLocationLoading={isLocationLoading}
//         >
//           {/* Todo: use enums for the modes */}
//           {page === CONSTANTS.LOCATION.PAGE && (
//             <Button
//               asChild
//               className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
//               onClick={() => {
//                 setCurrentLocation(newLocation);
//               }}
//             >
//               <span>
//                 <Plus size={22} />{" "}
//                 <span className="hidden lg:flex">New Location</span>
//               </span>
//             </Button>
//           )}
//         </LocationsFormDialog>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A]"></div>
//           <span className="ml-2 text-gray-600">
//             Loading {loadingContext}...
//           </span>
//         </div>
//       ) : !locations.length && page === CONSTANTS.LOCATION.PAGE ? (
//         <div className="w-full h-full flex items-center justify-center">
//           <div className="flex flex-col items-center mt-20 lg:mt-0">
//             <Folder size={80} />
//             <p className="text-center max-w-sm">
//               Your item list is empty. Click the button below to create an item.
//             </p>
//             <div>
//               <LocationsFormDialog
//                 handleLocationFormChange={handleLocationFormChange}
//                 currentLocation={currentLocation}
//                 submit={createLocation}
//                 mode="create"
//                 isLocationLoading={isLocationLoading}
//               >
//                 <Button
//                   asChild
//                   className="flex flex-row border border-[#0F1E7A] mt-5 cursor-pointer bg-white text-[#0F1E7A] hover:bg-gray-100"
//                   onClick={() => {
//                     setCurrentLocation(newLocation);
//                   }}
//                 >
//                   <span>
//                     <Plus /> Add New Location
//                   </span>
//                 </Button>
//               </LocationsFormDialog>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <DataTable
//           columns={
//             page === CONSTANTS.LOCATION.PAGE ? locationsColumns : columns
//           }
//           data={page === CONSTANTS.LOCATION.PAGE ? locations : requisitions}
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Eye, Folder, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumericFormat } from "react-number-format";
import DashboardCard from "@/components/DashboardCard";
import DataTable, { Column } from "@/components/DataTable";
import { API_BASE_URL } from "@/lib/config";
import { getToken, getUserId, getAuthData } from "@/lib/auth";
import { RequisitionShape } from "@/types/requisition";
import getLocationName from "@/lib/getLocationName";
import LocationsFormDialog from "@/components/pm/LocationsFormDialog";
import { locationService } from "@/services/locationService";
import { Location } from "@/lib/getLocationName";
import { toast } from "sonner";
import { CONSTANTS } from "@/lib/constants";

const PAGE_CAN_ROUTE_TO_NEW_REQUEST: string[] = [
  "procurementDashboard",
  "pmRequests",
  "procurementBids",
];

interface ProcurementManagerDashboardProps {
  page?:
    | "procurementDashboard"
    | "procurementRequisitions"
    | "pmRequests"
    | "procurementBids"
    | "locations"
    | "rfqs";
}

interface RFQShape {
  _id: string;
  title: string;
  deliveryLocation: string;
  createdAt: string;
  vendor: {
    _id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  requester: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  status: string;
}

const newLocation: Location = {
  name: "",
  address: "",
  contactPerson: "",
  phoneNumber: "",
  email: "",
  _id: "",
};

export default function PMDashboard({
  page = "procurementDashboard",
}: ProcurementManagerDashboardProps = {}) {
  const [loading, setLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [requisitions, setRequisitions] = useState<RequisitionShape[]>([]);
  const [rfqs, setRfqs] = useState<RFQShape[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    bidding: 0,
  });

  const [currentLocation, setCurrentLocation] = useState<Location>(newLocation);
  const loadingContext =
    page === CONSTANTS.LOCATION.PAGE
      ? CONSTANTS.LOCATION.PAGE
      : page === "rfqs"
      ? "RFQs"
      : "requisitions";
  const itemsPerPage: number = 10;

  const userId = getUserId();
  const token = getToken();
  const authdata = getAuthData();

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await locationService.fetchLocations();
      if (data) {
        setLocations(data);
      }
    } catch (error) {
      console.error(
        CONSTANTS.LOCATION.NOTIFICATION.FETCH_LOCATION_ERROR,
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createLocation = async () => {
    setIsLocationLoading(true);
    try {
      const data = await locationService.createLocation(currentLocation);
      if (data) {
        setLocations([...locations, data]);
        toast.success(CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_SUCCESS);
      } else {
        throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_FAIL);
      }
    } catch (error) {
      console.error(
        CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_ERROR,
        error
      );
      throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.CREATE_LOCATION_ERROR);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const updateLocation = async () => {
    setIsLocationLoading(true);
    try {
      const data = await locationService.updateLocation(currentLocation);
      if (data) {
        const updatedLocations: Location[] = locations.map((location) => {
          if (location._id === data._id) {
            return data;
          }
          return location;
        });
        setLocations(updatedLocations);
        toast.success(CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_SUCCESS);
      } else {
        throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_FAIL);
      }
    } catch (error) {
      console.error(
        CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_ERROR,
        error
      );
      throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.UPDATE_LOCATION_ERROR);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const deleteLocation = async (locationId: string) => {
    setIsLocationLoading(true);
    try {
      const data = await locationService.deleteLocation(locationId);
      if (data) {
        setLocations(
          locations.filter((location) => location._id !== locationId)
        );
        toast.success(
          data.message ||
            CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_SUCCESS
        );
      } else {
        throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_FAIL);
      }
    } catch (error) {
      console.error(
        CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_ERROR,
        error
      );
      throw toast.error(CONSTANTS.LOCATION.NOTIFICATION.DELETE_LOCATION_ERROR);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const columns: Column<RequisitionShape>[] = [
    { key: "title", label: "Request Title" },
    {
      key: "items",
      label: "No. of Items",
      render: (value) => value.length,
    },
    {
      key: "department",
      label: "Department",
      render: (value) => value.name,
    },
    {
      key: "createdAt",
      label: "Date Submitted",
      render: (value) => {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      key: "requester",
      label: page === "pmRequests" ? "Requisition Number" : "Staff",
      render: (_, row) => {
        if (page === "pmRequests") {
          return row.requisitionNumber;
        }
        const currentUser = authdata?.user;
        return currentUser?.id === row.requester._id
          ? "You"
          : `${row.requester.firstName} ${row.requester.lastName}`;
      },
    },
    {
      key: "deliveryLocation",
      label: "Location",
      render: (location) => getLocationName(location, locations),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const statusColors: Record<string, string> = {
          draft: "text-gray-500",
          departmentApproved: "text-green-500",
          procurementApproved: "text-blue-500",
          cancelled: "text-red-500",
          pending: "text-orange-500",
          bidding: "text-purple-500",
        };
        return (
          <span className={statusColors[value] ?? "text-gray-500"}>
            {value}
          </span>
        );
      },
    },
    {
      key: "_id",
      label: "Action",
      render: (_, row) => (
        <div className="flex gap-2 items-center">
          <Button
            asChild
            className="bg-blue-900 hover:bg-blue-800 text-white px-4"
          >
            <Link href={`/pm/requisitions/${row._id}`}>View</Link>
          </Button>
        </div>
      ),
    },
  ];

  const rfqColumns: Column<RFQShape>[] = [
    { key: "title", label: "RFQ Title" },
    {
      key: "deliveryLocation",
      label: "Location",
      render: (location) => getLocationName(location, locations),
    },
    {
      key: "createdAt",
      label: "Date Submitted",
      render: (value) => {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      },
    },
    {
      key: "vendor",
      label: "Vendor",
      render: (vendor) =>
        vendor.companyName || `${vendor.firstName} ${vendor.lastName}`,
    },
    {
      key: "requester",
      label: "Staff",
      render: (requester) => {
        const currentUser = authdata?.user;
        return currentUser?.id === requester._id
          ? "You"
          : `${requester.firstName} ${requester.lastName}`;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const statusColors: Record<string, string> = {
          draft: "text-gray-500",
          pending: "text-orange-500",
          submitted: "text-blue-500",
          approved: "text-green-500",
          rejected: "text-red-500",
          cancelled: "text-red-500",
        };
        return (
          <span className={statusColors[value] ?? "text-gray-500"}>
            {value}
          </span>
        );
      },
    },
    {
      key: "_id",
      label: "Action",
      render: (_, row) => (
        <div className="flex gap-2 items-center">
          <Button
            asChild
            className="bg-blue-900 hover:bg-blue-800 text-white px-4"
          >
            <Link href={`/pm/rfqs/${row._id}`}>View</Link>
          </Button>
        </div>
      ),
    },
  ];

  const locationsColumns: Column<Location>[] = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "email", label: "Email" },
    {
      key: "_id",
      label: "Action",
      render: (_, row) => (
        <div className="flex gap-2 items-center">
          <LocationsFormDialog
            handleLocationFormChange={handleLocationFormChange}
            currentLocation={row}
            mode="view"
            isLocationLoading={isLocationLoading}
          >
            <Button variant="ghost" className="!px-2 !lg:px-1">
              <Eye size={24} className="!text-[#0F1E7A]" />
            </Button>
          </LocationsFormDialog>
          <LocationsFormDialog
            handleLocationFormChange={handleLocationFormChange}
            currentLocation={currentLocation}
            submit={updateLocation}
            mode="edit"
            isLocationLoading={isLocationLoading}
          >
            <Button
              variant="ghost"
              className="!px-2 !lg:px-1"
              onClick={() => {
                setCurrentLocation(row);
              }}
            >
              <Edit size={24} className="!text-[#0F1E7A]" />
            </Button>
          </LocationsFormDialog>
          <LocationsFormDialog
            handleLocationFormChange={handleLocationFormChange}
            currentLocation={row}
            submit={deleteLocation}
            mode="delete"
            isLocationLoading={isLocationLoading}
          >
            <Button variant="ghost" className="!px-2 !lg:px-1">
              <Trash2 size={24} className="!text-red-500" />
            </Button>
          </LocationsFormDialog>
        </div>
      ),
    },
  ];

  const dashboardCardItems = [
    {
      key: 1,
      imgSrc: "/vendor-application.svg",
      title: "Vendor Application",
      color: "#0F1E7A",
      value: dashboardStats.total,
    },
    {
      key: 2,
      imgSrc: "/current-bids.svg",
      title: "Bids Created",
      color: "#0F1E7A",
      value: dashboardStats.pending,
    },
    {
      key: 3,
      imgSrc: "/requisition-requests.svg",
      title: "Requisitions Requests",
      color: "#0F1E7A",
      value: dashboardStats.approved,
    },
    {
      key: 4,
      imgSrc: "/pm-requests.svg",
      title: "My Requests",
      color: "#0F1E7A",
      value: dashboardStats.bidding,
    },
  ];

  const fetchRequisitions = useCallback(
    async (pageNum: number = 1) => {
      setLoading(true);

      try {
        const endpoint =
          page === "procurementDashboard" || page === "procurementRequisitions"
            ? `${API_BASE_URL}/requisitions?page=${pageNum}&limit=${itemsPerPage}`
            : `${API_BASE_URL}/users/${userId}/requisitions?page=${pageNum}&limit=${itemsPerPage}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success) {
          setRequisitions(data.data);

          if (data.pagination) {
            setCurrentPage(data.pagination.page);
            setTotalPages(data.pagination.pages);
            setTotalCount(data.pagination.total);
          } else {
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setTotalCount(data.total);
          }

          const stats = {
            total: data.pagination?.total || data.total,
            pending: 0,
            approved: 0,
            bidding: 0,
          };

          data.data.forEach((req: RequisitionShape) => {
            if (req.status === "departmentApproved") stats.pending++;
            else if (req.status === "procurementApproved") stats.approved++;
            else if (req.status === "bidding") stats.bidding++;
          });

          setDashboardStats(stats);
        }
      } catch (error) {
        console.error("Error fetching requisitions:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, page, userId]
  );

  const fetchRFQs = useCallback(
    async (pageNum: number = 1) => {
      setLoading(true);

      try {
        const endpoint = `${API_BASE_URL}/rfqs?page=${pageNum}&limit=${itemsPerPage}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success) {
          setRfqs(data.data);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
          setTotalCount(data.total);
        }
      } catch (error) {
        console.error("Error fetching RFQs:", error);
        toast.error("Failed to fetch RFQs");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchLocations();
      if (page === "rfqs") {
        fetchRFQs(1);
      } else if (page !== CONSTANTS.LOCATION.PAGE) {
        fetchRequisitions(1);
      }
    }
  }, [token, fetchRequisitions, fetchRFQs, fetchLocations, page]);

  const handlePageChange = (pageNum: number) => {
    if (page === "rfqs") {
      fetchRFQs(pageNum);
    } else {
      fetchRequisitions(pageNum);
    }
  };

  const handleLocationFormChange = (
    field: keyof Location,
    value: string | null
  ) => {
    setCurrentLocation((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 p-6 lg:p-12 !pb-16">
      {page === "procurementDashboard" && (
        <div className="flex flex-col gap-4">
          <p className="text-2xl text-[#0F1E7A] font-semibold font-normal">
            Summary
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardCardItems.map((item) => (
              <DashboardCard key={item.key}>
                <div className={`flex gap-7 items-center text-[${item.color}]`}>
                  <Image
                    src={item.imgSrc}
                    alt={item.title}
                    width={59}
                    height={59}
                  />

                  <div className="flex flex-col gap-2 text-center justify-center items-center">
                    <h2 className="text-2xl lg:text-[40px] font-bold">
                      {item.value}
                    </h2>

                    <p className="text-sm font-semibold">{item.title}</p>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center py-4">
        <p className="w-full lg:w-1/2 text-md md:text-2xl text-[#0F1E7A] font-semibold leading-5">
          {page === "procurementBids"
            ? "Bid Management"
            : page === "pmRequests"
            ? "My Requests"
            : page === CONSTANTS.LOCATION.PAGE
            ? "List of Locations"
            : page === "rfqs"
            ? "Generated RFQs"
            : "Requests"}
        </p>

        {PAGE_CAN_ROUTE_TO_NEW_REQUEST.includes(page) && (
          <div className="w-full lg:w-1/2 flex justify-end items-center">
            <Button
              asChild
              className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
            >
              <Link href="/pm/my-requests/create-new">
                <Plus size={22} />{" "}
                <span className="hidden lg:flex">New Request</span>
              </Link>
            </Button>
          </div>
        )}
        <LocationsFormDialog
          handleLocationFormChange={handleLocationFormChange}
          currentLocation={currentLocation}
          submit={createLocation}
          mode="create"
          isLocationLoading={isLocationLoading}
        >
          {page === CONSTANTS.LOCATION.PAGE && (
            <Button
              asChild
              className="px-4 md:px-6 py-4 bg-[#0F1E7A] text-base md:text-md text-white cursor-pointer"
              onClick={() => {
                setCurrentLocation(newLocation);
              }}
            >
              <span>
                <Plus size={22} />{" "}
                <span className="hidden lg:flex">New Location</span>
              </span>
            </Button>
          )}
        </LocationsFormDialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1E7A]"></div>
          <span className="ml-2 text-gray-600">
            Loading {loadingContext}...
          </span>
        </div>
      ) : !locations.length && page === CONSTANTS.LOCATION.PAGE ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center mt-20 lg:mt-0">
            <Folder size={80} />
            <p className="text-center max-w-sm">
              Your item list is empty. Click the button below to create an item.
            </p>
            <div>
              <LocationsFormDialog
                handleLocationFormChange={handleLocationFormChange}
                currentLocation={currentLocation}
                submit={createLocation}
                mode="create"
                isLocationLoading={isLocationLoading}
              >
                <Button
                  asChild
                  className="flex flex-row border border-[#0F1E7A] mt-5 cursor-pointer bg-white text-[#0F1E7A] hover:bg-gray-100"
                  onClick={() => {
                    setCurrentLocation(newLocation);
                  }}
                >
                  <span>
                    <Plus /> Add New Location
                  </span>
                </Button>
              </LocationsFormDialog>
            </div>
          </div>
        </div>
      ) : (
        <DataTable
          columns={
            page === CONSTANTS.LOCATION.PAGE
              ? locationsColumns
              : page === "rfqs"
              ? rfqColumns
              : columns
          }
          data={
            page === CONSTANTS.LOCATION.PAGE
              ? locations
              : page === "rfqs"
              ? rfqs
              : requisitions
          }
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
}
