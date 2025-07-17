import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  Edit,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'

interface EmployeeDetailsProps {
  employee: Employee
  onEdit?: () => void
  onDelete?: () => void
  onBack?: () => void
}

export const EmployeeDetails: FC<EmployeeDetailsProps> = ({
  employee,
  onEdit,
  onDelete,
  onBack,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP')
    } catch {
      return dateString
    }
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-4xl mx-auto p-6 space-y-6'
    >
      {/* Header with Back Button */}
      <div className='flex items-center justify-between'>
        {onBack && (
          <Button variant='ghost' onClick={onBack} className='mb-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Directory
          </Button>
        )}
        <div className='flex gap-2'>
          {onEdit && (
            <Button variant='outline' onClick={onEdit}>
              <Edit className='h-4 w-4 mr-2' />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant='destructive' onClick={onDelete}>
              <Trash2 className='h-4 w-4 mr-2' />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardHeader className='pb-4'>
          <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
            <Avatar className='h-32 w-32 border-4 border-background shadow-lg'>
              <Image
                src={employee.avatar || '/placeholder-avatar.svg'}
                alt={`${employee.firstName} ${employee.lastName}`}
                className='object-cover'
                width={128}
                height={128}
              />
            </Avatar>

            <div className='flex-1 space-y-2'>
              <div>
                <h1 className='text-3xl font-bold'>
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className='text-xl text-muted-foreground'>
                  {employee.title}
                </p>
                <p className='text-lg text-muted-foreground'>
                  {employee.department}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <Badge
                  variant={
                    employee.status === 'active' ? 'default' : 'secondary'
                  }
                  className='capitalize'
                >
                  {employee.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Contact Information */}
          <div>
            <h3 className='text-lg font-semibold mb-3 flex items-center'>
              <User className='h-5 w-5 mr-2' />
              Contact Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                <Mail className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Email</p>
                  <a
                    href={`mailto:${employee.email}`}
                    className='font-medium hover:underline'
                  >
                    {employee.email}
                  </a>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                <Phone className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Phone</p>
                  <a
                    href={`tel:${employee.phone}`}
                    className='font-medium hover:underline'
                  >
                    {employee.phone}
                  </a>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                <MapPin className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Location</p>
                  <p className='font-medium'>{employee.location}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                <Building className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Department</p>
                  <p className='font-medium'>{employee.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h3 className='text-lg font-semibold mb-3 flex items-center'>
              <Building className='h-5 w-5 mr-2' />
              Employment Details
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                <Calendar className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Hire Date</p>
                  <p className='font-medium'>{formatDate(employee.hireDate)}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                <Calendar className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Date of Birth</p>
                  <p className='font-medium'>
                    {formatDate(employee.dateOfBirth)}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 rounded-lg bg-muted/50'>
                <DollarSign className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Salary</p>
                  <p className='font-medium'>{formatSalary(employee.salary)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
