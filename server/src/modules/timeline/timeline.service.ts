import { Injectable, Logger } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { Timeline } from './entities/timeline.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadmapService } from '../roadmap/roadmap.service';
import {ResponseDto} from './common/response.interface'
import { UserService } from '../user/user.service';
import { NodeService } from '../node/node.service';

@Injectable()
export class TimelineService {

  constructor(
    @InjectRepository(Timeline)
    private timelineRepository: Repository<Timeline>,
    private roadmapService: RoadmapService,
    private userService: UserService,
    private nodeService: NodeService,
  ) {}

  async create(
    createTimelineDto: CreateTimelineDto
  ): Promise<ResponseDto> {
    try {
      const leaderResponse = await this.userService.findOneById(createTimelineDto.leader);
      const leader = Array.isArray(leaderResponse.data)
                    ? leaderResponse.data[0]
                    : leaderResponse.data;
      if (!leader) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        }
      }

      const roadmapResponse = await this.roadmapService.findOneById(createTimelineDto.roadmap);
      const roadmap = Array.isArray(roadmapResponse.data) 
                      ? roadmapResponse.data[0] 
                      : roadmapResponse.data;
      
      if (!roadmap) { 
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null
        }
      }
      
      const timeline = await this.timelineRepository.create({
        ...createTimelineDto,
        roadmap: roadmap,
        creator: leader,
      });
      const result = await this.timelineRepository.save(timeline);
      return {
        statusCode: 201,
        message: 'Create timeline successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when creating timeline'
      }
    }
  }

  async findAll(
    page: number ,
    limit: number,
  ): Promise<ResponseDto> {
    try {
      const timelines = await this.timelineRepository
                        .createQueryBuilder('timeline')
                        .leftJoinAndSelect('timeline.creator', 'creator')
                        .where('timeline.isActive = :isActive', { isActive: 1 })
                        .andWhere('timeline.deletedAt is null')
                        .orderBy('timeline.createdAt', 'DESC')
                        .skip((page - 1) * limit)  
                        .take(limit)                
                        .getMany();
      if (timelines.length === 0) {
        return {
          statusCode: 404,
          message: 'Timelines not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get list of timelines successfully',
        data: timelines,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when finding all timelines'
      }
    }
  }

  async findOneById(
    id: number
  ): Promise<ResponseDto>  {
    try {
      const timeline = await this.timelineRepository
                      .createQueryBuilder('timeline')
                      .leftJoinAndSelect('timeline.roadmap', 'roadmap')
                      .leftJoinAndSelect('timeline.creator', 'creator')
                      .where('timeline.id = :id', { id })
                      .andWhere('timeline.isActive = :isActive', { isActive: true })
                      .andWhere('timeline.deletedAt is null') 
                      .getOne(); 

      if (!timeline) {
        return {
          statusCode: 404,
          message: 'Timeline not found',
          data: null,
        }
      }

      return {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when finding timeline'
      }
    }
  }

  async findTimelinesByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDto> {
    try {
      const timelines = await this.timelineRepository
                                  .createQueryBuilder("timeline")
                                  .leftJoinAndSelect('timeline.roadmap', 'roadmap')
                                  .where('timeline.creatorId = :userId', {userId: userId})
                                  .andWhere('timeline.isActive = :isActive', { isActive: true })
                                  .andWhere('timeline.deletedAt is null') 
                                  .skip((page - 1) * limit)  
                                  .take(limit)
                                  .getMany()
      if (timelines.length === 0) {
        return {
          statusCode: 404,
          message: "The list of timeline of this person is not found",
          data: null
        }
      }  
      return {
        statusCode: 200,
        message: "Get list of timelines of this person successfully",
        data: timelines
      }                            
    } catch(error) {
      return {
        statusCode: 500,
        message: "The list timelines of this user is not found",
        data: null
      }
    }
  }
 
  async update(
    id: number, 
    updateTimelineDto: UpdateTimelineDto
  ): Promise<ResponseDto>  {
    const timelineResponse = await this.findOneById(id);
    const timeline = Array.isArray(timelineResponse.data)
                    ? timelineResponse.data[0]
                    : timelineResponse.data
  
    if (!timeline) {
      return {
        statusCode: 404,
        message: 'Timeline not found'
      };
    }
  
    try {
      const roadmapResponse = await this.roadmapService.findOneById(updateTimelineDto.roadmap);
      const roadmap = Array.isArray(roadmapResponse.data) 
                      ? roadmapResponse.data[0] 
                      : roadmapResponse.data;
      if (!roadmap) { 
        return {
          statusCode: 404,
          message: 'Roadmap not found'
        }
      }
      const leaderResponse = await this.userService.findOneById(updateTimelineDto.leader);
      const leader = Array.isArray(leaderResponse.data)
                    ? leaderResponse.data[0]
                    : leaderResponse.data;
      if (!leader) {
        return {
          statusCode: 404,
          message: 'User not found',
        }
      }

      const newTimeline = this.timelineRepository.create({
        ...timeline,
        ...updateTimelineDto,
        roadmap: roadmap,
        creator: leader,
      });
  
      const result = await this.timelineRepository.save(newTimeline);
  
      return {
        statusCode: 200,
        message: 'Update timeline successfully',
        data: result
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      };
    }
  }
  
  async remove(
    id: number
  ): Promise<ResponseDto> {
    const timelineResponse = await this.findOneById(id);
    const timeline = Array.isArray(timelineResponse.data)
                    ? timelineResponse.data[0]
                    : timelineResponse.data;
    if (!timeline) {
      return {
        statusCode: 404,
        message: 'Timeline not found'
      }
    }
    try {
      timeline.isActive = false;
      timeline.deletedAt = new Date();
      const result = await this.timelineRepository.save(timeline);
      return {
        statusCode: 204,
        message: 'Remove timeline successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when removing timeline'
      }
    }
  }

  async cloneRoadmap(
    roadmapId: number,
    ownerId: number
  ): Promise<ResponseDto> {
    try {
      const roadmapResponse = await this.roadmapService.findOneById(roadmapId);
      const roadmap = Array.isArray(roadmapResponse.data)
                      ? roadmapResponse.data[0]
                      : roadmapResponse.data;
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null
        }
      }
      const ownerResponse = await this.userService.findOneById(ownerId);
      const owner = Array.isArray(ownerResponse.data)
                    ? ownerResponse.data[0]
                    : ownerResponse.data;
      if (!owner) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        }
      }
      const timeline = await this.timelineRepository.create({
        title: roadmap.title,
        content: roadmap.content,
        roadmap: roadmap,
        creator: owner,
        isActive: true,
      });
      const result = await this.timelineRepository.save(timeline);

      const node = roadmap.node;
      for (let i = 0; i < node.length; i++) {
        const nodeResponse = await this.nodeService.create({
          level: node[i].level,
          xAxis: node[i].xAxis,
          yAxis: node[i].yAxis,
          type: node[i].type,
          tick: node[i].tick,
          dueTime: node[i].dueTime,
          attachFile: node[i].attachFile,
          content: node[i].content,
          detail: node[i].detail,
          timeline: result.id,
        });
        if (nodeResponse.data === null ) {
          return {
            statusCode: 500,
            message: 'Clone node on timeline error',
            data: null
          };
        }
      }

      return {
        statusCode: 201,
        message: 'Clone roadmap successfully',
        data: result,
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
