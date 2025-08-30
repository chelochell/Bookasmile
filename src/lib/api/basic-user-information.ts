import {
  CreateBasicUserInformationInput,
  UpdateBasicUserInformationInput,
  BasicUserInformationQueryParams,
} from "@/server/models/basic-user-information.model";

const API_BASE = "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

// API utility functions for basic user information
export const basicUserInformationApi = {
  // Create basic user information
  create: async (data: CreateBasicUserInformationInput): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/basic-user-information`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      console.error('Response Status:', response.status);
      throw new Error(
        errorData.error || errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },

  // Get all basic user information with optional filtering
  getAll: async (
    params?: Partial<BasicUserInformationQueryParams>
  ): Promise<ApiResponse<any>> => {
    const searchParams = new URLSearchParams();

    if (params?.userId) searchParams.set("userId", params.userId);
    if (params?.firstName) searchParams.set("firstName", params.firstName);
    if (params?.lastName) searchParams.set("lastName", params.lastName);
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());

    const response = await fetch(
      `${API_BASE}/basic-user-information?${searchParams.toString()}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  },

  // Get basic user information by ID
  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/basic-user-information/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get basic user information by user ID
  getByUserId: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/basic-user-information/user/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Check if user has basic information
  checkUserHasInfo: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/basic-user-information/user/${userId}/check`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Update basic user information
  update: async (
    userId: string,
    data: Partial<UpdateBasicUserInformationInput>
  ): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/basic-user-information/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },

  // Delete basic user information
  delete: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/basic-user-information/user/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
