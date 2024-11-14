import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Roadmap } from '../roadmap/entities/roadmap.entity';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('Create_new_roadmap')
  handlePostNotificationWhenCreateNewRoadmap(@Payload() newRoadmap: Roadmap) {
    console.log( "Get event");
  }

  // @MessagePattern('Create_new_roadmap')
  // handlePostNotificationWhenCreateNewRoadmap(@Payload() newRoadmap: Roadmap) {
  //   console.log("New roadmap created: ");
  // }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create();
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
