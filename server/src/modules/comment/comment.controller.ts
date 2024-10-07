import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('new')
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.create(createCommentDto);
  }

  @Get('all')
  findAll() {
    return this.commentService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOneById(+id);
  }

  // Only the content of the comment can be updated
  @Patch('item/:id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete('item/:id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.commentService.remove(+id);
  }
}
