'use client'

import { useDentistByUserId } from "@/hooks"
import { authClient } from "@/lib/auth-client"
import { WeeklyAvailabilitySchedule } from "@/components/organisms/weekly-availability-schedule"
import { SpecificAvailabilitySchedule } from "@/components/organisms/specific-availability-schedule"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DentistSchedule() {
    const { data: session } = authClient.useSession()
    const userId = session?.user?.id

    const { data: dentist, isLoading: isDentistLoading, error } = useDentistByUserId(userId || '', !!userId)

    if (!userId) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Please log in to manage your schedule</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isDentistLoading) {
        return (
            <div className="p-6">
                <header className="flex flex-col gap-3 mb-8">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-96" />
                </header>
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

    if (error || !dentist) {
        return (
            <div className="p-6">
                <header className="flex flex-col gap-3 mb-8">
                    <h1 className="text-2xl font-bold">Availability Schedule</h1>
                    <p className="text-sm text-muted-foreground">Set your available days and time slots for appointments</p>
                </header>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">
                            {error?.message || 'Unable to load dentist information. Please contact support if you should have access to this feature.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6">
            <header className="flex flex-col gap-3 mb-8">
                <h1 className="text-2xl font-bold">Availability Schedule</h1>
                <p className="text-sm text-muted-foreground">Set your available days and time slots for appointments</p>
            </header>

            <div className="space-y-8">
                {/* Weekly Recurring Schedule */}
                <WeeklyAvailabilitySchedule dentistId={dentist.id} />

                {/* Specific Date Availability */}
                <SpecificAvailabilitySchedule dentistId={dentist.id} />
            </div>
        </div>
    )
}