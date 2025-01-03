import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Post('new')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createProgressDto: CreateProgressDto) {
        return await this.progressService.create(createProgressDto);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return await this.progressService.findAll(page, limit);
    }

    // @Get('all/userProgress/:userId')
    // @UseGuards(JwtAuthGuard)
    // async findAllBy(
    //   @Body('timelineId', ParseIntPipe) timelineId: number,
    //   @Body('teamId', ParseIntPipe) groupId: number,
    //   @Query('page', ParseIntPipe) page: number = 1,
    //   @Query('limit', ParseIntPipe) limit: number = 10,
    // ) {
    //   return await this.progressService.findAllByUser(timelineId, groupId, page, limit);
    // }

    @Get('all/userProgress')
    @UseGuards(JwtAuthGuard)
    async findAllBy(
        @Req() req: any,
        @Body('timelineId', ParseIntPipe) timelineId: number,
        @Body('teamId', ParseIntPipe) teamId: number,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return await this.progressService.findProgressOfUser(req.user.userId, timelineId, teamId, page, limit);
    }

    @Get('nodeItem/:nodeId')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @Body('timelineId', ParseIntPipe) timelineId: number,
        @Body('teamId', ParseIntPipe) groupId: number,
        @Param('nodeId', ParseIntPipe) nodeId: number,
    ) {
        return await this.progressService.findOne(timelineId, groupId, nodeId);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return await this.progressService.remove(+id);
    }
}
