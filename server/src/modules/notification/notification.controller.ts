import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, Sse, ParseIntPipe } from '@nestjs/common';
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
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.notificationService.findAll(page, limit);
  }

  @Get('all/user/:id')
  async findNotificationsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.notificationService.findNotificationsByUser(id, page, limit);
  }

  @Patch('item/:id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return await this.notificationService.update(id, updateNotificationDto);
  }

  @Delete('item/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.notificationService.remove(id);
  }
}
