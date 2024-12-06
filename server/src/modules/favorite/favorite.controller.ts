import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('new')
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return await this.favoriteService.create(createFavoriteDto);
  }

  @Get('all')
  async findAll(
    @Query ('page', ParseIntPipe) page: number,
    @Query ('limit', ParseIntPipe) limit: number
  ) {
    return await this.favoriteService.findAll(page, limit);
  }

  @Get('item/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.favoriteService.findOne(+id);
  }

  @Get('user/:id')
  async findFavoriteByUser(
    @Param('id', ParseIntPipe) id: number,
    @Query ('page', ParseIntPipe) page: number,
    @Query ('limit', ParseIntPipe) limit: number
  ) {
    return await this.favoriteService.findFavoriteByUser(id, page, limit);
  }

  @Patch('item/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    return await this.favoriteService.update(+id, updateFavoriteDto);
  }

  @Delete('item/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.favoriteService.remove(+id);
  }
}
