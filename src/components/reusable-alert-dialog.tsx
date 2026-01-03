import * as React from 'react'
import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ReusableAlertDialogProps {
  /** Content for the alert dialog */
  title: string
  description?: string
  /** Label for the confirm action button */
  confirmText?: string
  /** Label for the cancel button */
  cancelText?: string
  /** Callback when confirm is clicked */
  onConfirm?: () => void
  /** Callback when cancel is clicked */
  onCancel?: () => void
  /** Optional variant for confirm button */
  /** Optional props for the trigger button */
  triggerButton?: React.ReactNode
  /** Optional flag to disable outside click closing */
  disableOutsideClick?: boolean
  /** Optional className for content customization */
  contentClassName?: string
}

/**
 * Reusable Shadcn-style AlertDialog
 */
export const ReusableAlertDialog: React.FC<ReusableAlertDialogProps> = ({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  triggerButton,
  disableOutsideClick = false,
  contentClassName = '',
}) => {
  const [open, setOpen] = React.useState(false)

  const handleConfirm = () => {
    onConfirm?.()
    setOpen(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  return (
    <ShadcnAlertDialog open={open} onOpenChange={setOpen}>
      {triggerButton && (
        <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      )}

      <AlertDialogContent
        className={contentClassName}
        onClick={(e) => disableOutsideClick && e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button variant={'default'} onClick={handleConfirm}>
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  )
}
