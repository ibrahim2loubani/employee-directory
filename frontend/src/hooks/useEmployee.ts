import { employeeApi } from '@/queries/employee'
import { useQuery } from '@tanstack/react-query'

/**
 * Custom hook to fetch a single employee by ID.
 *
 * @param employeeId - The ID of the employee to fetch.
 * @returns React Query's useQuery result.
 */
export function useEmployee(employeeId: string) {
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => employeeApi.getEmployee(employeeId),
    enabled: !!employeeId, // Only run query if employeeId exists
    retry: false,
  })
}
