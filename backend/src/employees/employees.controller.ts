import {
  Body,
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
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import type { Employee } from './interfaces/employee.interface';

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

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(
    @Req() req: Request,
  ): Promise<Employee> {
    // Bypass ValidationPipe by using req.body directly
    return this.employeesService.create(req.body);
  }

  @Get()
  async findAll(@Query() query: EmployeeQueryParams): Promise<{
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.employeesService.findAll(query);
  }

  @Get('filters')
  async getFilters(): Promise<{
    departments: string[];
    titles: string[];
    locations: string[];
  }> {
    return this.employeesService.getFilters();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.employeesService.remove(id);
  }
}
