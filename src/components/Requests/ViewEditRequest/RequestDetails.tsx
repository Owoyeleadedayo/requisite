import { Button } from "@/components/ui/button";
import { RequestData } from "./types";
import { NumericFormat } from "react-number-format";

interface RequestDetailsProps {
  formData: RequestData;
}

export default function RequestDetails({ formData }: RequestDetailsProps) {
  return (
    <div className="flex flex-col gap-2 py-6">
      <div className="flex flex-col gap-3 px-4">
        <div className="flex justify-between items-start gap-4 text-start">
          <div className="flex flex-col w-2/3">
            <p className="text-base text-[#0F1E7A] font-semibold">Title</p>
            <p className="text-base text-[#0F1E7A] font-light">
              {formData.title}
            </p>
          </div>
          <div className="flex flex-col text-end w-1/3">
            <p className="text-base text-[#DE1216] font-semibold">Deadline</p>
            <p className="text-base text-[#DE1216] font-light">
              26th of June, 2025
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-base text-[#0F1E7A] font-semibold">
            Item Description
          </p>
          <p className="text-base text-[#0F1E7A] font-light">
            {formData.description}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-base text-[#0F1E7A] font-semibold">Department</p>
          <p className="text-base text-[#0F1E7A] font-light">
            {formData?.department?.name}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-base text-[#0F1E7A] font-semibold">Quantity</p>
          <p className="text-base text-[#0F1E7A] font-light">
            {formData.quantityNeeded} Units
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-base text-[#0F1E7A] font-semibold">Unit Cost</p>
          <p className="text-base text-[#0F1E7A] font-light">
            {
              <NumericFormat
                prefix="₦ "
                decimalScale={2}
                fixedDecimalScale
                displayType="text"
                thousandSeparator=","
                value={formData.estimatedUnitPrice}
              />
            }
          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-base text-[#0F1E7A] font-semibold">Comments</p>
          <p className="text-base text-[#0F1E7A] font-light">
            {formData.justification}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 px-auto lg:px-32 mt-8">
          <Button className="bg-[#0F1E7A] hover:bg-[#0b154b] text-white flex-1 py-6">
            Publish Request
          </Button>

          <Button className="bg-red-500 hover:bg-red-700 text-white flex-1 py-6">
            Close Request
          </Button>
        </div>
      </div>
    </div>
  );
}
