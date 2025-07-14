import { handleError } from '@/lib/apiErrorHandler'
import { api } from '@/lib/axios'
import axios from 'axios'

export type UpdateEmployeeData = Partial<CreateEmployeeData>

export const employeeApi = {
  getEmployees: async (
    query: EmployeeQuery = {},
  ): Promise<EmployeeResponse> => {
    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await api.get<EmployeeResponse>(
      `/employees?${params.toString()}`,
    )
    return response.data
  },

  getEmployee: async (id: string): Promise<Employee> => {
    try {
      const response = await api.get<Employee>(`/employees/${id}`)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  createEmployee: async (data: CreateEmployeeData): Promise<Employee> => {
    try {
      const response = await api.post<Employee>('/employees', data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
      handleError(error)
      throw error
    }
  },

  updateEmployee: async (
    id: string,
    data: UpdateEmployeeData,
  ): Promise<Employee> => {
    try {
      const response = await api.patch<Employee>(`/employees/${id}`, data)
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  deleteEmployee: async (id: string): Promise<void> => {
    try {
      await api.delete(`/employees/${id}`)
    } catch (error) {
      handleError(error)
      throw error
    }
  },

  getFilters: async (): Promise<EmployeeFilters> => {
    const response = await api.get<EmployeeFilters>('/employees/filters')
    return response.data
  },
}
