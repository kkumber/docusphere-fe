export interface Document {
    id: number
    tracking_no: string
    title: string
    instructions: string
    category: string
    originating_office: string
    request_type: string
    uploaded_by?: number
    status_id?: number
    due_date: string
    created_at?: string
    updated_at?: string
}


export interface DocumentFile {
    id: number
    document_id: number
    file_name: string
    public_id: string
    mime_type: string
    file_size: number
    uploaded_by: number
    is_primary: boolean
    created_at?: string
    updated_at?: string
}