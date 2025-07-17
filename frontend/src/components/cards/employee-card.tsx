'use client'

import { AnimatedCard } from '@/components/cards/animated-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { format } from 'date-fns'
import { Calendar, Edit, Mail, MapPin, Phone, Trash2 } from 'lucide-react'

interface EmployeeCardProps {
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (id: string) => void
  onClick?: (employee: Employee) => void
  delay?: number
}

export function EmployeeCard({
  employee,
  onEdit,
  onDelete,
  onClick,
  delay = 0,
}: EmployeeCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase()
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(salary)
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(employee)
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(employee)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(employee.id)
  }

  return (
    <AnimatedCard delay={delay} className='[&>div]:py-0'>
      <div onClick={handleCardClick} className='py-6'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Avatar className='h-12 w-12'>
                <AvatarImage
                  src={employee.avatar || '/placeholder.svg'}
                  alt={`${employee.firstName} ${employee.lastName}`}
                />
                <AvatarFallback>
                  {getInitials(employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className='font-semibold text-lg'>
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  {employee.title}
                </p>
              </div>
            </div>
            <Badge
              variant={employee.status === 'active' ? 'default' : 'secondary'}
            >
              {employee.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-1 gap-2 text-sm'>
            <div className='flex items-center space-x-2'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <span className='truncate'>{employee.email}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Phone className='h-4 w-4 text-muted-foreground' />
              <span>{employee.phone}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <MapPin className='h-4 w-4 text-muted-foreground' />
              <span>{employee.location}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span>
                Hired{' '}
                {employee.hireDate
                  ? format(new Date(employee.hireDate), 'MMM yyyy')
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className='flex items-center justify-between pt-2'>
            <div>
              <Badge variant='outline'>{employee.department}</Badge>
              <p className='text-sm font-medium mt-1'>
                {formatSalary(employee.salary)}
              </p>
            </div>
            <div className='flex space-x-1'>
              <Button
                variant='outline'
                size='icon'
                onClick={handleEditClick}
                className='h-8 w-8'
              >
                <Edit className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={handleDeleteClick}
                className='h-8 w-8 text-destructive hover:text-destructive'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </AnimatedCard>
  )
}
