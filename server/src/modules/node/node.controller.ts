import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('new')
  async create(@Body() createNodeDto: CreateNodeDto) {
    return await this.nodeService.create(createNodeDto);
  }

  @Get('item/:id')
  async findAll() {
    return await this.nodeService.findAll();
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return await this.nodeService.findOneById(+id);
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    return await this.nodeService.update(+id, updateNodeDto);
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return await this.nodeService.remove(+id);
  }
}
