'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning'
  isLoading?: boolean
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false
}: ConfirmationDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <Trash2 className="h-6 w-6 text-destructive" />
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      default:
        return null
    }
  }

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive'
      case 'warning':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getIcon()}
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook for easier usage
export function useConfirmationDialog() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    config: Partial<ConfirmationDialogProps>
    isLoading: boolean
  }>({
    isOpen: false,
    config: {},
    isLoading: false
  })

  const openDialog = (dialogConfig: Partial<ConfirmationDialogProps>) => {
    setDialogState({
      isOpen: true,
      config: dialogConfig,
      isLoading: false
    })
  }

  const closeDialog = () => {
    setDialogState(prev => ({
      ...prev,
      isOpen: false,
      isLoading: false
    }))
    // Clear config after animation completes
    setTimeout(() => {
      setDialogState(prev => ({
        ...prev,
        config: {}
      }))
    }, 200)
  }

  const handleConfirm = async () => {
    if (dialogState.config.onConfirm) {
      setDialogState(prev => ({ ...prev, isLoading: true }))
      
      try {
        await dialogState.config.onConfirm()
      } catch (error) {
        // Log error but don't handle it here - let the calling component handle it
        console.error('Confirmation action error:', error)
      } finally {
        // Always close the dialog regardless of success/failure
        closeDialog()
      }
    } else {
      closeDialog()
    }
  }

  const ConfirmationDialogComponent = () => (
    <ConfirmationDialog
      isOpen={dialogState.isOpen}
      onClose={closeDialog}
      onConfirm={handleConfirm}
      isLoading={dialogState.isLoading}
      {...dialogState.config}
    />
  )

  return {
    openDialog,
    closeDialog,
    ConfirmationDialog: ConfirmationDialogComponent,
    isLoading: dialogState.isLoading
  }
}
