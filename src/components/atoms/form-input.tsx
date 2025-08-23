'use client'

import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
    )
  }
)
FormInput.displayName = 'FormInput'

export { FormInput }
