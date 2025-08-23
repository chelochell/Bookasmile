import {
  CreateDentistAvailabilityInput,
  UpdateDentistAvailabilityInput,
  DentistAvailabilityQueryParams,
  CreateSpecificDentistAvailabilityInput,
  UpdateSpecificDentistAvailabilityInput,
  SpecificDentistAvailabilityQueryParams,
} from '@/server/models/availability.model'

const API_BASE_URL = '/api/availability'

// Generic API response type
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Dentist API
export const dentistApi = {
  async getByUserId(userId: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/dentist/${userId}`)
    return response.json()
  },
}

// Dentist Availability API
export const dentistAvailabilityApi = {
  async create(data: CreateDentistAvailabilityInput): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/dentist-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getAll(params?: DentistAvailabilityQueryParams): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams()
    
    if (params?.dentistId) searchParams.append('dentistId', params.dentistId)
    if (params?.dayOfWeek) searchParams.append('dayOfWeek', params.dayOfWeek)
    if (params?.clinicBranchId) searchParams.append('clinicBranchId', params.clinicBranchId.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    const queryString = searchParams.toString()
    const url = `${API_BASE_URL}/dentist-availability${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url)
    return response.json()
  },

  async getById(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/dentist-availability/${id}`)
    return response.json()
  },

  async update(data: UpdateDentistAvailabilityInput): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/dentist-availability/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/dentist-availability/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  },
}

// Specific Dentist Availability API
export const specificDentistAvailabilityApi = {
  async create(data: CreateSpecificDentistAvailabilityInput): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/specific-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getAll(params?: SpecificDentistAvailabilityQueryParams): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams()
    
    if (params?.dentistId) searchParams.append('dentistId', params.dentistId)
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.clinicBranchId) searchParams.append('clinicBranchId', params.clinicBranchId.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())

    const queryString = searchParams.toString()
    const url = `${API_BASE_URL}/specific-availability${queryString ? `?${queryString}` : ''}`
    
    const response = await fetch(url)
    return response.json()
  },

  async getById(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/specific-availability/${id}`)
    return response.json()
  },

  async update(data: UpdateSpecificDentistAvailabilityInput): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/specific-availability/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/specific-availability/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  },
}
