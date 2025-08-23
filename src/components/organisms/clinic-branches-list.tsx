'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, Phone, Mail } from 'lucide-react'

interface ClinicBranch {
  id: string | number
  name: string
  address: string
  phone: string
  email: string
}

interface ClinicBranchesListProps {
  branches: ClinicBranch[]
}

export function ClinicBranchesList({ branches }: ClinicBranchesListProps) {
  if (branches.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No clinic branches found</h3>
          <p className="text-sm text-muted-foreground text-center">
            Get started by creating your first clinic branch.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch) => (
        <Card key={branch.id} className="h-fit hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-poppins">{branch.name}</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {branch.address}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <p className="text-sm font-medium">
                {branch.phone}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <p className="text-sm font-medium text-primary">
                {branch.email}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
