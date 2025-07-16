/* eslint-disable @typescript-eslint/no-floating-promises */

/* eslint-disable @typescript-eslint/require-await */
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type {
  Employee,
  RandomUser,
  RandomUserResponse,
} from './interfaces/employee.interface';

@Injectable()
export class EmployeesService {
  private employees: Employee[] = [];
  private readonly departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
  ];
  private readonly titles = [
    'Software Engineer',
    'Senior Developer',
    'Team Lead',
    'Manager',
    'Director',
    'VP',
  ];
  private readonly locations = [
    'New York',
    'San Francisco',
    'London',
    'Berlin',
    'Tokyo',
    'Remote',
  ];

  constructor(@Optional() private readonly httpService?: HttpService) {
    this.initializeEmployees();
  }

  private async initializeEmployees(): Promise<void> {
    try {
      if (!this.httpService) {
        this.employees = [];
        return;
      }

      const response = await firstValueFrom(
        this.httpService.get<RandomUserResponse>(
          'https://randomuser.me/api/?results=50&nat=us,gb,ca,au',
        ),
      );

      this.employees = response.data.results.map((user: RandomUser) =>
        this.transformRandomUserToEmployee(user),
      );
    } catch (error) {
      console.error(
        'Failed to initialize employees from randomuser.me:',
        error,
      );
      this.employees = [];
    }
  }

  private transformRandomUserToEmployee(user: RandomUser): Employee {
    return {
      id: user.login.uuid,
      firstName: user.name.first,
      lastName: user.name.last,
      email: user.email,
      phone: user.phone,
      department:
        this.departments[Math.floor(Math.random() * this.departments.length)],
      title: this.titles[Math.floor(Math.random() * this.titles.length)],
      location:
        this.locations[Math.floor(Math.random() * this.locations.length)],
      avatar: user.picture.large,
      dateOfBirth: user.dob.date,
      hireDate: user.registered.date,
      salary: Math.floor(Math.random() * 150000) + 50000,
      status: Math.random() > 0.1 ? 'active' : 'inactive',
    };
  }

  async findAll(query: {
    search?: string;
    department?: string;
    title?: string;
    location?: string;
    status?: 'active' | 'inactive';
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
  }> {
    let filteredEmployees = [...this.employees];

    if (query.search) {
      const searchTerm = query.search.trim().toLowerCase();
      filteredEmployees = filteredEmployees.filter((emp) => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return (
          emp.firstName.toLowerCase().includes(searchTerm) ||
          emp.lastName.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          fullName.includes(searchTerm)
        );
      });
    }

    if (query.department) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.department === query.department,
      );
    }

    if (query.title) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.title === query.title,
      );
    }

    if (query.location) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.location === query.location,
      );
    }

    if (query.status) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.status === query.status,
      );
    }

    if (query.sortBy) {
      const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
      filteredEmployees.sort((a, b) => {
        const aValue = a[query.sortBy as keyof Employee];
        const bValue = b[query.sortBy as keyof Employee];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * sortOrder;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * sortOrder;
        }

        return 0;
      });
    }

    // Apply pagination
    const page = Number.parseInt(query.page || '1', 10);
    const limit = Number.parseInt(query.limit || '10', 10);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    return {
      employees: paginatedEmployees,
      total: filteredEmployees.length,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = this.employees.find((emp) => emp.id === id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const email = createEmployeeDto.email?.trim().toLowerCase();

    // Check if email already exists (case-insensitive)
    const existingEmployee = this.employees.find(
      (emp) => emp.email.toLowerCase() === email,
    );

    if (existingEmployee) {
      throw new BadRequestException('Employee with this email already exists');
    }

    // Default avatar based on first name
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      createEmployeeDto.firstName || 'Employee',
    )}&background=6366f1&color=ffffff&size=200`;

    const newEmployee: Employee = {
      id: this.generateId(),
      firstName: createEmployeeDto.firstName || '',
      lastName: createEmployeeDto.lastName || '',
      email: createEmployeeDto.email?.trim() || '',
      phone: createEmployeeDto.phone || '',
      department: createEmployeeDto.department || '',
      title: createEmployeeDto.title || '',
      location: createEmployeeDto.location || '',
      dateOfBirth: createEmployeeDto.dateOfBirth || '',
      hireDate: createEmployeeDto.hireDate || '',
      salary: createEmployeeDto.salary || 0,
      status: createEmployeeDto.status || 'active',
      avatar: createEmployeeDto.avatar || defaultAvatar,
    };

    // Add new employee at the beginning of the array
    this.employees.unshift(newEmployee);
    return newEmployee;
  }

  async update(
    id: string,
    updateEmployeeDto: Partial<CreateEmployeeDto>,
  ): Promise<Employee> {
    const employeeIndex = this.employees.findIndex((emp) => emp.id === id);
    if (employeeIndex === -1) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Check if email already exists (excluding current employee, case-insensitive)
    if (updateEmployeeDto.email) {
      const email = updateEmployeeDto.email.trim().toLowerCase();
      const existingEmployee = this.employees.find(
        (emp) => emp.email.toLowerCase() === email && emp.id !== id,
      );
      if (existingEmployee) {
        throw new BadRequestException(
          'Employee with this email already exists',
        );
      }
    }

    const updatedEmployee = {
      ...this.employees[employeeIndex],
      ...updateEmployeeDto,
      email: updateEmployeeDto.email
        ? updateEmployeeDto.email.trim()
        : this.employees[employeeIndex].email,
    };
    this.employees[employeeIndex] = updatedEmployee;
    return updatedEmployee;
  }

  async remove(id: string): Promise<void> {
    const employeeIndex = this.employees.findIndex((emp) => emp.id === id);
    if (employeeIndex === -1) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    this.employees.splice(employeeIndex, 1);
  }

  async getFilters(): Promise<{
    departments: string[];
    titles: string[];
    locations: string[];
  }> {
    const departments = [
      ...new Set(this.employees.map((emp) => emp.department)),
    ];
    const titles = [...new Set(this.employees.map((emp) => emp.title))];
    const locations = [...new Set(this.employees.map((emp) => emp.location))];

    return { departments, titles, locations };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private createSampleEmployees(): Employee[] {
    return [
      {
        id: 'emp001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+1-555-0101',
        department: 'Engineering',
        title: 'Software Engineer',
        location: 'New York',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        dateOfBirth: '1990-01-15',
        hireDate: '2020-03-01',
        salary: 75000,
        status: 'active',
      },
      {
        id: 'emp002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+1-555-0102',
        department: 'Marketing',
        title: 'Marketing Manager',
        location: 'San Francisco',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        dateOfBirth: '1988-05-22',
        hireDate: '2019-07-15',
        salary: 85000,
        status: 'active',
      },
      {
        id: 'emp003',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@company.com',
        phone: '+1-555-0103',
        department: 'Engineering',
        title: 'Senior Developer',
        location: 'Remote',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        dateOfBirth: '1985-09-10',
        hireDate: '2018-01-20',
        salary: 95000,
        status: 'active',
      },
      {
        id: 'emp004',
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@company.com',
        phone: '+1-555-0104',
        department: 'HR',
        title: 'HR Manager',
        location: 'London',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        dateOfBirth: '1992-12-03',
        hireDate: '2021-05-10',
        salary: 70000,
        status: 'inactive',
      },
      {
        id: 'emp005',
        firstName: 'Charlie',
        lastName: 'Wilson',
        email: 'charlie.wilson@company.com',
        phone: '+1-555-0105',
        department: 'Sales',
        title: 'Sales Director',
        location: 'Berlin',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        dateOfBirth: '1983-04-18',
        hireDate: '2017-11-30',
        salary: 110000,
        status: 'active',
      },
      {
        id: 'emp006',
        firstName: 'Olivia',
        lastName: 'Taylor',
        email: 'olivia.taylor@company.com',
        phone: '+1-555-0106',
        department: 'Engineering',
        title: 'Director',
        location: 'New York',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        dateOfBirth: '1985-07-12',
        hireDate: '2016-09-01',
        salary: 130000,
        status: 'active',
      },
      {
        id: 'emp007',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@company.com',
        phone: '+1-555-0107',
        department: 'Engineering',
        title: 'VP',
        location: 'San Francisco',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        dateOfBirth: '1980-03-25',
        hireDate: '2015-01-15',
        salary: 150000,
        status: 'active',
      },
    ];
  }
}
