export const DocumentStatusMap = {
    // Document
    DOC_PENDING: 1,
    DOC_ARCHIVED: 2,
    DOC_COMPLETED: 3,
    DOC_DELAYED: 4,
    DOC_RELEASED: 5,

    // Assignment
    DOC_ASSIGN_PENDING: 6,
    DOC_ASSIGN_COMPLETED: 7,
    DOC_ASSIGN_DELAYED: 8,

    // Tracking
    DOC_TRACK_ROUTED: 9,
    DOC_TRACK_COMPLETED: 10,
    DOC_TRACK_RETURNED: 11,

    // Draft
    DOC_DRAFT_PENDING: 12,
    DOC_DRAFT_IN_REVIEW: 13,
    DOC_DRAFT_APPROVED: 14,

    // SDS & Records
    DOC_REJECTED: 15,
    DOC_RETURNED: 16,
}

export type DocumentStatusMap = typeof DocumentStatusMap
export type DocumentStatusKey = keyof typeof DocumentStatusMap
export type DocumentStatusValue = DocumentStatusMap[DocumentStatusKey]
