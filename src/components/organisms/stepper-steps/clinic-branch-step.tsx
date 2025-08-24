'use client'

import { useState } from 'react'
import { useClinicBranches } from '@/hooks/queries/use-clinic-branches'
import { MapPin, Phone, Mail, Building2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClinicBranchStepProps {
  selectedBranchId: number | null
  onBranchSelect: (branchId: number) => void
}

export default function ClinicBranchStep({ selectedBranchId, onBranchSelect }: ClinicBranchStepProps) {
  const { data: branches = [], isLoading, error } = useClinicBranches()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">
          Choose Your Clinic Branch
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-gray-200 rounded-xl h-48"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load clinic branches
        </h3>
        <p className="text-gray-600">
          Please try refreshing the page or contact support if the problem persists.
        </p>
      </div>
    )
  }

  if (branches.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No clinic branches available
        </h3>
        <p className="text-gray-600">
          Please contact support to set up clinic branches.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">
          Choose Your Clinic Branch
        </h2>
        <p className="text-sm text-gray-600">
          Select the clinic location most convenient for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((branch) => {
          const isSelected = selectedBranchId === branch.id
          
          return (
            <div
              key={branch.id}
              onClick={() => onBranchSelect(Number(branch.id))}
              className={cn(
                "relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-300 hover:shadow-md",
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </div>
              )}

              {/* Branch header */}
              <div className="flex items-center mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                  isSelected
                    ? "bg-blue-500"
                    : "bg-gray-400"
                )}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={cn(
                    "text-base font-semibold font-poppins",
                    isSelected ? "text-blue-900" : "text-gray-900"
                  )}>
                    {branch.name}
                  </h3>
                </div>
              </div>

              {/* Branch details */}
              <div className="space-y-2">
                <div className="flex items-start">
                  <MapPin className={cn(
                    "w-4 h-4 mr-2 mt-0.5 flex-shrink-0",
                    isSelected ? "text-blue-500" : "text-gray-500"
                  )} />
                  <p className={cn(
                    "text-xs leading-relaxed",
                    isSelected ? "text-blue-800" : "text-gray-700"
                  )}>
                    {branch.address}
                  </p>
                </div>

                <div className="flex items-center">
                  <Phone className={cn(
                    "w-4 h-4 mr-2 flex-shrink-0",
                    isSelected ? "text-blue-500" : "text-gray-500"
                  )} />
                  <p className={cn(
                    "text-xs",
                    isSelected ? "text-blue-800" : "text-gray-700"
                  )}>
                    {branch.phone}
                  </p>
                </div>

                <div className="flex items-center">
                  <Mail className={cn(
                    "w-4 h-4 mr-2 flex-shrink-0",
                    isSelected ? "text-blue-500" : "text-gray-500"
                  )} />
                  <p className={cn(
                    "text-xs",
                    isSelected ? "text-blue-800" : "text-gray-700"
                  )}>
                    {branch.email}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selection summary */}
      {selectedBranchId && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
            <p className="text-green-800 text-sm font-medium">
              Selected: {branches.find(b => b.id === selectedBranchId)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
