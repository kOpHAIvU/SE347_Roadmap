import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private senderService: UserService,
    private teamService: TeamService,
  ) {}

  async create(
    createMessageDto: CreateMessageDto
  ): Promise<ResponseDto> {
    try {
      const senderResponse = await this.senderService.findOneById(createMessageDto.senderId);
      const sender = Array.isArray(senderResponse.data)
                    ? senderResponse.data[0]
                    : senderResponse.data;
      if (!sender) {
        return {
          statusCode: 404,
          message: 'Sender not found',
          data: null
        }
      }

      const teamResponse = await this.teamService.findOneById(createMessageDto.teamId);
      const team = Array.isArray(teamResponse.data)
                  ? teamResponse.data[0]
                  : teamResponse.data;
      if (!team) {
        return {
          statusCode: 404,
          message: 'Team not found',
          data: null
        }
      }

      const message = await this.messageRepository.create({
        ...createMessageDto,
        sender: sender,
        team: team,
      });

      const savedMessage = await this.messageRepository.save(message);

      return {
        statusCode: 201,
        message: 'Message created successfully',
        data: savedMessage,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when creating message',
        data: null,
      }
    }
  }

  async findAll(
    page: number = 0,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const messages = await this.messageRepository
                      .createQueryBuilder('message')
                      .leftJoinAndSelect('message.sender', 'sender')
                      .leftJoinAndSelect('message.team', 'team')
                      .where('message.deletedAt is null')
                      .orderBy('message.createdAt', 'DESC')
                      .skip(page * limit)
                      .limit(limit)
                      .getMany();

      if (messages.length === 0) {
        return {
          statusCode: 404,
          message: 'Message not found',
          data: null,
        }
      }

      return {
        statusCode: 200,
        message: 'Find all messages successfully',
        data: messages,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when finding messages',
        data: null,
      }
    }
  }

  async findOneById(id: number): Promise<ResponseDto> {
    try{
      const message = await this.messageRepository
                      .createQueryBuilder('message')
                      .leftJoinAndSelect('message.sender', 'sender')
                      .leftJoinAndSelect('message.team', 'team')
                      .where('message.id = :id', { id })
                      .andWhere('message.deletedAt is null')
                      .getOne();

      if (!message) {
        return {
          statusCode: 404,
          message: 'Message not found',
          data: null,
        }
      }

      return {
        statusCode: 200,
        message: 'Find message by id successfully',
        data: message,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when finding message',
        data: null,
      }
    }
  }

  async update(
    id: number, 
    updateMessageDto: UpdateMessageDto
  ): Promise<ResponseDto> {
    try {
      const messageResponse = await this.findOneById(id);
      if (messageResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Message not found',
          data: null
        }
      }
      const message = Array.isArray(messageResponse.data)
                    ? messageResponse.data[0]
                    : messageResponse.data  

      const senderResponse = await this.senderService.findOneById(updateMessageDto.senderId);
      const sender = Array.isArray(senderResponse.data)
                    ? senderResponse.data[0]
                    : senderResponse.data;
      if (!sender) {
        return {
          statusCode: 404,
          message: 'Sender not found',
          data: null
        }
      }

      const teamResponse = await this.teamService.findOneById(updateMessageDto.teamId);
      const team = Array.isArray(teamResponse.data)
                  ? teamResponse.data[0]
                  : teamResponse.data;
      if (!team) {
        return {
          statusCode: 404,
          message: 'Team not found',
          data: null
        }
      }

      const newMessage = await this.messageRepository.create({
        ...message,
        ...updateMessageDto,
        sender: sender,
        team: team,
      });
;
      const result = await this.messageRepository.save(newMessage);

      return {
        statusCode: 200,
        message: 'Message updated successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when updating message',
        data: null,
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const messageResponse = await this.findOneById(id);
      if (messageResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Message not found',
          data: null
        }
      }
      const message = Array.isArray(messageResponse.data)
                    ? messageResponse.data[0]
                    : messageResponse.data;

      message.deletedAt = new Date();
      const result = await this.messageRepository.save(message);

      return {
        statusCode: 200,
        message: 'Message deleted successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when deleting message',
        data: null,
      }
    }
  }
}
