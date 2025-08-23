'use client'

import { useRouter } from 'next/navigation'
import { ClinicBranchForm } from '@/components/organisms/clinic-branch-form'
import { type CreateClinicBranchInput } from '@/server/models/clinic-branch.model'
import { useCreateClinicBranch } from '@/hooks'

export default function CreateClinicBranch() {
  const router = useRouter()
  const { mutateAsync: createClinicBranch, isPending } = useCreateClinicBranch()

  const handleSubmit = async (data: CreateClinicBranchInput) => {
    try {
      const result = await createClinicBranch(data)
      
      if (result.success) {
        router.push('/admin/clinic-branches')
      }
    } catch (error) {
      // Error is already handled by the mutation hook
    }
  }

  return (
    <div className="container mx-auto py-8">
      <ClinicBranchForm onSubmit={handleSubmit} loading={isPending} />
    </div>
  )
}