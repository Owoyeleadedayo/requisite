// Store Manager PO detail — reuses the shared PurchaseOrderDetails component.
// The component detects the storeManager role via authData.user.role === "storeManager"
// and surfaces the Generate GRN button when the PO is approved.
import PurchaseOrderDetails from "@/components/pm/PurchaseOrderDetails";

export default function SMViewPO() {
  return <PurchaseOrderDetails />;
}
