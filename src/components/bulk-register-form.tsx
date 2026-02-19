import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  Users,
} from 'lucide-react'
import Papa from 'papaparse'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Alert, AlertDescription } from './ui/alert'
import { useUserContext } from '@/context/user-context'
import { toast } from 'sonner'
import useBulkRegister from '@/hooks/use-bulk-register'

export type CSVUser = {
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
  office: string
  department: string | null
  designation: string
  rowNumber: number
  errors: string[]
}

type ValidationError = {
  row: number
  field: string
  message: string
}

export function BulkUploadForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const { user } = useUserContext()
  const isSuperAdmin = user?.email === import.meta.env.VITE_SUPER_ADMIN
  const bulkRegister = useBulkRegister()

  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<CSVUser[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  )
  const [isValid, setIsValid] = useState(false)

  const allowedRoles = isSuperAdmin
    ? ['admin', 'records', 'sds', 'chief', 'staff']
    : ['records', 'sds', 'chief', 'staff']

  const validateRow = (row: any, rowNumber: number): string[] => {
    const errors: string[] = []

    // Required fields
    if (!row.first_name?.trim()) errors.push('First name is required')
    if (!row.last_name?.trim()) errors.push('Last name is required')
    if (!row.email?.trim()) errors.push('Email is required')
    if (!row.password?.trim()) errors.push('Password is required')
    if (!row.role?.trim()) errors.push('Role is required')
    if (!row.office?.trim()) errors.push('Office is required')

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (row.email && !emailRegex.test(row.email)) {
      errors.push('Invalid email format')
    }

    // Role validation
    if (row.role && !allowedRoles.includes(row.role.toLowerCase())) {
      errors.push(`Invalid role. Allowed: ${allowedRoles.join(', ')}`)
    }

    // Password length
    if (row.password && row.password.length < 8) {
      errors.push('Password must be at least 8 characters')
    }

    return errors
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setFile(selectedFile)

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const users: CSVUser[] = []
        const errors: ValidationError[] = []

        results.data.forEach((row: any, index: number) => {
          const rowNumber = index + 2 // +2 because index starts at 0 and row 1 is header
          const rowErrors = validateRow(row, rowNumber) // validate row

          users.push({
            first_name: row.first_name?.trim() || '',
            last_name: row.last_name?.trim() || '',
            role: row.role?.trim().toLowerCase() || '',
            office: row.office?.trim() || '',
            email: row.email?.trim() || '',
            password: row.password?.trim() || '',
            rowNumber,
            errors: rowErrors,
          })

          if (rowErrors.length > 0) {
            rowErrors.forEach((error) => {
              errors.push({
                row: rowNumber,
                field: error,
                message: error,
              })
            })
          }
        })

        setParsedData(users)
        setValidationErrors(errors)
        setIsValid(errors.length === 0 && users.length > 0)
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`)
      },
    })
  }

  const handleReset = () => {
    setFile(null)
    setParsedData([])
    setValidationErrors([])
    setIsValid(false)
    // Reset file input
    const fileInput = document.getElementById('csv-file') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleDownloadTemplate = () => {
    const template = `first_name,last_name,office,role,email,password
Juan,Dela Cruz,Division Office,staff,juan.delacruz@deped.gov.ph,Password123
Maria,Santos,Records Office,records,maria.santos@deped.gov.ph,Password123`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_upload_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid) {
      toast.error('Please fix validation errors before submitting')
      return
    }

    bulkRegister.reset()
    await bulkRegister.mutate({ users: parsedData })
  }

  const showActions = parsedData.length > 0

  return (
    <Card
      {...props}
      className="max-w-5xl mx-auto border border-muted shadow-sm"
    >
      {/* Header */}
      <CardHeader className="space-y-2 border-b">
        <div className="flex flex-wrap max-md:gap-4 items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary-blue" />
              Bulk User Upload
            </CardTitle>
            <CardDescription className="max-w-xl">
              Upload a CSV file to register multiple users at once. Download the
              template to get started.
            </CardDescription>
          </div>

          {showActions && (
            <TooltipProvider>
              <div className="flex items-center gap-2">
                {/* Reset */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleReset}
                      aria-label="Reset Upload"
                      disabled={bulkRegister.isPending}
                    >
                      <RotateCcw className="h-4 w-4 text-primary-blue" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset Upload</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {bulkRegister.isError && (
          <p className="text-destructive">
            Error: {bulkRegister.error.response?.data.message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4 text-primary-blue" />
              CSV File Upload
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={bulkRegister.isPending}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadTemplate}
                className="shrink-0"
                disabled={bulkRegister.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            {file && (
              <p className="text-sm text-muted-foreground">
                Selected file: <span className="font-medium">{file.name}</span>
              </p>
            )}

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2">
              <p className="text-sm font-semibold text-blue-900">Tips:</p>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>
                  <span className="font-medium">Allowed roles:</span> admin,
                  records, sds, chief, staff
                </li>
                <li>
                  <span className="font-medium">Headers:</span> Must match
                  exactly (case-sensitive) but can be in any order
                </li>
              </ul>
            </div>
          </section>

          {/* Validation Status */}
          {parsedData.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Upload className="h-4 w-4 text-primary-blue" />
                Validation Results
              </div>

              {isValid ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    All {parsedData.length} users validated successfully. Ready
                    to upload.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Found {validationErrors.length} validation error(s) in your
                    CSV file. Please fix them before uploading.
                  </AlertDescription>
                </Alert>
              )}
            </section>
          )}

          {/* Data Preview */}
          {parsedData.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="h-4 w-4 text-primary-blue" />
                Preview ({parsedData.length} users)
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-muted">
                      <TableRow>
                        <TableHead className="w-12">Row</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Office</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-20">Password</TableHead>
                        <TableHead className="w-20">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((user, index) => (
                        <TableRow
                          key={index}
                          className={user.errors.length > 0 ? 'bg-red-50' : ''}
                        >
                          <TableCell className="font-medium">
                            {user.rowNumber}
                          </TableCell>
                          <TableCell>{user.first_name || '-'}</TableCell>
                          <TableCell>{user.last_name || '-'}</TableCell>
                          <TableCell>{user.role || '-'}</TableCell>
                          <TableCell>{user.office || '-'}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>{user.password || '-'}</TableCell>
                          <TableCell>
                            {user.errors.length > 0 ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <ul className="text-xs space-y-1">
                                      {user.errors.map((error, i) => (
                                        <li key={i}>• {error}</li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </section>
          )}

          {/* Submit */}
          {parsedData.length > 0 && (
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || bulkRegister.isPending}
            >
              {bulkRegister.isPending
                ? 'Uploading...'
                : isValid
                  ? `Upload ${parsedData.length} Users`
                  : 'Fix Errors to Continue'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
