import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() createReportDto: CreateReportDto) {
    return await this.reportService.create(createReportDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin') 
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.reportService.findAll(page, limit);
  }

  @Get('item/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.reportService.findOne(+id);
  }

  @Patch('item/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return await this.reportService.update(+id, updateReportDto);
  }

  @Delete('item/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.reportService.remove(+id);
  }
}
