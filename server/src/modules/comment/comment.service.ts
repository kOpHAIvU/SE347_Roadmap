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
        const comment = await this.commentRepository
                            .createQueryBuilder('comment')
                            .leftJoinAndSelect('comment.poster', 'poster')
                            .leftJoinAndSelect('comment.roadmap', 'roadmap')
                            .leftJoinAndSelect('comment.parentComment', 'parentComment')
                            .where("comment.id = :id", { id })
                            .andWhere("comment.isActive = :isActive", { isActive: true })
                            .andWhere("comment.deletedAt IS NULL")
                            .getOne();

        if (!comment) {
            return {
                statusCode: 404,
                message: 'Comment not found',
                data: null
            }
        }
        return {
            statusCode: 200,
            message: 'Get comment successfully',
            data: comment
        }
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
        const comment = this.commentRepository.create({
          content: createCommentDto.content, 
          poster: null,  
          roadmap: null, 
          parentComment: null, 
          isActive: true,  
          createdAt: new Date()  
      });
        const posterResponse = await this.userService.findOneById(createCommentDto.poster); 
        if (posterResponse.statusCode !== 200) {
          return {
              statusCode: 404,
              message: 'Poster not found',
              data: null
          }
        }
        const poster = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data

        comment.poster = poster;
        const roadmapResponse = await this.roadmapService.findOneById(createCommentDto.roadmap);
        const roadmap = Array.isArray(roadmapResponse.data) 
                        ? roadmapResponse.data[0]
                        : roadmapResponse.data;
        if (!roadmapResponse) {
            return {
                statusCode: 404,
                message: 'Roadmap not found',
                data: null
            }
        } 
        comment.roadmap = roadmap;

        let parentComment;
        if (typeof createCommentDto.parentComment !== 'undefined') {
            const parentCommentResponse = await this.findOneById(createCommentDto.parentComment);
            if (parentCommentResponse.statusCode !== 200) {
                return {
                    statusCode: 404,
                    message: 'Parent comment not found',
                    data: null
                }
            }

            parentComment = Array.isArray(parentCommentResponse.data)
                            ? parentCommentResponse.data[0]
                            : parentCommentResponse.data;
            comment.parentComment = parentComment;
        }

        const result = await this.commentRepository.save(comment);
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
            message: error.message,
            data: null
        };
    }
}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    try {
      const comments = await this.commentRepository
                      .createQueryBuilder('comment')
                      .leftJoinAndSelect('comment.poster', 'poster')
                      .leftJoinAndSelect('comment.roadmap', 'roadmap')
                      .leftJoinAndSelect('comment.parentComment', 'parentComment')
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
        message: error.message,
      }
    }
  }

  // async update(
  //   id: number, 
  //   updateCommentDto: UpdateCommentDto
  // ): Promise<ResponseDto> {
  //   try {
    
  //     const existedCommentResponse = await this.findOneById(id);
  //     const existedComment = Array.isArray(existedCommentResponse.data) 
  //     ? existedCommentResponse.data[0] 
  //     : existedCommentResponse.data;
  //     if (!existedCommentResponse.data) {
  //       return {
  //         statusCode: 404,
  //         message: 'Comment not found',
  //       }
  //     }

  //     const posterResponse = await this.userService.findOneById(updateCommentDto.poster);
  //     const poster = Array.isArray(posterResponse.data)
  //                     ? posterResponse.data[0]
  //                     : posterResponse.data;
  //     if (!poster) {
  //       return {
  //         statusCode: 404,
  //         message: 'Poster not found',
  //       }
  //     }

  //     const roadmapResponse = await this.roadmapService.findOneById(updateCommentDto.roadmap);
  //     Logger.log(roadmapResponse);
  //     const roadmap = Array.isArray(roadmapResponse.data) 
  //                     ? roadmapResponse.data[0]
  //                     : roadmapResponse.data;
  //       if (!roadmap) {
  //           throw new Error('Roadmap not found');
  //       } 
  //     if (!roadmap) {
  //       return {
  //         statusCode: 404,
  //         message: 'Roadmap not found',
  //       }
  //     }

  //     const parentCommentResponse = await this.findOneById(updateCommentDto.parentComment);
  //     const parentComment = Array.isArray(parentCommentResponse.data)
  //     ? parentCommentResponse.data[0]
  //     : parentCommentResponse.data;
  //     if (!parentComment) {
  //       return {
  //         statusCode: 404,
  //         message: 'Parent comment not found',
  //       }
  //     }

  //    const comment = this.commentRepository.create({
  //       ...existedComment,
  //       content: updateCommentDto.content,
  //       poster,
  //       roadmap,
  //       parentComment,
  //    });

  //     const result = await this.commentRepository.save(comment);  
  //     if (!result) {
  //       return {
  //         statusCode: 500,
  //         message: 'Failed to update comment',
  //       }
  //     } else {
  //       return {
  //         statusCode: 200,
  //         message: 'Update comment successfully',
  //         data: result,
  //       }
  //     }
  //   } catch(error) {
  //     return {
  //       statusCode: 500,
  //       message: 'Failed to update comment',
  //     }
  //   }
  // }

  async update(
    id: number, 
    updateCommentDto: UpdateCommentDto
  ): Promise<ResponseDto> {
    try {
      const existedCommentResponse = await this.findOneById(id);
      const existedComment = Array.isArray(existedCommentResponse.data) 
                            ? existedCommentResponse.data[0] 
                            : existedCommentResponse.data;
      if (!existedComment) {
        return {
          statusCode: 404,
          message: 'Comment not found',
        }
      }

      const newComment = this.commentRepository.create({
        ...existedComment,
        content: updateCommentDto.content,
      });
      const result = await this.commentRepository.save(newComment);
      return {
        statusCode: 200,
        message: 'Update comment successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to update comment',
        data: null
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
     Logger.log(existedComment)

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

  async getAllCommentsOfRoadmap(
    roadmapId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const comments = await this.commentRepository
                      .createQueryBuilder('comment')
                      .leftJoinAndSelect('comment.poster', 'poster')
                      .leftJoinAndSelect('comment.roadmap', 'roadmap')
                      .leftJoinAndSelect('comment.parentComment', 'parentComment')
                      .where("comment.isActive = :isActive", { isActive: true })
                      .andWhere("comment.deletedAt IS NULL")
                      .andWhere("comment.roadmap = :roadmapId", { roadmapId })
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      if (!comments) {
        return {
          statusCode: 404,
          message: 'Comments not found',
        }
      }
      return {
        statusCode: 200,
        message: 'Get comments successfully',
        data: comments
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
}
