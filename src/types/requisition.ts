import {Item, RequestData} from "@/components/Requests/types";

export type Location = {
  _id: string;
  name: string;
};

export type ItemShape = {
  _id: string;
  itemName: string;
  itemType: string;
  preferredBrand?: string;
  itemDescription: string;
  units: number | null;
  UOM?: string;
  isWorkTool: boolean;
  status: string;
  selectedVendorsForItem?: string[];
  createdAt: string;
  updatedAt: string;
};

export type ApprovalShape = {
  stage: string;
  approver: string;
  status: string;
  timestamp: string;
  _id: string;
  comments?: string;
};

export type RequisitionShape = {
  _id: string;
  title: string;
  urgency: string;
  justification: string;
  deliveryLocation: string | { _id: string; name: string };
  deliveryDate: string;
  items: ItemShape[];
  requester: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  department:
    | string
    | {
        _id: string;
        name: string;
      };
  status: string;
  selectedVendors: string[];
  paymentStatus: string;
  paymentAmount: number;
  shortlistedVendors: string[];
  deadlineExtensions: string[];
  approvals: ApprovalShape[];
  requisitionNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type RequisitionHandleComment = {
    itemIds?: string[];
    comments: string;
}

export type HandledRequisitionItem = {
    message: string;
    success: boolean;
    data: {
        item: Item;
        requisition: RequestData;
    }
}

export type HandledRequisition = {
    message: string;
    success: boolean;
    data: RequestData
}
