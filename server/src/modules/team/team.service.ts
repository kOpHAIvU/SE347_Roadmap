import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { TimelineService } from '../timeline/timeline.service';
import { UserService } from '../user/user.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) 
    private readonly teamRepository: Repository<Team>,
    private readonly timelineService: TimelineService,
    private readonly userService: UserService,
  ) {}

  async create(createGroupDto: CreateTeamDto): Promise<any> {
    const timeline = await this.timelineService.findOneById(createGroupDto.timeline);
    if (!timeline.data) {
      throw new Error('Error occurred while finding timeline');
    }
    const leader = await this.userService.findOneById(createGroupDto.leader);
    if (!leader) {
      throw new Error('User not found');
    }

    try {
      const group = await this.teamRepository.create({
        ...createGroupDto,
        timeline: timeline.data, 
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
        error: error.message,
        statusCode: 500,
        message: 'Server error when creating group',
      };
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<any> {
    try {
      const groups = await this.teamRepository
                      .createQueryBuilder('team')
                      .where('team.isActive = :isActive', { isActive: 1 })
                      .andWhere('team.deletedAt is null')
                      .orderBy('team.createdAt', 'DESC')
                      .skip((page - 1) * limit)
                      .limit(limit)
                      .getManyAndCount();
      return {
        statusCode: 200,
        message: 'Find all team successfully',
        data: groups,
      }
    } catch(error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Server error when finding groups',
      };
    }
  }

  async findOneById(id: number): Promise<any> {
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
        error: error.message,
        statusCode: 500,
        message: 'Server error when finding group',
      };
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    try {
      const leader = await this.userService.findOneById(updateTeamDto.leader);
      if (!leader) {
        throw new Error('User not found');
      }
      const timeline = await this.timelineService.findOneById(updateTeamDto.timeline);
      if (!timeline.data) {
        throw new Error('Error occurred while finding timeline');
      }
      const team = await this.findOneById(id);
      if (!team.data) {
        return {
          statusCode: 404,
          message: 'Group not found',
        }
      }
      const updatedTeam = this.teamRepository.merge(team.data, {
        ...updateTeamDto,
        leader: leader,
        timeline: timeline.data,
      });
      const result = await this.teamRepository.save(updatedTeam);
      return {
        statusCode: 200,
        message: 'Update group successfully',
        result: result,
      }
    } catch(error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Failed to update group',
      }
    }
  }

  async remove(id: number) {
    try {
      const team = await this.findOneById(id);
      if (!team.data) {
        return {
          statusCode: 404,
          message: 'Group not found',
        }
      }
      team.data.isActive = false;
      team.data.deletedAt = new Date();
      const result = await this.teamRepository.save(team.data);
      return {
        statusCode: 200,
        message: 'Delete group successfully',
        result: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to delete group',
      }
    }
  }
}
