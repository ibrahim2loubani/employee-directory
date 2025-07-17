import { EmployeeForm } from '@/components/forms/employee-form'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { createEmployeeAction, updateEmployeeAction } from '@/queries/actions'
import { UpdateEmployeeData } from '@/queries/employee'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

interface EditEmployeeDialogProps {
  isOpen: boolean
  employee: Employee | null
  onClose: () => void
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  isOpen,
  employee,
  onClose,
}) => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createEmployeeAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        onClose()
        toast('Employee created successfully')
      } else {
        toast(result.error)
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeData }) =>
      updateEmployeeAction(id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        queryClient.invalidateQueries({ queryKey: ['employee', employee?.id] })
        onClose()
        toast('Employee updated successfully')
      } else {
        toast(result.error)
      }
    },
  })

  const handleFormSubmit = async (data: CreateEmployeeData) => {
    if (employee) {
      await updateMutation.mutateAsync({ id: employee.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <EmployeeForm
          employee={employee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
