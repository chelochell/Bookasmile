import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentQueryParams,
} from "@/server/models/appointment.model";

const API_BASE = "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

// API utility functions for appointments
export const appointmentApi = {
  // Create appointment
  create: async (data: CreateAppointmentInput): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/appointments`, {
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

  // Get all appointments with optional filtering
  getAll: async (
    params?: Partial<AppointmentQueryParams>
  ): Promise<ApiResponse<any>> => {
    const searchParams = new URLSearchParams();

    if (params?.patientId) searchParams.set("patientId", params.patientId);
    if (params?.dentistId) searchParams.set("dentistId", params.dentistId);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());

    const response = await fetch(
      `${API_BASE}/appointments?${searchParams.toString()}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  },

  // Get appointment by ID
  getById: async (appointmentId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/appointments/${appointmentId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Update appointment
  update: async ({
    appointmentId,
    ...data
  }: UpdateAppointmentInput): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Delete appointment
  delete: async (appointmentId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
