import { Injectable, Logger } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { Timeline } from './entities/timeline.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadmapService } from '../roadmap/roadmap.service';
import {ResponseDto} from './common/response.interface'

@Injectable()
export class TimelineService {

  constructor(
    @InjectRepository(Timeline)
    private timelineRepository: Repository<Timeline>,
    private roadmapService: RoadmapService,
  ) {}

  async create(
    createTimelineDto: CreateTimelineDto
  ): Promise<ResponseDto> {
    try {
      const roadmapResponse = await this.roadmapService.findOneById(createTimelineDto.roadmap);
      const roadmap = Array.isArray(roadmapResponse.data) 
                      ? roadmapResponse.data[0] 
                      : roadmapResponse.data;
      if (!roadmap) { 
        throw new Error('Error occurred while finding roadmap');
      }
      
      const timeline = await this.timelineRepository.create({
        ...createTimelineDto,
        roadmap: roadmap,
      });
      const result = await this.timelineRepository.save(timeline);
      return {
        statusCode: 201,
        message: 'Create timeline successfully',
        data: timeline
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
                        .where('timeline.isActive = :isActive', { isActive: 1 })
                        .andWhere('timeline.deletedAt is null')
                        .orderBy('timeline.createdAt', 'DESC')
                        .skip((page - 1) * limit)  
                        .take(limit)                
                        .getMany();
      return {
        statusCode: 200,
        message: 'Get this of roadmap successfully',
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
                      .where('timeline.id = :id', { id })
                      .andWhere('timeline.isActive = :isActive', { isActive: true })
                      .andWhere('timeline.deletedAt is null') 
                      .getOne(); 

      if (!timeline) {
        return {
          statusCode: 404,
          message: 'Timeline not found'
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

  async update(
    id: number, 
    updateTimelineDto: UpdateTimelineDto
  ): Promise<ResponseDto>  {
    const timeline = await this.findOneById(id);
    Logger.log(timeline);
  
    if (!timeline.data) {
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
        throw new Error('Roadmap is not found');
      }

      const newTimeline = this.timelineRepository.create({
        ...updateTimelineDto,
        roadmap: roadmap,
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
        message: 'Server error when updating timeline',
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
}