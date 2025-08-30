import { useQuery } from '@tanstack/react-query'
import { basicUserInformationApi } from '@/lib/api/basic-user-information'
import { BasicUserInformationQueryParams } from '@/server/models/basic-user-information.model'

// Query keys for React Query
export const basicUserInformationKeys = {
  all: ['basicUserInformation'] as const,
  lists: () => [...basicUserInformationKeys.all, 'list'] as const,
  list: (filters?: Partial<BasicUserInformationQueryParams>) => [...basicUserInformationKeys.lists(), { filters }] as const,
  details: () => [...basicUserInformationKeys.all, 'detail'] as const,
  detail: (id: string) => [...basicUserInformationKeys.details(), id] as const,
  userDetails: () => [...basicUserInformationKeys.all, 'userDetail'] as const,
  userDetail: (userId: string) => [...basicUserInformationKeys.userDetails(), userId] as const,
  userCheck: (userId: string) => [...basicUserInformationKeys.all, 'userCheck', userId] as const,
}

// Hook to fetch all basic user information with optional filtering
export const useBasicUserInformation = (params?: Partial<BasicUserInformationQueryParams>) => {
  return useQuery({
    queryKey: basicUserInformationKeys.list(params),
    queryFn: () => basicUserInformationApi.getAll(params),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch basic user information')
      }
      return data.data.basicUserInformation
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch basic user information by ID
export const useBasicUserInformationById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: basicUserInformationKeys.detail(id),
    queryFn: () => basicUserInformationApi.getById(id),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch basic user information')
      }
      return data.data
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch basic user information by user ID
export const useBasicUserInformationByUserId = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: basicUserInformationKeys.userDetail(userId),
    queryFn: () => basicUserInformationApi.getByUserId(userId),
    select: (data) => {
      if (!data.success) {
        // Return null if not found instead of throwing error
        if (data.error === 'Basic user information not found') {
          return null
        }
        throw new Error(data.error || 'Failed to fetch basic user information')
      }
      return data.data
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a 404 (not found) error
      if (error?.message?.includes('Basic user information not found')) {
        return false
      }
      return failureCount < 3
    }
  })
}

// Hook to check if user has basic information
export const useUserHasBasicInformation = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: basicUserInformationKeys.userCheck(userId),
    queryFn: () => basicUserInformationApi.checkUserHasInfo(userId),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error || 'Failed to check user basic information')
      }
      return data.data.hasBasicInfo
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
