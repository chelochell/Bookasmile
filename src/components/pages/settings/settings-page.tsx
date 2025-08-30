"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, UserIcon, PhoneIcon, MapPinIcon } from 'lucide-react'
import { 
  useBasicUserInformationByUserId, 
  useCreateBasicUserInformation, 
  useUpdateBasicUserInformation 
} from '@/hooks'
import { calculateAge } from '@/utils/age-calculator'
import { basicUserInformationSchema } from '@/server/models/basic-user-information.model'
import { z } from 'zod'
import {
  getAllRegions,
  getAllProvinces,
  getProvincesByRegion,
  getMunicipalitiesByProvince,
  getBarangaysByMunicipality,
} from "@aivangogh/ph-address"

// Local type declarations for Philippines address data
type TBarangay = {
  name: string;
  psgcCode: string;
  municipalCityCode: string;
}

type TMunicipality = {
  name: string;
  psgcCode: string;
  provinceCode: string;
}

type TProvince = {
  name: string;
  psgcCode: string;
  regionCode: string;
}

type TRegion = {
  name: string;
  psgcCode: string;
  designation: string;
}

// Form schema (without userId since it's provided by the component)
const settingsFormSchema = basicUserInformationSchema.omit({ userId: true })
type SettingsFormData = z.infer<typeof settingsFormSchema>

