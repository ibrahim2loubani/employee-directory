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
} from '@nestjs/common';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { QueryEmployeeDto } from './dto/query-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import type { Employee } from './interfaces/employee.interface';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  async findAll(@Query() query: QueryEmployeeDto): Promise<{
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
