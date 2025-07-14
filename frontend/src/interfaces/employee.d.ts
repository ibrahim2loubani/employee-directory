interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  title: string
  location: string
  avatar: string
  dateOfBirth: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive'
}

interface EmployeeFilters {
  departments: string[]
  titles: string[]
  locations: string[]
}

interface EmployeeQuery {
  search?: string
  department?: string
  title?: string
  location?: string
  status?: 'active' | 'inactive'
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface EmployeeResponse {
  employees: Employee[]
  total: number
  page: number
  limit: number
}

interface CreateEmployeeData {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  title: string
  location: string
  avatar?: string
  dateOfBirth: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive'
}
