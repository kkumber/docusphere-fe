import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

interface DialogConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  title: string
  description: string
  infoSection?: React.ReactNode
  submitFn: () => void
  loading?: boolean
}

export function DialogConfirmation({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  submitFn,
  loading,
}: DialogConfirmationProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={submitFn} disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
