import axios from 'axios'
import { CreateClinicBranchInput } from '@/server/models/clinic-branch.model'

const API_BASE = '/api/admin'

interface ClinicBranchResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface ClinicBranch {
  id: string | number
  name: string
  address: string
  phone: string
  email: string
}

export const clinicBranchApi = {
  // Get all clinic branches
  getAll: async (): Promise<ClinicBranchResponse<ClinicBranch[]>> => {
    try {
      const response = await axios.get(`${API_BASE}/clinic-branches`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch clinic branches')
    }
  },

  // Get clinic branch by ID
  getById: async (id: string | number): Promise<ClinicBranchResponse<ClinicBranch>> => {
    try {
      const response = await axios.get(`${API_BASE}/clinic-branches/${id}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch clinic branch')
    }
  },

  // Create new clinic branch
  create: async (data: CreateClinicBranchInput): Promise<ClinicBranchResponse<ClinicBranch>> => {
    try {
      const response = await axios.post(`${API_BASE}/clinic-branches`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create clinic branch')
    }
  },

  // Note: Update and delete endpoints would go here when implemented
  // update: async (data: UpdateClinicBranchInput): Promise<ClinicBranchResponse<ClinicBranch>> => { ... }
  // delete: async (id: string | number): Promise<ClinicBranchResponse> => { ... }
}
