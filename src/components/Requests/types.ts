export type UserTypes =
  | "user"
  | "hod"
  | "hhra"
  | "procurementManager"
  | "vendor";

export type ItemType = "product" | "service" | "";

export interface Item {
  id: number; // for local tracking
  itemName: string;
  itemType: ItemType;
  preferredBrand: string;
  itemDescription: string;
  uploadImage: File | null;
  units: number | "";
  status?: string;
  uploadedImageUrl?: string;
  imageUrl?: string;
  UOM: string;
  recommendedVendor: string;
  isWorkTool: boolean | string;
}

export interface RequestData {
  _id: string;
  title: string;
  description: string;
  category: string;
  quantityNeeded: number;
  estimatedUnitPrice: number;
  justification: string;
  requisitionNumber: string;
  image: string;
  priority: "low" | "medium" | "high";
  attachment?: string;
  requester?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
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
    approver: string;
    status: string;
    timestamp: string;
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
