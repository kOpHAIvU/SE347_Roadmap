import { Message } from 'src/modules/message/entities/message.entity';
import { RoadmapService } from './../roadmap/roadmap.service';
import { Injectable, Logger, Query } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private userService: UserService,
    private roadmapService: RoadmapService,
  ) {}

  async findOneById(
    id: number
  ): Promise<ResponseDto> {
    try {
        const comment = await this.commentRepository.findOneBy({ 
            id,
            isActive: true,
            deletedAt: IsNull(),
        });
        if (!comment)  {
            throw new Error("Comment not found");
        }
        return {
            statusCode: 200,
            message: "Find comment successfully",
            data: comment as Comment,
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: 'Failed to find comment',
        };
    }
}

  async create(
    createCommentDto: CreateCommentDto
  ): Promise<ResponseDto> {
    try {
        const posterResponse = await this.userService.findOneById(createCommentDto.poster); 
        const poster = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data
        if (!posterResponse) {
            throw new Error('User not found'); 
        }
        const roadmapResponse = await this.roadmapService.findOneById(createCommentDto.roadmap);
        const roadmap = Array.isArray(roadmapResponse.data) 
                        ? roadmapResponse.data[0]
                        : roadmapResponse.data;
        if (!roadmapResponse) {
            throw new Error('Roadmap not found');
        } 

        let parentComment;
        if (createCommentDto.parentComment) {
            const parentCommentResponse = await this.findOneById(createCommentDto.parentComment);
            parentComment = parentCommentResponse.data;
            if (!parentComment) {
                throw new Error("Parent comment not found");
            }
        }

        console.log(parentComment);
        console.log(roadmapResponse.data);
        console.log(posterResponse);

        const comment = this.commentRepository.create({
            content: createCommentDto.content, 
            poster: poster,  
            roadmap: roadmap, 
            parentComment: parentComment.data, 
            isActive: true,  
            createdAt: new Date()  
        });

        console.log(comment);

        const result = await this.commentRepository.save(comment);
        if (!result) {
            return {
                statusCode: 500,
                message: 'Failed to create comment',
            };
        }
        return {
            statusCode: 201,
            message: "Create comment successfully",
            data: {
                ...result,
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: 'Failed to create comment because of server error',
        };
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

  async update(
    id: number, 
    updateCommentDto: UpdateCommentDto
  ): Promise<ResponseDto> {
    try {
    
      const existedCommentResponse = await this.findOneById(id);
      const existedComment = Array.isArray(existedCommentResponse.data) 
      ? existedCommentResponse.data[0] 
      : existedCommentResponse.data;
      if (!existedCommentResponse.data) {
        return {
          statusCode: 404,
          message: 'Comment not found',
        }
      }

      const posterResponse = await this.userService.findOneById(updateCommentDto.poster);
      const poster = Array.isArray(posterResponse.data)
                      ? posterResponse.data[0]
                      : posterResponse.data;
      if (!poster) {
        return {
          statusCode: 404,
          message: 'Poster not found',
        }
      }

      const roadmapResponse = await this.roadmapService.findOneById(updateCommentDto.roadmap);
      Logger.log(roadmapResponse);
      const roadmap = Array.isArray(roadmapResponse.data) 
                      ? roadmapResponse.data[0]
                      : roadmapResponse.data;
        if (!roadmap) {
            throw new Error('Roadmap not found');
        } 
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
        }
      }

      const parentCommentResponse = await this.findOneById(updateCommentDto.parentComment);
      const parentComment = Array.isArray(parentCommentResponse.data)
      ? parentCommentResponse.data[0]
      : parentCommentResponse.data;
      if (!parentComment) {
        return {
          statusCode: 404,
          message: 'Parent comment not found',
        }
      }

     const comment = this.commentRepository.create({
        ...existedComment,
        content: updateCommentDto.content,
        poster,
        roadmap,
        parentComment,
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

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const existedComment = await this.findOneById(id);
  
      if (!existedComment || !existedComment.data) {
        return {
          statusCode: 404,
          message: "Comment not found"
        };
      }

      const comment = Array.isArray(existedComment.data) 
        ? existedComment.data[0] 
        : existedComment.data;
  
      if (!comment) {
        return {
          statusCode: 404,
          message: "Comment not found"
        };
      }
  
      comment.isActive = false;
      comment.deletedAt = new Date();
  
      const result = await this.commentRepository.save(comment);
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to remove comment',
        };
      }
  
      return {
        statusCode: 200,
        message: 'Remove comment successfully',
        data: result
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to remove comment',
      };
    }
  }
}
