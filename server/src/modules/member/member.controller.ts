import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('new')
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get('all')
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.memberService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.memberService.findOneById(+id);
  }

  @Patch('item/:id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete('item/:id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.memberService.remove(+id);
  }
}
