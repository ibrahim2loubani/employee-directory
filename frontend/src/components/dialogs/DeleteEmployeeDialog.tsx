import { FC } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

interface IDeleteEmployeeDialogProps {
  confirmDelete: () => void
  employeeName: string
  deletingEmployeeId: string | null
  setDeletingEmployeeId: (id: string | null) => void
  isDeleting?: boolean
}

const DeleteEmployeeDialog: FC<IDeleteEmployeeDialogProps> = ({
  confirmDelete,
  employeeName,
  deletingEmployeeId,
  setDeletingEmployeeId,
  isDeleting = false,
}) => {
  return (
    <AlertDialog
      open={!!deletingEmployeeId}
      onOpenChange={() => setDeletingEmployeeId(null)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className='font-medium'>{employeeName}</span>&apos;s employee
            record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteEmployeeDialog
