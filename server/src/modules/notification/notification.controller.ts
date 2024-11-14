import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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
    const notificationTitle = "New Roadmap Has Been Uploaded!";
    const notificationContent = "Welcome to the latest updates! We just released a new Roadmap to help you easily track and plan for the future of the system. \n" + 
                                 "The title of roadmap is: " + newRoadmap.title + "\n" +
                                 "Please check it out and let us know if you have any feedback or questions. \n"           
    let createNotificationDto = {
      title: notificationTitle,
      content: notificationContent,
      posterId: null,
      isActive: true,
    }

    const result = this.notificationService.create(createNotificationDto);
    if (result.then) {
      result.then((res) => {
        if (res.statusCode != 201) {
          console.log(res.message);
        } else {
          console.log("Create notification successfully");
        }
      }).catch((err) => {
        console.log("Error create notification");
      });
    }
  }

  @Post('new')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.notificationService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
