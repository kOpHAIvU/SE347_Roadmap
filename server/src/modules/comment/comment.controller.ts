import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { RoleGuard } from '../role/common/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/common/role.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(createCommentDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin') 
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.commentService.findAll(page, limit);
  }

  @Get('item/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
      return await this.commentService.findOneById(+id);
    }

  // Only the content of the comment can be updated
  @Patch('item/:id')
  @UseGuards(JwtAuthGuard)
  async  update(@Param('id', ParseIntPipe) id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return await this.commentService.update(+id, updateCommentDto);
  }

  @Delete('item/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.commentService.remove(+id);
  }

  @Get('all/roadmap/:roadmapId')
  @UseGuards(JwtAuthGuard)
  async findCommentsByRoadmapId(
    @Param('roadmapId', ParseIntPipe) roadmapId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return await this.commentService.getAllCommentsOfRoadmap(roadmapId, page, limit);
  }
}