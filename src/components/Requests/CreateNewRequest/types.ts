export type ItemType = "product" | "service" | "";

export interface Item {
  id: number; // for local tracking
  itemName: string;
  itemType: ItemType;
  preferredBrand: string;
  itemDescription: string;
  uploadImage: File | null;
  units: number | "";
  UOM: string;
  recommendedVendor: string;
  isWorkTool: boolean | string;
}

export interface Vendor {
  _id: string;
  name: string;
}
