import {
    Request,
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    ParseIntPipe,
    Req,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Report } from './entities/report.entity';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post('new')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async create(@Body() createReportDto: CreateReportDto, @Req() req: any) {
        createReportDto.posterId = req.user.userId;
        return await this.reportService.create(createReportDto);
    }

    @EventPattern('Create_new_report')
    async handleNotification(@Payload() data: Report) {
        console.log('Create new report');
        await this.reportService.handleNotificationFromRabbitMQ(data);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    async findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
        return await this.reportService.findAll(page, limit);
    }

    @Get('user')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('user')
    async findAllByUser(
        @Request() req,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        const userId = req.user.userId;
        return await this.reportService.findReportsByUser(userId, page, limit);
    }

    @Get('item/:id?')
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
    async remove(
        @Param('id') id: string,
        
    ) {
        return await this.reportService.remove(+id);
    }

    @Get('type/:type')
    @UseGuards(JwtAuthGuard)
    async findAllByType(
        @Param('type') type: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return await this.reportService.getReportsByType(type, page, limit);
    }

    @Post('ban/:idRoadmap')
    @UseGuards(JwtAuthGuard)
    async banUser(
        @Param('idRoadmap', ParseIntPipe) idRoadmap: string,
        @Req() req: any,
    ) {
        return await this.reportService.banRoadmap(+idRoadmap, req.user.userId);
    }

    @Post('checkReport/:idReport')
    //@UseGuards(JwtAuthGuard)
    async checkReport(@Param('idReport', ParseIntPipe) idReport: string) {
        return await this.reportService.checkReport(+idReport);
    }
}
