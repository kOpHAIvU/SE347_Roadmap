import { time } from 'console';
import { Injectable } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Progress } from './entities/progress.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupDivisionService } from '../group-division/group-division.service';
import { ResponseDto } from './common/response.dto';
import { NodeService } from '../node/node.service';

@Injectable()
export class ProgressService {

  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    private groupDivision: GroupDivisionService,
    private nodeService: NodeService,
  ) {}
  
  async create(
    createProgressDto: CreateProgressDto
  ): Promise<ResponseDto> {
    
    try {
      const groupDivisionResponse = await this.groupDivision
                                              .findOneByFullInformation(
                                                createProgressDto.teamId,
                                                createProgressDto.memberId,
                                                createProgressDto.timelineId);
      const groupDivision = Array.isArray(groupDivisionResponse.data)
                  ? groupDivisionResponse.data[0]
                  : groupDivisionResponse.data;
      if (!groupDivision) {
        return {
          statusCode: 404,
          message: 'Group division not found',
          data: null
        }
      }

      const nodeResponse = await this.nodeService.findOneById(createProgressDto.node);
      const node = Array.isArray(nodeResponse.data)
                  ? nodeResponse.data[0]
                  : nodeResponse.data;
       if (!node) {
        return {
          statusCode: 404,
          message: 'Node not found',
          data: null
        }
       }          
      const progress = await this.progressRepository.create({
        ...createProgressDto,
        node: node,
        groupDivision: groupDivision,
      });

      const savedProgress = await this.progressRepository.save(progress);

      return {
        statusCode: 201,
        message: 'Progress created successfully',
        data: savedProgress,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }

  async findAllByUser(
    userId: number,
    timelineId: number,
    teamId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const groupDivisionResponse = await this.groupDivision.findOneByFullInformation(teamId, userId, timelineId);
      if (groupDivisionResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Group division not found',
          data: null
        }
      }
      const groupDivision = Array.isArray(groupDivisionResponse.data)
                  ? groupDivisionResponse.data[0]
                  : groupDivisionResponse.data;
      const progresses = await this.progressRepository
                      .createQueryBuilder('progress')
                      .leftJoinAndSelect('progress.node', 'node')
                      .leftJoinAndSelect('progress.groupDivision', 'groupDivision')
                      .where('progress.groupDivision.id = :groupDivisionId', { groupDivisionId: groupDivision.id })
                      .andWhere('progress.deletedAt is null')
                      .orderBy('progress.createdAt', 'DESC')
                      .skip((page - 1) * limit)
                      .take(limit)
                      .getMany();
      return {
        statusCode: 200,
        message: 'Find all progress successfully',
        data: progresses,
      }
    }catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      };
    }
  }

  async findOne(
    userId: number,
    timelineId: number,
    teamId: number,
    nodeId: number
  ): Promise<ResponseDto> {
    try {
      const groupDivisionResponse = await this.groupDivision.findOneByFullInformation(teamId, userId, timelineId);
      if (groupDivisionResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Group division not found',
          data: null
        }
      }
      const groupDivision = Array.isArray(groupDivisionResponse.data)
                  ? groupDivisionResponse.data[0]
                  : groupDivisionResponse.data;
      const progress = await this.progressRepository
                      .createQueryBuilder('progress')
                      .leftJoinAndSelect('progress.node', 'node')
                      .leftJoinAndSelect('progress.groupDivision', 'groupDivision')
                      .where('progress.groupDivision.id = :groupDivisionId', { groupDivisionId: groupDivision.id })
                      .andWhere('progress.node.id = :nodeId', { nodeId: nodeId })
                      .andWhere('progress.deletedAt is null')
                      .orderBy('progress.createdAt', 'DESC')
                      .getOne();
      if (!progress) {
        return {
          statusCode: 404,
          message: 'Progress not found',
          data: null
        }
      }

      return {
        statusCode: 200,
        message: 'Progress fetched successfully',
        data: progress,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async remove(
    userId: number,
    timelineId: number,
    teamId: number,
    nodeId: number
  ): Promise<ResponseDto> {
    try{
      const progressResponse = await this.findOne(userId, timelineId, teamId, nodeId);
      const progress = Array.isArray(progressResponse.data)
                  ? progressResponse.data[0]
                  : progressResponse.data;
      if (!progress) {
        return {
          statusCode: 404,
          message: 'Progress not found',
          data: null
        }
      }

      progress.deletedAt = new Date();
      const result = await this.progressRepository.save(progress);

      return {
        statusCode: 200,
        message: 'Progress deleted successfully',
        data: result 
      }
    } catch (error){
      return {
        statusCode: 500,
        message: 'Server error when deleting progress',
        data: null,
      }
    }
  }
}
