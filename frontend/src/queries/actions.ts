'use server'

import { employeeApi, type UpdateEmployeeData } from '@/queries/employee'
import { revalidatePath } from 'next/cache'

export async function createEmployeeAction(data: CreateEmployeeData) {
  try {
    const employee = await employeeApi.createEmployee(data)
    revalidatePath('/')
    return { success: true, employee }
  } catch (error) {
    console.error('Failed to create employee:', error)
    return { success: false, error: 'Failed to create employee' }
  }
}

export async function updateEmployeeAction(
  id: string,
  data: UpdateEmployeeData,
) {
  try {
    const employee = await employeeApi.updateEmployee(id, data)
    revalidatePath('/')
    return { success: true, employee }
  } catch (error) {
    console.error('Failed to update employee:', error)
    return { success: false, error: 'Failed to update employee' }
  }
}

export async function deleteEmployeeAction(id: string) {
  try {
    await employeeApi.deleteEmployee(id)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete employee:', error)
    return { success: false, error: 'Failed to delete employee' }
  }
}
