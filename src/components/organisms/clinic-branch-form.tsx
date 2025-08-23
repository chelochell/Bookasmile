'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClinicBranchSchema, type CreateClinicBranchInput } from '@/server/models/clinic-branch.model'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormInput } from '@/components/atoms/form-input'
import { SubmitButton } from '@/components/atoms/submit-button'

interface ClinicBranchFormProps {
  onSubmit: (data: CreateClinicBranchInput) => Promise<void>
  loading?: boolean
}

export function ClinicBranchForm({ onSubmit, loading = false }: ClinicBranchFormProps) {
  const form = useForm<CreateClinicBranchInput>({
    resolver: zodResolver(createClinicBranchSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  })

  const handleSubmit = async (data: CreateClinicBranchInput) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // Error handling can be done by the parent component
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-poppins">Create Clinic Branch</CardTitle>
        <CardDescription>
          Add a new clinic branch to your network. Fill in all the required information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Clinic Branch Name</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder="Enter clinic branch name"
                      error={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder="Enter full address"
                      error={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder="Enter phone number"
                      type="tel"
                      error={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder="Enter email address"
                      type="email"
                      error={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton loading={loading}>
              Create Clinic Branch
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
