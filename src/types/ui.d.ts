export interface Breadcrumbs {
    title: string;
    href: string;
}

export interface ColumnValuesForFilterStatus {
  value: string | number
  label: string
  group?: 'document' | 'assignment' | 'draft'
}

export interface FilterSearchInput {
  placeholder: string
  column: string
}



export type DocumentStatusMap = Record<number, { label: string, color: string }>

