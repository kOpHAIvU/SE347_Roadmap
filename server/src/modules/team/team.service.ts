import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { TimelineService } from '../timeline/timeline.service';
import { UserService } from '../user/user.service';
import {ResponseDto} from './common/response.interface';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) 
    private readonly teamRepository: Repository<Team>,
    private readonly timelineService: TimelineService,
    private readonly userService: UserService,
  ) {}

  async create(createGroupDto: CreateTeamDto): Promise<ResponseDto> {
    const timelineResponse = await this.timelineService.findOneById(createGroupDto.timeline);
    const timeline = Array.isArray(timelineResponse.data)
                    ? timelineResponse.data[0]
                    : timelineResponse.data
    if (!timeline) {
      throw new Error('Error occurred while finding timeline');
    }
    const leaderResponse = await this.userService.findOneById(createGroupDto.leader);
    const leader = Array.isArray(leaderResponse.data)
                  ? leaderResponse.data[0]
                  : leaderResponse.data;
    if (!leader) {
      throw new Error('User not found');
    }

    try {
      const group = await this.teamRepository.create({
        ...createGroupDto,
       // timeline: timeline, 
        leader: leader 
      });
  
      const savedGroup = await this.teamRepository.save(group); 
  
      return {
        statusCode: 201,
        message: 'Group created successfully',
        data: savedGroup, 
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when creating group',
      };
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<ResponseDto> {
    try {
      const groups = await this.teamRepository
                      .createQueryBuilder('team')
                      .where('team.isActive = :isActive', { isActive: 1 })
                      .andWhere('team.deletedAt is null')
                      .orderBy('team.createdAt', 'DESC')
                      .skip((page - 1) * limit)
                      .limit(limit)
                      .getMany();
      return {
        statusCode: 200,
        message: 'Find all team successfully',
        data: groups,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when finding groups',
      };
    }
  }

  async findOneById(id: number): Promise<ResponseDto> {
    try {
      const group = await this.teamRepository
                      .createQueryBuilder('team')
                      .where('team.id = :id', { id })
                      .andWhere('team.isActive = :isActive', { isActive: 1 })
                      .andWhere('team.deletedAt is null')
                      .getOne();
      if (!group) {
        return {
          statusCode: 404,
          message: 'Team not found',
        }
      }
      return {
        statusCode: 200,
        message: 'Find team successfully',
        data: group,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when finding group',
      };
    }
  }

  async update(
    id: number, 
    updateTeamDto: UpdateTeamDto
  ): Promise<ResponseDto> {
    try {
      const leaderResponse = await this.userService.findOneById(updateTeamDto.leader);
      const leader = Array.isArray(leaderResponse.data)
                    ? leaderResponse.data[0]
                    : leaderResponse.data;
      if (!leader) {
        throw new Error('User not found');
      }
      const timelineResponse = await this.timelineService.findOneById(updateTeamDto.timeline);
      const timeline = Array.isArray(timelineResponse.data)
                      ? timelineResponse.data[0]
                      : timelineResponse.data;
      if (!timeline) {
        throw new Error('Error occurred while finding timeline');
      }
      const teamResponse = await this.findOneById(id);
      const team = Array.isArray(teamResponse.data) 
                  ? teamResponse.data[0] 
                  : teamResponse.data;
      if (!team) {
        return {
          statusCode: 404,
          message: 'Group not found',
        }
      }

      const updateTeam = await this.teamRepository.create( {
        ...team,
        leader,
        //timeline,
    })

      const result = await this.teamRepository.save(updateTeam);
      return {
        statusCode: 200,
        message: 'Update group successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to update group',
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const teamResponse = await this.findOneById(id);
      const team = Array.isArray(teamResponse.data)
                  ? teamResponse.data[0]
                  : teamResponse.data;
      if (!team) {
        return {
          statusCode: 404,
          message: 'Group not found',
        }
      }

      team.isActive = false;
      team.deletedAt = new Date();
      const result = await this.teamRepository.save(team);
      return {
        statusCode: 200,
        message: 'Delete group successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to delete group',
      }
    }
  }
}
