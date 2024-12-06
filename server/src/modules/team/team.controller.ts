import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('new')
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.teamService.findAll(page, limit);
  }

  @Get('item/:id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.teamService.findOneById(+id);
  }

  @Patch('item/:id')
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return await this.teamService.update(+id, updateTeamDto);
  }

  @Delete('item/:id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.teamService.remove(+id);
  }
}
