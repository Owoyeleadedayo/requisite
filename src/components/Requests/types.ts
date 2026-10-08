export type UserTypes =
  | "user"
  | "hod"
  | "hof"
  | "hhra"
  | "procurementManager"
  | "vendor";

export type ItemType = "product" | "service" | "";

export interface Item {
  _id: string; // for local tracking
  itemName: string;
  itemType: ItemType;
  preferredBrand: string;
  itemDescription: string;
  uploadImage: File | null;
  units: number | "";
  status?: string;
  uploadedImageUrl?: string; // Which is for image url?
  imageUrl?: string; // Which is for image url?
  UOM: string;
  recommendedVendor: string;
  isWorkTool: boolean | string;
  workToolSubcategory?: string[];
}

export const WORK_TOOL_SUBCATEGORIES = [
  "Laptop Accessories",
  "Phone Accessories",
  "Office Equipment",
  "Security Accessories",
] as const;

export type WorkToolSubcategory = typeof WORK_TOOL_SUBCATEGORIES[number];

export const validateWorkToolItemCategories = (
  items: Pick<Item, "itemType" | "isWorkTool" | "workToolSubcategory">[],
): string | undefined => {
  const categories = new Set<string>();
  for (const item of items) {
    const isWorkTool =
      item.itemType !== "service" &&
      (item.isWorkTool === true || item.isWorkTool === "true");
    if (!isWorkTool) continue;

    const selection = item.workToolSubcategory ?? [];
    if (
      selection.length !== 1 ||
      !WORK_TOOL_SUBCATEGORIES.includes(selection[0] as WorkToolSubcategory)
    ) {
      return "Select exactly one valid category for every work tool item";
    }
    categories.add(selection[0]);
  }

  if (categories.size > 1) {
    return "All work tool items in one requisition must use the same category";
  }
  return undefined;
};

export interface RequestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  quantityNeeded: number;
  estimatedUnitPrice: number;
  justification: string;
  requisitionNumber: string;
  deliveryLocation: string;
  image: string;
  priority: "low" | "medium" | "high";
  attachment?: string;
  requester?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Item[];
  department?: {
    _id: string;
    name: string;
    code: string;
  };
  status?: string;
  selectedVendors?: string[];
  paymentStatus?: string;
  paymentAmount?: number;
  approvals?: {
    stage: string;
    approver: string | { _id?: string; firstName?: string; lastName?: string; email?: string; name?: string };
    approverName?: string;
    approverRole?: string;
    status: string;
    timestamp: string;
    approvedAt?: string;
    comments?: string;
    _id: string;
  }[];
  shortlistedVendors?: string[];
  deadlineExtensions?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Vendor {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories?: { _id: string; name: string }[];
  isVerified?: boolean;
  isActive?: boolean;
  status?: string;
  // documents?: File[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  cacDocument?: { uploadedAt: string };
  // missing from response
  website?: string;
  dateOfIncorporation?: string;
  contactPersonDesignation?: string;
}

export interface ViewEditRequestProps {
  requisitionId: string;
  userType: UserTypes;
  isEditMode: boolean;
  onEditModeChange: (mode: boolean) => void;
}

export interface RequestActionsProps {
  isEditMode: boolean;
  loading: boolean;
  userType: UserTypes;
  formData: RequestData;
  user: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: {
      _id: string;
      name: string;
    };
    designation: string;
    isActive: boolean;
  } | null;
  backPath: string;
  onEditModeChange: (mode: boolean) => void;
  onSave: () => void;
  showApprovalModal: boolean;
  setShowApprovalModal: (show: boolean) => void;
  approvalComment: string;
  setApprovalComment: (comment: string) => void;
  onApproval: () => void;
  showDenialModal: boolean;
  setShowDenialModal: (show: boolean) => void;
  denialReason: string;
  setDenialReason: (reason: string) => void;
  onDenial: () => void;
  approvalLoading: boolean;
  showCancelModal: boolean;
  setShowCancelModal: (show: boolean) => void;
  cancelReason: string;
  setCancelReason: (reason: string) => void;
  onCancel: () => void;
}
