'use client'

import DeleteEmployeeDialog from '@/components/dialogs/DeleteEmployeeDialog'
import { EmployeeDetails } from '@/components/EmployeeDetails'
import { EmployeeForm } from '@/components/forms/employee-form'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useEmployee } from '@/hooks/useEmployee'
import { deleteEmployeeAction, updateEmployeeAction } from '@/queries/actions'
import { UpdateEmployeeData } from '@/queries/employee'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

// Component to display a single employee's details
const EmployeePage = () => {
  const router = useRouter()
  const params = useParams()
  const employeeId = params.employeeId as string

  // State for dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  // Fetch employee data using React Query
  const { data: employee, isLoading, error, isError } = useEmployee(employeeId)

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeData }) =>
      updateEmployeeAction(id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['employee', employeeId] })
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        setIsEditDialogOpen(false)
        toast.success('Employee updated successfully')
      } else {
        toast.error(result.error)
      }
    },
    onError: () => {
      toast.error('Failed to update employee')
    },
  })

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEmployeeAction,
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Employee deleted successfully')
        router.push('/')
      } else {
        toast.error(result.error)
      }
    },
    onError: () => {
      toast.error('Failed to delete employee')
    },
  })

  // Handle edit employee
  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  // Handle delete employee
  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  // Handle form submission for edit
  const handleFormSubmit = async (data: UpdateEmployeeData) => {
    if (employee) {
      await updateMutation.mutateAsync({ id: employee.id, data })
    }
  }

  // Confirm delete
  const confirmDelete = () => {
    if (employee) {
      deleteMutation.mutate(employee.id)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    router.push('/')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center'
          >
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-muted-foreground'>Loading employee details...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !employee) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center min-h-[400px] flex items-center justify-center'
        >
          <div className='space-y-4'>
            <div className='text-6xl'>😞</div>
            <h1 className='text-2xl font-bold text-destructive'>
              Employee Not Found
            </h1>
            <p className='text-muted-foreground max-w-md'>
              {error?.message ||
                "The employee you're looking for doesn't exist or may have been deleted."}
            </p>
            <button
              onClick={handleBack}
              className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
            >
              Back to Directory
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <EmployeeDetails
        employee={employee}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
          <EmployeeForm
            employee={employee}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Employee Dialog */}
      <DeleteEmployeeDialog
        confirmDelete={confirmDelete}
        employeeName={`${employee.firstName} ${employee.lastName}`}
        deletingEmployeeId={isDeleteDialogOpen ? employee.id : null}
        setDeletingEmployeeId={(id) => setIsDeleteDialogOpen(!!id)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}

export default EmployeePage
