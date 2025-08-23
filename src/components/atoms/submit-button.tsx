'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

export function SubmitButton({ 
  loading = false, 
  disabled, 
  className, 
  children, 
  ...props 
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        'w-full',
        className
      )}
      {...props}
    >
      {loading ? 'Creating...' : children}
    </Button>
  )
}
