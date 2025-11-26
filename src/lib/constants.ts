
export const CONSTANTS = {
    // Requisitions
    REQUISITION: {
        API: {
            APPROVE_BULK_REQUISITION_ITEMS: (requisitionId: string) => `/requisitions/${requisitionId}/items/bulk-approve`,
            REJECT_BULK_REQUISITION_ITEMS: (requisitionId: string) => `/requisitions/${requisitionId}/items/bulk-reject`,
            APPROVE_REQUISITION_ITEM: (requisitionId: string, itemId: string) => `/requisitions/${requisitionId}/items/${itemId}/approve`,
            REJECT_REQUISITION_ITEM: (requisitionId: string, itemId: string) => `/requisitions/${requisitionId}/items/${itemId}/reject`,
            REJECT_REQUISITION: (requisitionId: string) => `/requisitions/${requisitionId}/department-rejection`,
        },
        COMMENT: {
            ITEM_APPROVAL: "Approved for requisition",
            ITEM_REJECTION: "Rejected for requisition",
            REJECTION: "Rejected for procurement",
        },
        NOTIFICATION: {
            PROVIDE_APPROVAL_COMMENT_WARN: 'Please provide a reason for approval',
            APPROVE_REQUISITION_ITEM_SUCCESS: 'Requisition item approved successfully',
            APPROVE_REQUISITION_ITEM_ERROR: 'Error approving requisition item',
            APPROVE_REQUISITION_ITEM_FAIL: 'Failed to approve requisition item',
            PROVIDE_REJECTION_COMMENT_WARN: 'Please provide a reason for rejection',
            REJECT_REQUISITION_ITEM_SUCCESS: 'Requisition item rejected successfully',
            REJECT_REQUISITION_ITEM_ERROR: 'Error rejecting requisition item',
            REJECT_REQUISITION_ITEM_FAIL: 'Failed to reject requisition item',
            REJECT_REQUISITION_SUCCESS: 'Requisition rejected successfully',
            REJECT_REQUISITION_ERROR: 'Error rejecting requisition',
            REJECT_REQUISITION_FAIL: 'Failed to reject requisition',
        }
    }
} as const;
