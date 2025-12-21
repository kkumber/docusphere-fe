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
import { CalendarIcon, FileText } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface DocumentFormState {
  tracking_no: string
  title: string
  instructions: string
  category: string
  originating_office: string
  request_type: string
  due_date: Date | null
  file: File | null
}

export default function DocumentRegistrationForm() {
  const [formData, setFormData] = useState<DocumentFormState>({
    tracking_no: '',
    title: '',
    instructions: '',
    category: '',
    originating_office: '',
    request_type: '',
    due_date: null,
    file: null,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.due_date || !formData.file) return

    console.log(formData)
  }

  return (
    <Card className="max-w-3xl mx-auto shadow-xl border-muted">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5" /> Document Registration
        </CardTitle>
        <CardDescription>
          All fields are required. Please ensure details are accurate.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tracking No + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="tracking_no">Tracking Number</FieldLabel>
              <Input
                id="tracking_no"
                placeholder="DOC-2025-001"
                required
                onChange={handleInputChange}
              />
            </Field>

            <Field>
              <FieldLabel>Due Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.due_date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date
                      ? formData.due_date.toDateString()
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.due_date ?? undefined}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        due_date: date ?? null,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </div>

          {/* Title */}
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              placeholder="Brief document title"
              required
              onChange={handleInputChange}
            />
          </Field>

          {/* Instructions */}
          <Field>
            <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
            <FieldDescription>
              Include any special instructions or notes for routing.
            </FieldDescription>
            <Textarea
              id="instructions"
              placeholder="Detailed instructions..."
              rows={3}
              required
              onChange={handleInputChange}
            />
          </Field>

          {/* Category + Request Type */}
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
                  setFormData((prev) => ({ ...prev, request_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="for_signature">For Signature</SelectItem>
                  <SelectItem value="for_approval">For Approval</SelectItem>
                  <SelectItem value="for_information">
                    For Information
                  </SelectItem>
                  <SelectItem value="for_endorsement">
                    For Endorsement
                  </SelectItem>
                  <SelectItem value="for_response">For Response</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Originating Office */}
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

          {/* File Upload */}
          <Field>
            <FieldLabel htmlFor="file">Attach Document</FieldLabel>
            <FieldDescription>
              Upload the official document file (PDF, DOCX).
            </FieldDescription>
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

          {/* Submit */}
          <Button type="submit" className="w-full">
            Register Document
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
