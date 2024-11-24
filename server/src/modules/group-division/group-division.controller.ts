import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupDivisionService } from './group-division.service';
import { CreateGroupDivisionDto } from './dto/create-group-division.dto';
import { UpdateGroupDivisionDto } from './dto/update-group-division.dto';

@Controller('group-division')
export class GroupDivisionController {
  constructor(private readonly groupDivisionService: GroupDivisionService) {}

  @Post()
  create(@Body() createGroupDivisionDto: CreateGroupDivisionDto) {
    return this.groupDivisionService.create(createGroupDivisionDto);
  }

  @Get()
  findAll() {
    return this.groupDivisionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupDivisionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDivisionDto: UpdateGroupDivisionDto) {
    return this.groupDivisionService.update(+id, updateGroupDivisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupDivisionService.remove(+id);
  }
}
