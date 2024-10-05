import { RoadmapService } from './../roadmap/roadmap.service';
import { Injectable, Query } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private userService: UserService,
    private roadmapService: RoadmapService,
  ) {}

  async findOneById(id: number): Promise<any> {
    try {
      const comment = await this.commentRepository.findOneBy({ 
        id,
        isActive: true,
        deletedAt: IsNull(),
      });
      if (!comment)  {
        throw new Error("Comment not found");
      } else {
        return {
          statusCode: 200,
          message: "Find comment successfully",
          data: comment,
        }
      }
    } catch (error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Failed to find comment',
      }
    }
  }

  async create(createCommentDto: CreateCommentDto): Promise<any> {
    try {
      const owner = await this.userService.findOneById(createCommentDto.poster); 
      if (!owner) {
          throw new Error('User not found'); 
      }
      const roadmap = (await this.roadmapService.findOneById(createCommentDto.roadmap));
      if (!roadmap) {
        throw new Error('Roadmap not found');
      } 
      const parentComment = (await this.findOneById(createCommentDto.parentComment)).data;
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }

      const comment = this.commentRepository.create({
        ...createCommentDto,
        poster: owner,
        roadmap,
        parentComment,
      });

      const result = await this.commentRepository.save(comment);
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to create comment',
        }
      } else {
        return {
          statusCode: 201,
          message: "Create comment successfully",
          data: result,
        }
      }
    }catch (error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Failed to create comment',
      }
    }
  } 

  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    try {
      const comments = await this.commentRepository
                      .createQueryBuilder('comment')
                      .where("comment.isActive = :isActive", { isActive: true })
                      .andWhere("comment.deletedAt IS NULL")
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getManyAndCount();
      if (!comments) {
        return {
          statusCode: 404,
          message: 'Comments not found',
        }
      } else {
        return {
          statusCode: 200,
          message: 'Get comments successfully',
          data: comments,
        }
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to get comments',
      }
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const existedComment = this.findOneById(id);
      if (!existedComment) {
        return {
          statusCode: 404,
          message: 'Comment not found',
        }
      }
      const comment = await this.commentRepository.create({
        ...(await existedComment).data,
        ...updateCommentDto,
      });
      const result = await this.commentRepository.save(comment);  
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to update comment',
        }
      } else {
        return {
          statusCode: 200,
          message: 'Update comment successfully',
          data: result,
        }
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to update comment',
      }
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const existedComment = this.findOneById(id);
      if (!existedComment) {
        return {
          statusCode: 404,
          message: "Comment not found"
        }
      }
      const comment = (await existedComment).data;
      comment.isActive = false;
      comment.deletedAt = new Date();
      const result = await this.commentRepository.save(comment);
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to remove comment',
        }
      }
      return  {
        statusCode: 200,
        message: 'Remove comment successfully',
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to remove comment',
      }
    }

   }
}
