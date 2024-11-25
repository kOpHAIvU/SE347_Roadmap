import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NodeService } from './node.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post('new')
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Get('item/:id')
  findAll() {
    return this.nodeService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.nodeService.findOneById(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    return this.nodeService.update(+id, updateNodeDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.nodeService.remove(+id);
  }
}
