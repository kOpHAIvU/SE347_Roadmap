import { create } from 'domain';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { ResponseDto } from './common/response.interface';
import { UserService } from '../user/user.service';
 
@Injectable()
export class NotificationService {

  constructor (
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UserService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto
  ): Promise<ResponseDto> {
    try {
      const posterResponse = await this.userService.findOneById(createNotificationDto.posterId); 
      const owner = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data;
      if (!owner) {
        return {
          statusCode: 404,
          message: 'Poster not found',
        };
      }

      const notification = this.notificationRepository.create({
        ...createNotificationDto,
        postNotification: owner,
      });
      const result = await this.notificationRepository.save(notification);
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to create notification',
          data: null
        }
      }
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

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<ResponseDto> {   
    try {
      const notifications = await this.notificationRepository
                      .createQueryBuilder('notification')
                      .leftJoinAndSelect('notification.postNotification', 'postNotification')
                      .where("notification.isActive = :isActive", { isActive: 1 })
                      .andWhere('notification.deletedAt is null')
                      .orderBy('notification.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      if (notifications.length == 0) {
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
      console.log(notification);

      const updateData = {
        ...notification,
        ...updateNotificationDto,
        posterId: owner,
      };  
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