interface SettingsPageProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null)
  
  // Address state
  const [regionList, setRegionList] = useState<TRegion[]>([])
  const [provinceList, setProvinceList] = useState<TProvince[]>([])
  const [cityList, setCityList] = useState<TMunicipality[]>([])
  const [barangayList, setBarangayList] = useState<TBarangay[]>([])
  
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  // Hooks
  const { data: basicInfo, isLoading, error } = useBasicUserInformationByUserId(user.id)
  const createMutation = useCreateBasicUserInformation()
  const updateMutation = useUpdateBasicUserInformation()

  // Form setup
  const form = useForm({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleInitial: '',
      birthDate: '',
      gender: 'prefer-not-to-say' as const,
      phoneNumber: '',
      address: '',
      region: '',
      province: '',
      city: '',
      barangay: '',
      zipCode: '',
      country: 'Philippines',
      emergencyContactName: '',
      emergencyContactPhoneNumber: '',
      emergencyContactRelationship: 'other' as const,
    }
  })

  // Load regions on component mount
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionData = getAllRegions()
        setRegionList(regionData)
      } catch (error) {
        console.error('Error loading regions:', error)
      }
    }
    loadRegions()
  }, [])

  // Pre-populate form with existing data or user name
  useEffect(() => {
    if (basicInfo) {
      // Populate form with existing basic info
      form.reset({
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        middleInitial: basicInfo.middleInitial || '',
        birthDate: new Date(basicInfo.birthDate).toISOString().split('T')[0],
        gender: basicInfo.gender,
        phoneNumber: basicInfo.phoneNumber,
        address: basicInfo.address,
        region: basicInfo.region,
        province: basicInfo.province,
        city: basicInfo.city,
        barangay: basicInfo.barangay,
        zipCode: basicInfo.zipCode,
        country: basicInfo.country || 'Philippines',
        emergencyContactName: basicInfo.emergencyContactName || '',
        emergencyContactPhoneNumber: basicInfo.emergencyContactPhoneNumber || '',
        emergencyContactRelationship: basicInfo.emergencyContactRelationship || 'other',
      })
      
      // Set address selections
      setSelectedRegion(basicInfo.region)
      setSelectedProvince(basicInfo.province)
      setSelectedCity(basicInfo.city)
      
      // Calculate age
      try {
        const age = calculateAge(basicInfo.birthDate)
        setCalculatedAge(age)
      } catch (error) {
        console.error('Error calculating age:', error)
      }
    } else if (user.name && !isLoading && !error) {
      // Pre-populate with user name if no basic info exists
      const nameParts = user.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      form.setValue('firstName', firstName)
      form.setValue('lastName', lastName)
    }
  }, [basicInfo, user.name, isLoading, error, form])

  // Load provinces when region changes
  useEffect(() => {
    const loadProvinces = async () => {
      if (selectedRegion) {
        try {
          const regionData = regionList.find(r => r.name === selectedRegion)
          if (regionData?.psgcCode) {
            const provinceData = getProvincesByRegion(regionData.psgcCode)
            setProvinceList(provinceData)
          }
        } catch (error) {
          console.error('Error loading provinces:', error)
        }
      }
    }
    loadProvinces()
  }, [selectedRegion, regionList])

  // Load cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (selectedProvince) {
        try {
          const provinceData = provinceList.find(p => p.name === selectedProvince)
          if (provinceData?.psgcCode) {
            const cityData = getMunicipalitiesByProvince(provinceData.psgcCode)
            setCityList(cityData)
          }
        } catch (error) {
          console.error('Error loading cities:', error)
        }
      }
    }
    loadCities()
  }, [selectedProvince, provinceList])

  // Load barangays when city changes
  useEffect(() => {
    const loadBarangays = async () => {
      if (selectedCity) {
        try {
          const cityData = cityList.find(c => c.name === selectedCity)
          if (cityData?.psgcCode) {
            const barangayData = getBarangaysByMunicipality(cityData.psgcCode)
            setBarangayList(barangayData)
          }
        } catch (error) {
          console.error('Error loading barangays:', error)
        }
      }
    }
    loadBarangays()
  }, [selectedCity, cityList])

  // Calculate age when birth date changes
  const birthDate = form.watch('birthDate')
  useEffect(() => {
    if (birthDate) {
      try {
        const age = calculateAge(birthDate)
        setCalculatedAge(age)
      } catch (error) {
        setCalculatedAge(null)
      }
    } else {
      setCalculatedAge(null)
    }
  }, [birthDate])

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        userId: user.id,
      }

      if (basicInfo) {
        // Update existing
        await updateMutation.mutateAsync({ userId: user.id, data: formData })
      } else {
        // Create new
        await createMutation.mutateAsync(formData)
      }
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form to original values
    if (basicInfo) {
      form.reset({
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        middleInitial: basicInfo.middleInitial || '',
        birthDate: new Date(basicInfo.birthDate).toISOString().split('T')[0],
        gender: basicInfo.gender,
        phoneNumber: basicInfo.phoneNumber,
        address: basicInfo.address,
        region: basicInfo.region,
        province: basicInfo.province,
        city: basicInfo.city,
        barangay: basicInfo.barangay,
        zipCode: basicInfo.zipCode,
        country: basicInfo.country || 'Philippines',
        emergencyContactName: basicInfo.emergencyContactName || '',
        emergencyContactPhoneNumber: basicInfo.emergencyContactPhoneNumber || '',
        emergencyContactRelationship: basicInfo.emergencyContactRelationship || 'other',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <div className="text-center py-8">Loading your settings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>
          {basicInfo && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Information
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your personal details and identification information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control as any}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing && basicInfo}
                            placeholder="Enter first name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control as any}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing && basicInfo}
                            placeholder="Enter last name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control as any}
                    name="middleInitial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Initial</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing && basicInfo}
                            placeholder="M.I."
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control as any}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            disabled={!isEditing && basicInfo}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      value={calculatedAge !== null ? `${calculatedAge} years old` : ''}
                      disabled
                      placeholder="Calculated from birth date"
                    />
                  </div>
                  
                  <FormField
                    control={form.control as any}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={!isEditing && basicInfo}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  How we can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!isEditing && basicInfo}
                          placeholder="+63 912 345 6789"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Address Information
                </CardTitle>
                <CardDescription>
                  Your current address details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!isEditing && basicInfo}
                          placeholder="House number, street name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedRegion(value)
                            // Clear dependent fields
                            form.setValue('province', '')
                            form.setValue('city', '')
                            form.setValue('barangay', '')
                            setSelectedProvince('')
                            setSelectedCity('')
                          }} 
                          value={field.value}
                          disabled={!isEditing && basicInfo}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regionList.map((region) => (
                              <SelectItem key={region.psgcCode} value={region.name || ''}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedProvince(value)
                            // Clear dependent fields
                            form.setValue('city', '')
                            form.setValue('barangay', '')
                            setSelectedCity('')
                          }} 
                          value={field.value}
                          disabled={!isEditing && basicInfo || !selectedRegion}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinceList.map((province) => (
                              <SelectItem key={province.psgcCode} value={province.name || ''}>
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Municipality</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedCity(value)
                            // Clear dependent fields
                            form.setValue('barangay', '')
                          }} 
                          value={field.value}
                          disabled={!isEditing && basicInfo || !selectedProvince}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select city/municipality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cityList.map((city) => (
                              <SelectItem key={city.psgcCode} value={city.name || ''}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="barangay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barangay</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={!isEditing && basicInfo || !selectedCity}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select barangay" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {barangayList.map((barangay) => (
                              <SelectItem key={barangay.psgcCode} value={barangay.name || ''}>
                                {barangay.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing && basicInfo}
                            placeholder="1234"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled
                            value="Philippines"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>
                  Someone we can contact in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing && basicInfo}
                            placeholder="Full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="emergencyContactPhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            disabled={!isEditing && basicInfo}
                            placeholder="+63 912 345 6789"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!isEditing && basicInfo}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="relative">Relative</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {(isEditing || !basicInfo) && (
              <div className="flex justify-end gap-4">
                {basicInfo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}
