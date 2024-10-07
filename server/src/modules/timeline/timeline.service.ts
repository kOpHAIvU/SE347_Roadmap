import { Injectable, Logger } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { Timeline } from './entities/timeline.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoadmapService } from '../roadmap/roadmap.service';

@Injectable()
export class TimelineService {

  constructor(
    @InjectRepository(Timeline)
    private timelineRepository: Repository<Timeline>,
    private roadmapService: RoadmapService,
  ) {}

  async create(createTimelineDto: CreateTimelineDto): Promise<any> {
    try {
      const roadmap = await this.roadmapService.findOneById(createTimelineDto.roadmap);
      if (!roadmap.data) { 
        throw new Error('Error occurred while finding roadmap');
      }
      
      const timeline = await this.timelineRepository.create({
        ...createTimelineDto,
        roadmap: roadmap.data,
      });
      const result = await this.timelineRepository.save(timeline);
      return {
        statusCode: 201,
        message: 'Create timeline successfully',
        data: {
          title: result.title,
          content: result.content,
          roadmap: {
            id: roadmap.data.id,
            code: roadmap.data.code,
            title: roadmap.data.title,
          },
        },
      }
    } catch (error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Server error when creating timeline'
      }
    }
  }

  async findAll(
    page: number ,
    limit: number,
  ): Promise<any> {
    try {
      const timelines = await this.timelineRepository
                        .createQueryBuilder('timeline')
                        .where('timeline.isActive = :isActive', { isActive: 1 })
                        .andWhere('timeline.deletedAt is null')
                        .orderBy('timeline.createdAt', 'DESC')
                        .skip((page - 1) * limit)  
                        .take(limit)                
                        .getManyAndCount();
      return {
        statusCode: 200,
        message: 'Get this of roadmap successfully',
        data: timelines,
      }
    } catch(error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Server error when finding all timelines'
      }
    }
  }

  async findOneById(id: number): Promise<any>  {
    try {
      const timeline = await this.timelineRepository
                      .createQueryBuilder('timeline')
                      .leftJoinAndSelect('timeline.roadmap', 'roadmap')
                      .where('timeline.id = :id', { id })
                      .andWhere('timeline.isActive = :isActive', { isActive: true })
                      .andWhere('timeline.deletedAt is null') 
                      .getOne(); 

      return {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline,
      }
    } catch (error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Server error when finding timeline'
      }
    }
  }

  async update(id: number, updateTimelineDto: UpdateTimelineDto): Promise<any>  {
    const timeline = await this.findOneById(id);
    Logger.log(timeline);
  
    if (!timeline.data) {
      return {
        statusCode: 404,
        message: 'Timeline not found'
      };
    }
  
    try {
      const roadmap = await this.roadmapService.findOneById(updateTimelineDto.roadmap);
      if (!roadmap.data) {
        throw new Error('Error occurred while finding roadmap');
      }
  
      const newTimeline = this.timelineRepository.merge(timeline.data, {
        ...updateTimelineDto,
        roadmap: roadmap.data,  
      });
  
      const result = await this.timelineRepository.save(newTimeline);
  
      return {
        statusCode: 200,
        message: 'Update timeline successfully',
        data: {
          title: result.title,
          content: result.content,
          roadmap: {
            id: roadmap.data.id,
            code: roadmap.data.code,
            title: roadmap.data.title,
          },
        },
      };
    } catch (error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Server error when updating timeline',
      };
    }
  }
  
  async remove(id: number): Promise<any> {
    const timeline = await this.findOneById(id);
    if (!timeline.data) {
      return {
        statusCode: 404,
        message: 'Timeline not found'
      }
    }
    try {
      timeline.data.isActive = false;
      timeline.data.deletedAt = new Date();
      const result = await this.timelineRepository.save(timeline.data);
      return {
        statusCode: 204,
        message: 'Remove timeline successfully',
        data: result,
      }
    } catch(error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Server error when removing timeline'
      }
    }
  }
}
