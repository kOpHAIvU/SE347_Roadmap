import { mock } from 'node:test';
 import { create } from 'domain';
import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { ResponseDto } from './common/response.interface';
import { UserService } from '../user/user.service';
import {Server} from 'socket.io';
import { Subject } from 'rxjs';
import { NotificationGateway } from './notification.gateway';
import { ThrottlerStorageService } from '@nestjs/throttler';
import { FirebaseService } from '../firebase/firebase.service';
 
@Injectable()
export class NotificationService {

  private notificationSubject = new Subject<MessageEvent>();
  private readonly firebaseService: FirebaseService;

  constructor (
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
   // private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto
  ): Promise<ResponseDto> {
    try {

      const notification = this.notificationRepository.create({
        ...createNotificationDto,
      });

      const posterResponse = await this.userService.findOneById(createNotificationDto.posterId); 
      const owner = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data;
        
      if (!owner && createNotificationDto.posterId !== null) {
        return {
          statusCode: 404,
          message: 'Poster not found',
          data: null
        };
      }
      notification.postNotification = owner;

      const receiverResponse = await this.userService.findOneById(createNotificationDto.receiverId);
      const receiver = Array.isArray(receiverResponse.data)
                      ? receiverResponse.data[0]
                      : receiverResponse.data;
      if (!receiver && createNotificationDto.receiverId !== null) {
        return {
          statusCode: 404,
          message: 'Receiver not found',
          data: null
        };
      }
      notification.receiver = receiver;
      
      const result = await this.notificationRepository.save(notification);
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to create notification',
          data: null
        }
      }
      
      //this.notificationGateway.handleSendNotificationWhenHavingNewRoadmap(result);
      return {
        statusCode: 201,
        message: 'Create notification successfully',
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  getNotifications() {
    return this.notificationSubject.asObservable();
  }

  // Gửi thông báo qua SSE
  sendNotification(notification: any): void {
    this.notificationSubject.next({
      data: notification,
    } as MessageEvent);
    console.log('Notification sent:', notification);
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<ResponseDto> {   
    try {
      const notifications = await this.notificationRepository
                      .createQueryBuilder('notification')
                      .leftJoinAndSelect('notification.postNotification', 'postNotification')
                      .leftJoinAndSelect('notification.receiver', 'receiver')
                      .where("notification.isActive = :isActive", { isActive: 1 })
                      .andWhere('notification.deletedAt is null')
                      .orderBy('notification.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      if (!notifications) {
        return {
          statusCode: 404,
          message: 'Notification not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get all notifications successfully',
        data: notifications
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get notifications',
        data: null
      }
    }
  }

  async findNotificationsByUser(
    id: number, 
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const notifications = await this.notificationRepository
                                    .createQueryBuilder('notification')
                                    .leftJoinAndSelect('notification.postNotification', 'postNotification')
                                    .leftJoinAndSelect('notification.receiver', 'receiver')
                                    .where("notification.isActive = :isActive", { isActive: 1 })
                                    .andWhere('notification.deletedAt is null')
                                    .andWhere('notification.receiverId = :id', { id })
                                    .skip((page - 1) * limit)
                                    .take(limit)
                                    .getMany();
      if (!notifications) {
        return {
          statusCode: 404,
          message: 'Notification not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get all notifications successfully',
        data: notifications
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  } 

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const notification = await this.notificationRepository.findOneBy({ 
        id,
        isActive: true,
        deletedAt: IsNull(),
      });
      if (!notification) {
        return {
          statusCode: 404,
          message: 'Notification not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get notification successfully',
        data: notification
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when getting notification',
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateNotificationDto: UpdateNotificationDto
  ): Promise<ResponseDto> {
    try {
      const notificationResponse = await this.findOne(id);
      const notification = Array.isArray(notificationResponse.data) 
        ? notificationResponse.data[0] 
        : notificationResponse.data;

      if (!notification) {
        return {
          statusCode: 404,
          message: 'Notification not found'
        }
      }

      const posterResponse = await this.userService.findOneById(updateNotificationDto.posterId); 
      const owner = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data;                  
      if (!owner) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        };
      }
      
      const receiverResponse = await this.userService.findOneById(updateNotificationDto.receiverId);
      const receiver = Array.isArray(receiverResponse.data)
                      ? receiverResponse.data[0]
                      : receiverResponse.data;
      notification.receiver = receiver;

      const updateData = this.notificationRepository.create({ 
        ...notification,
        ...updateNotificationDto,
        postNotification: owner,
        receiver
      });

      console.log(updateData);
      const result = await this.notificationRepository.save(updateData);
      return {
        statusCode: 200,
        message: 'Update notification successfully',
        data: result,
      }

    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when updating notification',
        data: null
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const notificationResponse = await this.findOne(id);
      const notification = Array.isArray(notificationResponse.data) 
        ? notificationResponse.data[0] 
        : notificationResponse.data;

      if (!notification) {
        return {
          statusCode: 404,
          message: 'Notification not found',
          data: null
        }
      }
      notification.deletedAt = new Date();
      const result = await this.notificationRepository.save(notification);
      return {
        statusCode: 200,
        message: 'Delete notification successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when deleting notification',
        data: null
      }
    }
  }
}
