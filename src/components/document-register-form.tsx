'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CalendarIcon,
  FileText,
  Info,
  ClipboardList,
  Building2,
  UploadCloud,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import useUploadDocument from '@/hooks/use-upload-document'
import {
  formatLocalDate,
  parseLocalDate,
  validateDueDate,
} from '@/utils/validate-due-date'
import { Route } from '@/routes/__root'
import useUploadDraft from '@/hooks/use-upload-draft'

export interface DocumentFormState {
  tracking_no: string
  title: string
  instructions: string
  category: string
  originating_office: string
  request_type: string
  due_date: any
  file: File | null
}

export default function DocumentRegistrationForm() {
  const mutation = useUploadDocument()
  const uploadDraft = useUploadDraft()
  const { authentication } = Route.useRouteContext()
  const isUserRecords =
    authentication.userRole() === 'records' ||
    authentication.userRole() === 'admin'

  const [formData, setFormData] = useState<DocumentFormState>({
    tracking_no: !isUserRecords ? `DRAFT-${Math.random().toString(10)}` : '',
    title: '',
    instructions: '',
    category: '',
    originating_office: '',
    request_type: '',
    due_date: null,
    file: null,
  })
  const [fileError, setFileError] = useState('')
  const [dueDateError, setDueDateError] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFileError('')
    setDueDateError('')
    mutation.reset()
    uploadDraft.reset()

    const file = formData.file
    const due_date = formData.due_date
      ? formatLocalDate(formData.due_date)
      : null

    if (!file) return setFileError('Please upload a file.')

    if (due_date && !validateDueDate(due_date)) {
      return setDueDateError('Due date cannot be in the past.')
    }

    if (file) {
      if (file.type !== 'application/pdf') {
        return setFileError('Please upload a PDF file.')
      } else if (file.size > 10 * 1024 * 1024) {
        return setFileError('File size must be less than 10MB.')
      }
    }

    const payload = {
      ...formData,
      due_date: due_date,
    }

    if (!isUserRecords) {
      uploadDraft.mutate(payload)
    } else {
      mutation.mutate(payload)
    }
  }

  const errorResponse =
    mutation.error?.response?.data || uploadDraft.error?.response?.data

  return (
    <Card className="max-w-3xl mx-auto border border-muted shadow-sm">
      {/* Header */}
      <CardHeader className="space-y-2 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary-blue" />
          Upload Document
        </CardTitle>
        <CardDescription className="text-sm">
          Register and route official documents for processing and tracking.
        </CardDescription>

        {errorResponse && (
          <p className="text-sm text-destructive">{errorResponse.message}</p>
        )}
        {dueDateError && (
          <p className="text-sm text-destructive">{dueDateError}</p>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Document Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ClipboardList className="h-4 w-4 text-primary-blue" />
              Document Information
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="tracking_no">Tracking Number</FieldLabel>
                <Input
                  id="tracking_no"
                  placeholder={!isUserRecords ? 'DRAFT-' : 'DOC-2023-0001'}
                  required
                  onChange={handleInputChange}
                  disabled={!isUserRecords}
                />
              </Field>

              <Field>
                <FieldLabel>Due Date (optional)</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.due_date && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary-blue" />
                      {formData.due_date
                        ? formData.due_date.toDateString()
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.due_date ?? undefined}
                      onSelect={(date) => {
                        setFormData((prev) => ({
                          ...prev,
                          due_date: date ?? null,
                        }))
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Brief document title"
                required
                onChange={handleInputChange}
              />
            </Field>
          </section>

          {/* Section: Instructions */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Info className="h-4 w-4 text-primary-blue" />
              Additional Notes
            </div>

            <Field>
              <FieldLabel htmlFor="instructions">
                Instructions (optional)
              </FieldLabel>
              <FieldDescription>
                Provide routing notes or special handling instructions.
              </FieldDescription>
              <Textarea
                id="instructions"
                placeholder="Detailed instructions..."
                rows={3}
                onChange={handleInputChange}
              />
            </Field>
          </section>

          {/* Section: Classification */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary-blue" />
              Classification & Routing
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="memorandum">Memorandum</SelectItem>
                    <SelectItem value="unnumbered_memorandum">
                      Unnumbered Memorandum
                    </SelectItem>
                    <SelectItem value="advisory">Advisory</SelectItem>
                    <SelectItem value="endorsement">Endorsement</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Request Type</FieldLabel>
                <Select
                  required
                  value={formData.request_type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      request_type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_signature">For Signature</SelectItem>
                    <SelectItem value="for_approval">For Approval</SelectItem>
                    <SelectItem value="for_acknowledgement">
                      For Acknowledgement
                    </SelectItem>
                    <SelectItem value="for_review">For Review</SelectItem>
                    <SelectItem value="for_response">For Response</SelectItem>
                    <SelectItem value="for_issuance">For Issuance</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="originating_office">
                Originating Office
              </FieldLabel>
              <Input
                id="originating_office"
                placeholder="e.g. HR, Accounting, Curriculum"
                required
                onChange={handleInputChange}
              />
            </Field>
          </section>

          {/* Section: File Upload */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UploadCloud className="h-4 w-4 text-primary-blue" />
              Document File
            </div>

            <Field>
              <FieldLabel htmlFor="file">Attach Document</FieldLabel>
              <FieldDescription>
                Upload the official document (PDF only, max 10MB).
              </FieldDescription>

              {fileError && (
                <p className="text-sm text-destructive">{fileError}</p>
              )}

              <Input
                id="file"
                type="file"
                accept=".pdf"
                required
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    file: e.target.files ? e.target.files[0] : null,
                  }))
                }
              />
            </Field>
          </section>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending || uploadDraft.isPending}
          >
            {mutation.isPending ? 'Uploading...' : 'Upload Document'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
