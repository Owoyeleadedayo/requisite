/* Superseded — role "storeManager" now routes to /sm. See src/app/(dashboard)/sm/page.tsx */
// import { redirect } from "next/navigation";
// export default function WMRoot() {
//   redirect("/wm/pos");
// }
import { redirect } from "next/navigation";
export default function WMRoot() {
  redirect("/sm");
}
