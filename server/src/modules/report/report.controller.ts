import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('new')
  async create(@Body() createReportDto: CreateReportDto) {
    return await this.reportService.create(createReportDto);
  }

  @Get('all')
  async findAll() {
    return await this.reportService.findAll();
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return await this.reportService.findOne(+id);
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return await this.reportService.update(+id, updateReportDto);
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return await this.reportService.remove(+id);
  }
}
