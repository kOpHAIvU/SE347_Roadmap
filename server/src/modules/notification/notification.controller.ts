import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, Sse } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Roadmap } from '../roadmap/entities/roadmap.entity';
import { Server } from 'socket.io';
import { Observable, of } from 'rxjs';
import { NotificationWorker } from './notification.worker';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationWorker: NotificationWorker,
    
  ) {}

  @EventPattern('Create_new_roadmap')
  async handlePostNotificationWhenCreateNewRoadmap(
    @Payload() newRoadmap: Roadmap
  ) {
    const notificationTitle = "New Roadmap Has Been Uploaded!";
    const notificationContent = `Welcome to the latest updates! We just released a new Roadmap to help you easily track and plan for the future of the system.\n
    The title of roadmap is: ${newRoadmap.title}\n
    Please check it out and let us know if you have any feedback or questions.\n`;

    const createNotificationDto = {
      title: notificationTitle,
      content: notificationContent,
      posterId: null,
      isActive: true,
    };

    try {
      const resultResponse = await this.notificationService.create(createNotificationDto);

      if (resultResponse.statusCode === 201) {
        const newNotification = Array.isArray(resultResponse.data)
          ? resultResponse.data[0]
          : resultResponse.data;
        console.log('New notification:', newNotification);
        // const sizeOfQuery = this.notificationWorker.addNotification(newNotification);
       // const response = this.notificationGateway.handleSendNotificationWhenHavingNewRoadmap(newNotification);
       // console.log('Response:', response);
      } else {
        console.error('Failed to create notification');
      }
    } catch (error) {
      console.error("Error creating notification:", error.message);
    }
  } 

  // @Get('item/:id')
  // async findOne(@Param('id') id: string) {
  //   const retrieveRoadmap = await this.notificationService.findOne(+id);
  //   const roadmap  = Array.isArray(retrieveRoadmap.data) 
  //                     ? retrieveRoadmap.data[0] 
  //                     : retrieveRoadmap.data;
  //   const response = this.notificationGateway.handleSendNotificationWhenHavingNewRoadmap("Hi roadmap");
  //   return this.notificationService.findOne(+id);
  // }

  @Post('new')
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.notificationService.findAll(page, limit);
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
