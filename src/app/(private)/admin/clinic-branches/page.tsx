'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ClinicBranchesList } from '@/components/organisms/clinic-branches-list'
import { useClinicBranches } from '@/hooks'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClinicBranchesPage() {
    const { data: clinicBranches = [], isLoading, error } = useClinicBranches()

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
                    <p className="text-muted-foreground">Failed to load clinic branches. Please try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-poppins font-bold">Clinic Branches</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your clinic branch locations
                    </p>
                </div>
                <Link href="/admin/clinic-branches/create">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Branch
                    </Button>
                </Link>
            </div>
            
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 border rounded-lg space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <ClinicBranchesList branches={clinicBranches} />
            )}
        </div>
    )
}