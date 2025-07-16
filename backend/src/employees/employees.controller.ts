/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { EmployeesService } from './employees.service';
import type { Employee } from './interfaces/employee.interface';

//!
//* Interface defining query parameters for employee search and filtering
//* @interface EmployeeQueryParams
//* @description Provides type-safe query parameter structure for employee API endpoints
//!
interface EmployeeQueryParams {
  search?: string;
  department?: string;
  title?: string;
  location?: string;
  status?: 'active' | 'inactive';
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

//!
//* REST API controller for Employee resources
//* @class EmployeesController
//* @description Provides endpoints for creating, reading, updating, and deleting employees
//* @description Supports filtering, pagination, and retrieval of filter options
//* @decorator @Controller('employees') - Maps to '/employees' route
//!
@Controller('employees')
export class EmployeesController {
  //* Constructor injects EmployeesService for business logic operations
  //* @param employeesService - Service layer for employee operations
  constructor(private readonly employeesService: EmployeesService) {}

  //!
  //* Create a new employee record
  //* @method POST /employees
  //* @param req - Express request object containing employee data in body
  //* @returns Promise<Employee> - newly created employee record
  //* @throws ValidationException if employee data is invalid
  //* @example POST /employees with body: { name: 'John Doe', email: 'john@example.com' }
  //!
  @Post()
  async create(@Req() req: Request): Promise<Employee> {
    return this.employeesService.create(req.body);
  }

  //!
  //* Retrieve a paginated list of employees with optional filtering and sorting
  //* @method GET /employees
  //* @param query - Query parameters for search, filters, pagination, and sorting
  //* @returns Promise containing employees array, total count, current page, and limit
  //* @description Supports search by name/email, filtering by department/title/location/status
  //* @description Supports pagination with page/limit and sorting with sortBy/sortOrder
  //* @example GET /employees?search=john&department=IT&page=1&limit=10&sortBy=name&sortOrder=asc
  //!
  @Get()
  async findAll(@Query() query: EmployeeQueryParams): Promise<{
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.employeesService.findAll(query);
  }

  //!
  //* Retrieve distinct filter values for departments, titles, and locations
  //* @method GET /employees/filters
  //* @returns Promise with arrays of unique departments, titles, and locations
  //* @description Useful for populating frontend filter dropdowns
  //* @description Returns only values that exist in the current employee dataset
  //* @example GET /employees/filters returns { departments: ['IT', 'HR'], titles: ['Developer', 'Manager'], locations: ['NYC', 'LA'] }
  //!
  @Get('filters')
  async getFilters(): Promise<{
    departments: string[];
    titles: string[];
    locations: string[];
  }> {
    return this.employeesService.getFilters();
  }

  //!
  //* Retrieve details of a single employee by their unique identifier
  //* @method GET /employees/:id
  //* @param id - Employee unique identifier (string)
  //* @returns Promise<Employee> - employee record if found
  //* @throws NotFoundException if employee with given ID does not exist
  //* @example GET /employees/123e4567-e89b-12d3-a456-426614174000
  //!
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  //!
  //* Update an existing employee record with partial or complete data
  //* @method PATCH /employees/:id
  //* @param id - Employee unique identifier (string)
  //* @param req - Express request object containing update data in body
  //* @returns Promise<Employee> - updated employee record
  //* @throws NotFoundException if employee with given ID does not exist
  //* @throws ValidationException if update data is invalid
  //* @example PATCH /employees/123 with body: { title: 'Senior Developer' }
  //!
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Employee> {
    return this.employeesService.update(id, req.body);
  }

  //!
  //* Delete an employee record by their unique identifier
  //* @method DELETE /employees/:id
  //* @param id - Employee unique identifier (string)
  //* @returns Promise<void> - no content returned on successful deletion
  //* @throws NotFoundException if employee with given ID does not exist
  //* @description Returns HTTP 204 No Content status on successful deletion
  //* @example DELETE /employees/123e4567-e89b-12d3-a456-426614174000
  //!
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.employeesService.remove(id);
  }
}
