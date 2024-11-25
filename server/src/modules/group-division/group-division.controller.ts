import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GroupDivisionService } from './group-division.service';
import { CreateGroupDivisionDto } from './dto/create-group-division.dto';
import { UpdateGroupDivisionDto } from './dto/update-group-division.dto';

@Controller('group-division')
export class GroupDivisionController {
  constructor(private readonly groupDivisionService: GroupDivisionService) {}

  @Post('new')
  create(@Body() createGroupDivisionDto: CreateGroupDivisionDto) {
    return this.groupDivisionService.create(createGroupDivisionDto);
  }

  @Get("all")
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.groupDivisionService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.groupDivisionService.findOneById(+id);
  } 

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateGroupDivisionDto: UpdateGroupDivisionDto) {
    return this.groupDivisionService.update(+id, updateGroupDivisionDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.groupDivisionService.remove(+id);
  }
}
