import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GroupDivisionService } from './group-division.service';
import { CreateGroupDivisionDto } from './dto/create-group-division.dto';
import { UpdateGroupDivisionDto } from './dto/update-group-division.dto';

@Controller('group-division')
export class GroupDivisionController {
  constructor(private readonly groupDivisionService: GroupDivisionService) {}

  @Post('new')
  async create(@Body() createGroupDivisionDto: CreateGroupDivisionDto) {
    return await this.groupDivisionService.create(createGroupDivisionDto);
  }

  @Get("all")
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.groupDivisionService.findAll();
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return await this.groupDivisionService.findOneById(+id);
  } 

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateGroupDivisionDto: UpdateGroupDivisionDto) {
    return await this.groupDivisionService.update(+id, updateGroupDivisionDto);
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return await this.groupDivisionService.remove(+id);
  }
}
