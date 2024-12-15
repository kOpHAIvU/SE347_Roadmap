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
import { TimelineService } from '../timeline/timeline.service';
import { TeamService } from '../team/team.service';

@Injectable()
export class ProgressService {

  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    private groupDivision: GroupDivisionService,
    private timelineService: TimelineService,
    private teamService: TeamService,
    private nodeService: NodeService,
  ) {}
  
  async create(
    createProgressDto: CreateProgressDto
  ): Promise<ResponseDto> {
    
    try {
      const groupDivisionResponse = await this.groupDivision
                                              .findOneByTimeline(
                                                createProgressDto.teamId,
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

      const timelineResponse = await this.timelineService.findOneById(createProgressDto.timelineId);
      const timeline = Array.isArray(timelineResponse.data)
                  ? timelineResponse.data[0]
                  : timelineResponse.data;
      if (!timeline) {
        return {
          statusCode: 404,
          message: 'Timeline not found',
          data: null
        }
      }
      const teamResponse = await this.teamService.findOneById(createProgressDto.teamId);
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
        timeline,
        team,
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

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const progresses = await this.progressRepository
                      .createQueryBuilder('progress')
                      .leftJoinAndSelect('progress.node', 'node')
                      .leftJoinAndSelect('progress.timeline', 'timeline')
                      .leftJoinAndSelect('progress.team', 'team')
                      .where('progress.deletedAt is null')
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

  async findAllByTimeline(
    timelineId: number,
    teamId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const groupDivisionResponse = await this.groupDivision.findOneByTimeline(teamId, timelineId);
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

  async findProgressOfUser(
    idUser: number,
    timelineId,
    teamId,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const groupDivisionResponse = await this.groupDivision.findOneByFullInformation(idUser, teamId, timelineId)
      if (groupDivisionResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Group division not found',
          data: null
        }
      }
      const progresses = await this.progressRepository
                      .createQueryBuilder('progress')
                      .leftJoinAndSelect('progress.node', 'node')
                      .leftJoinAndSelect('progress.timeline', 'timeline')
                      .leftJoinAndSelect('progress.team', 'team')
                      .andWhere('progress.deletedAt is null')
                      .orderBy('progress.createdAt', 'DESC')
                      .skip((page - 1) * limit)
                      .take(limit)
                      .getMany();
      if (!progresses) {
        return {
          statusCode: 404,
          message: 'Progress not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Progress fetched successfully',
        data: progresses
      }
      
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findOne(
    timelineId: number,
    teamId: number,
    nodeId: number
  ): Promise<ResponseDto> {
    try {
      const groupDivisionResponse = await this.groupDivision.findOneByTimeline(teamId, timelineId);
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

  // async remove(
  //   timelineId: number,
  //   teamId: number,
  //   nodeId: number
  // ): Promise<ResponseDto> {
  //   try{
  //     const progressResponse = await this.findOne(timelineId, teamId, nodeId);
  //     const progress = Array.isArray(progressResponse.data)
  //                 ? progressResponse.data[0]
  //                 : progressResponse.data;
  //     if (!progress) {
  //       return {
  //         statusCode: 404,
  //         message: 'Progress not found',
  //         data: null
  //       }
  //     }

  //     progress.deletedAt = new Date();
  //     const result = await this.progressRepository.save(progress);

  //     return {
  //       statusCode: 200,
  //       message: 'Progress deleted successfully',
  //       data: result 
  //     }
  //   } catch (error){
  //     return {
  //       statusCode: 500,
  //       message: 'Server error when deleting progress',
  //       data: null,
  //     }
  //   }
  // }

  async findOneById(
    id: number
  ): Promise<ResponseDto> {
    try {
      const progress = await this.progressRepository
                      .createQueryBuilder('progress')
                      .leftJoinAndSelect('progress.node', 'node')
                      .leftJoinAndSelect('progress.timeline', 'timeline')
                      .leftJoinAndSelect('progress.team', 'team')
                      .where('progress.id = :id', { id: id })
                      .andWhere('progress.deletedAt is null')
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
    id: number
  ): Promise<ResponseDto> {
    try {
      const progressResponse = await this.findOneById(id);
      const progress = Array.isArray(progressResponse.data)
                  ? progressResponse.data[0]
                  : progressResponse.data
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
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when deleting progress',
      }
    }
  } 
}
