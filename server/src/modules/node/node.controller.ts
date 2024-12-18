import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { Roles } from '../role/common/role.decorator';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createNodeDto: CreateNodeDto) {
    return await this.nodeService.create(createNodeDto);
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.nodeService.findAll(page, limit);
  }

  @Get('item/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.nodeService.findOneById(+id);
  }

  @Patch('item/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    return await this.nodeService.update(+id, updateNodeDto);
  }

  @Delete('item/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.nodeService.remove(+id);
  }

  @Get('all/roadmap/:roadmapId')
  @UseGuards(JwtAuthGuard)
  async findNodesByRoadmapId(
    @Param('roadmapId', ParseIntPipe) roadmapId: string
  ) {
    return await this.nodeService.findNodeByRoadmapId(+roadmapId);
  }

  @Get('all/timeline/:timelineId')  
  @UseGuards(JwtAuthGuard)
  async findNodesByTimelineId(
    @Param('timelineId', ParseIntPipe) timelineId: string
  ) {
    return await this.nodeService.findAllNodeByTimelineId(+timelineId);
  }


  
  




}
