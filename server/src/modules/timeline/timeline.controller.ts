import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req,
} from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { Roles } from '../role/common/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('timeline')
export class TimelineController {
    constructor(private readonly timelineService: TimelineService) {}

    @Post('new')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createTimelineDto: CreateTimelineDto) {
        return await this.timelineService.create(createTimelineDto);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @Roles('user')
    async findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
        return await this.timelineService.findAll(page, limit);
    }

    @Get('item/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: string) {
        return await this.timelineService.findOneById(+id);
    }

    @Get('user/:userId')
    @UseGuards(JwtAuthGuard)
    async findTimelinesByUserId(
        @Param('userId', ParseIntPipe) idUser: number,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return await this.timelineService.findTimelinesByUserId(idUser, page, limit);
    }

    @Patch('item/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: string, @Body() updateTimelineDto: UpdateTimelineDto) {
        return await this.timelineService.update(+id, updateTimelineDto);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: string) {
        return await this.timelineService.remove(+id);
    }

    @Post('clone/:roadmapId')
    @UseGuards(JwtAuthGuard)
    async cloneRoadmap(@Param('roadmapId', ParseIntPipe) roadmapId: string, @Req() req: any) {
        return await this.timelineService.cloneRoadmap(+roadmapId, req.user.userId);
    }
}
