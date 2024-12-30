import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    Query,
    UseInterceptors,
    UploadedFile,
    Req,
} from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('roadmap')
export class RoadmapController {
    constructor(private readonly roadmapService: RoadmapService) {}

    @Post('new_roadmap')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async create(@Body() createRoadmapDto: CreateRoadmapDto, @UploadedFile() file?: Express.Multer.File) {
        console.log('File in controller:', file);
        return await this.roadmapService.create(createRoadmapDto, file);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    async findAll(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 100,
        @Req() req: any,
    ) {
        return await this.roadmapService.findAll(page, limit, req.user.userId);
    }

    @Get('id/:id')
    @UseGuards(JwtAuthGuard)
    async findOneById(@Param('id', ParseIntPipe) id: number) {
        return await this.roadmapService.findOneById(+id);
    }

    @Get('code/:code')
    @UseGuards(JwtAuthGuard)
    async findOneByCode(@Param('code') code: string) {
        return await this.roadmapService.findOneByCode(code);
    }

    @Get('type/:type')
    @UseGuards(JwtAuthGuard)
    async findRoadmapByType(
        @Param('type') type: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 100,
    ) {
        return await this.roadmapService.findRoadmapsByType(type, page, limit);
    }

    @Get('owner')
    @UseGuards(JwtAuthGuard)
    async findRoadmapByOwner(
        @Req() req: any,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 100,
    ) {
        return await this.roadmapService.findRoadmapsByOwner(req.user.userId, page, limit);
    }

    @Patch('item/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async updateById(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateRoadmapDto: UpdateRoadmapDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return await this.roadmapService.updateById(+id, updateRoadmapDto, file);
    }

    @Patch('code/:code')
    @UseGuards(JwtAuthGuard)
    async updateByCode(@Param('code') code: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
        return await this.roadmapService.updateByCode(code, updateRoadmapDto);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async removeById(@Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
        return await this.roadmapService.removeById(+id);
    }

    @Delete('code/:code')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async removeByCode(@Param('code') code: string, @UploadedFile() file?: Express.Multer.File) {
        return await this.roadmapService.removeByCode(code);
    }

    @Get('search/:name')
    @UseGuards(JwtAuthGuard)
    async searchRoadmap(
        @Param('name') name: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return await this.roadmapService.findRoadmapsByTitle(name, page, limit);
    }
}
