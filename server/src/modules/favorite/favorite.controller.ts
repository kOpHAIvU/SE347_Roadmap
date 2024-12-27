import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { Roles } from '../role/common/role.decorator';
import { RoleGuard } from '../role/common/role.guard';

@Controller('favorite')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post('new')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createFavoriteDto: CreateFavoriteDto) {
        return await this.favoriteService.create(createFavoriteDto);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    async findAll(@Query('page', ParseIntPipe) page: number, @Query('limit', ParseIntPipe) limit: number) {
        return await this.favoriteService.findAll(page, limit);
    }

    @Get('item/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.favoriteService.findOne(+id);
    }

    @Get('all/owner')
    @UseGuards(JwtAuthGuard)
    async findFavoriteByUser(
        @Req() req: any,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        return await this.favoriteService.findFavoriteByUser(req.user.userId, page, limit);
    }

    @Patch('item/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateFavoriteDto: UpdateFavoriteDto) {
        return await this.favoriteService.update(+id, updateFavoriteDto);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.favoriteService.remove(+id);
    }

    @Get('roadmap/:id')
    @UseGuards(JwtAuthGuard)
    async findFavoriteByRoadmap(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.favoriteService.CheckOutUserFavoriteRoadmap(req.user.userId, id);
    }
}
