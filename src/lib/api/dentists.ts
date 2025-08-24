import axios from 'axios'

const API_BASE = '/api'

interface DentistResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface Dentist {
  id: string
  userId: string
  specialization: string[]
  user: {
    id: string
    name: string
    email: string
  }
}

export const dentistApi = {
  // Get all dentists
  getAll: async (params?: { clinicBranchId?: number }): Promise<DentistResponse<{ dentists: Dentist[], pagination: any }>> => {
    try {
      const searchParams = new URLSearchParams()
      if (params?.clinicBranchId) {
        searchParams.append('clinicBranchId', params.clinicBranchId.toString())
      }
      
      const queryString = searchParams.toString()
      const url = `${API_BASE}/dentists${queryString ? `?${queryString}` : ''}`
      
      const response = await axios.get(url)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch dentists')
    }
  },

  // Get dentist by ID
  getById: async (id: string): Promise<DentistResponse<Dentist>> => {
    try {
      const response = await axios.get(`${API_BASE}/dentists/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch dentist')
    }
  },
}
