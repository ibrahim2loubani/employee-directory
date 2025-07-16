'use client'

import { EmployeeCard } from '@/components/cards/employee-card'
import { EmployeeForm } from '@/components/forms/employee-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EmployeeCardSkeleton } from '@/components/ui/shimmer'

// API and query imports
import {
  createEmployeeAction,
  deleteEmployeeAction,
  updateEmployeeAction,
} from '@/queries/actions'
import { employeeApi } from '@/queries/employee'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// External library imports
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

/**
 * EmployeePage - Main page component for the Employee Directory
 *
 * This component provides a complete employee management interface with:
 * - Employee listing with pagination
 * - Search functionality
 * - Filtering by department, title, location, and status
 * - CRUD operations (Create, Read, Update, Delete)
 * - Responsive design with animations
 *
 * Key features:
 * - Real-time search with debounced input
 * - Filter dropdowns populated from API data
 * - Modal dialogs for creating/editing employees
 * - Confirmation dialog for deletions
 * - Loading skeletons during data fetching
 * - Toast notifications for user feedback
 * - Optimistic UI updates with React Query
 */
export default function EmployeePage() {
  // State for employee query parameters (pagination, filters, search)
  const [query, setQuery] = useState<EmployeeQuery>({ page: 1, limit: 12 })
  
  // Form dialog state management
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  
  // Delete confirmation dialog state
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(
    null,
  )
  
  // Search input state (separate from query for immediate UI feedback)
  const [searchTerm, setSearchTerm] = useState('')

  // React Query client for cache invalidation
  const queryClient = useQueryClient()

  // Fetch employees with current query parameters (pagination, filters, search)
  const {
    data: employeesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['employees', query],
    queryFn: () => employeeApi.getEmployees(query),
  })

  // Fetch filter options for dropdowns (departments, titles, locations)
  const { data: filters } = useQuery({
    queryKey: ['employees-filters'],
    queryFn: employeeApi.getFilters,
  })

  // Create employee mutation with success/error handling
  const createMutation = useMutation({
    mutationFn: createEmployeeAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        setIsFormOpen(false)
        toast('Employee created successfully')
      } else {
        toast(result.error)
      }
    },
  })

  // Update employee mutation with success/error handling
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateEmployeeAction(id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        setEditingEmployee(null)
        toast('Employee updated successfully')
      } else {
        toast(result.error)
      }
    },
  })

  // Delete employee mutation with success/error handling
  const deleteMutation = useMutation({
    mutationFn: deleteEmployeeAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        setDeletingEmployeeId(null)
        toast('Employee deleted successfully')
      } else {
        toast(result.error)
      }
    },
  })

  /**
   * Handles search input changes and updates query parameters
   * Resets pagination to page 1 when search term changes
   */
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setQuery((prev) => ({ ...prev, search: value, page: 1 }))
  }

  /**
   * Handles filter dropdown changes (department, title, location, status)
   * Converts 'all' selection to undefined and resets pagination
   */
  const handleFilterChange = (key: keyof EmployeeQuery, value: string) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }))
  }

  /**
   * Sets the employee to be edited, opening the form dialog
   */
  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
  }

  /**
   * Sets the employee ID to be deleted, opening the confirmation dialog
   */
  const handleDelete = (id: string) => {
    setDeletingEmployeeId(id)
  }

  /**
   * Confirms deletion and triggers the delete mutation
   */
  const confirmDelete = () => {
    if (deletingEmployeeId) {
      deleteMutation.mutate(deletingEmployeeId)
    }
  }

  /**
   * Handles form submission for both create and update operations
   * Determines operation type based on editingEmployee state
   */
  const handleFormSubmit = async (data: any) => {
    if (editingEmployee) {
      await updateMutation.mutateAsync({ id: editingEmployee.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-destructive mb-4'>
            Error Loading Employees
          </h1>
          <p className='text-muted-foreground'>
            Please make sure the backend server is running and try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <h1 className='text-4xl font-bold mb-2'>Employee Directory</h1>
        <p className='text-muted-foreground'>Manage your team members</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='mb-6 space-y-4'
      >
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search employees...'
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button onClick={() => setIsFormOpen(true)} className='shrink-0'>
            <Plus className='h-4 w-4 mr-2' />
            Add Employee
          </Button>
        </div>

        <div className='flex flex-wrap gap-4'>
          <Select
            onValueChange={(value) => handleFilterChange('department', value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Department' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Departments</SelectItem>
              {filters?.departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('title', value)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Title' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Titles</SelectItem>
              {filters?.titles.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange('location', value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Location' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Locations</SelectItem>
              {filters?.locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='inactive'>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Employee Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <EmployeeCardSkeleton key={index} />
            ))
          : employeesData?.employees.length === 0
          ? (
              <div className='col-span-full text-center py-16'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='space-y-4'
                >
                  <div className='text-6xl'>🔍</div>
                  <h3 className='text-xl font-semibold text-muted-foreground'>
                    No employees found
                  </h3>
                  <p className='text-muted-foreground max-w-md mx-auto'>
                    {searchTerm || query.department || query.title || query.location || query.status
                      ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                      : 'Get started by adding your first employee to the directory.'}
                  </p>
                  {!searchTerm && !query.department && !query.title && !query.location && !query.status && (
                    <Button onClick={() => setIsFormOpen(true)} className='mt-4'>
                      <Plus className='h-4 w-4 mr-2' />
                      Add First Employee
                    </Button>
                  )}
                </motion.div>
              </div>
            )
          : employeesData?.employees.map((employee, index) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={handleEdit}
                onDelete={handleDelete}
                delay={index * 0.05}
              />
            ))}
      </div>

      {/* Pagination */}
      {employeesData && employeesData.total > employeesData.limit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='flex justify-center mt-8'
        >
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              disabled={query.page === 1}
              onClick={() =>
                setQuery((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
              }
            >
              Previous
            </Button>
            <span className='flex items-center px-4'>
              Page {query.page} of{' '}
              {Math.ceil(employeesData.total / employeesData.limit)}
            </span>
            <Button
              variant='outline'
              disabled={
                query.page ===
                Math.ceil(employeesData.total / employeesData.limit)
              }
              onClick={() =>
                setQuery((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
              }
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {/* Create/Edit Employee Dialog */}
      <Dialog
        open={isFormOpen || !!editingEmployee}
        onOpenChange={(open) => {
          if (!open) {
            setIsFormOpen(false)
            setEditingEmployee(null)
          }
        }}
      >
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <EmployeeForm
            employee={editingEmployee || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingEmployee(null)
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingEmployeeId}
        onOpenChange={() => setDeletingEmployeeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              employee record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
