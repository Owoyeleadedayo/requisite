import {apiClient} from "@/lib/apiClient";
import {CONSTANTS} from "@/lib/constants";
import {RequisitionHandleComment, HandledRequisition, HandledRequisitionItem} from "@/types/requisition";

export const requisitionService = {
    approveBulkRequisitionItems: (requisitionId: string, body: RequisitionHandleComment): Promise<HandledRequisitionItem> => {
        return apiClient.put<HandledRequisitionItem>(CONSTANTS.REQUISITION.API.APPROVE_BULK_REQUISITION_ITEMS(requisitionId), body);
    },
    rejectBulkRequisitionItems: (requisitionId: string, body: RequisitionHandleComment): Promise<HandledRequisitionItem> => {
        return apiClient.put<HandledRequisitionItem>(CONSTANTS.REQUISITION.API.REJECT_BULK_REQUISITION_ITEMS(requisitionId), body);
    },
    approveRequisitionItem: (requisitionId: string, itemId: string, body: RequisitionHandleComment): Promise<HandledRequisitionItem>  => {
        return apiClient.put<HandledRequisitionItem>(CONSTANTS.REQUISITION.API.APPROVE_REQUISITION_ITEM(requisitionId, itemId), body)
    },
    rejectRequisitionItem: (requisitionId: string, itemId: string, body: RequisitionHandleComment): Promise<HandledRequisitionItem> => {
        return apiClient.put<HandledRequisitionItem>(CONSTANTS.REQUISITION.API.REJECT_REQUISITION_ITEM(requisitionId, itemId), body)
    },
    rejectRequisition: (requisitionId: string, body: RequisitionHandleComment): Promise<HandledRequisition>    => {
        return apiClient.put<HandledRequisition>(CONSTANTS.REQUISITION.API.REJECT_REQUISITION(requisitionId), body)
    }
}
