import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('new')
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get('all')
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.teamService.findAll(page, limit);
  }

  @Get('item/:id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.teamService.findOneById(+id);
  }

  @Patch('item/:id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete('item/:id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.teamService.remove(+id);
  }
}
