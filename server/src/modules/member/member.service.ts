import { Injectable, Logger } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import {ResponseDto} from './common/response.interface';

@Injectable()
export class MemberService {

  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private userService: UserService,
    private teamService: TeamService,
  ) {}

  async checkMemberExistInTeam(
    memberId: number,
    teamId: number,
  ): Promise<ResponseDto> {
    try {
      const member = await this.memberRepository
                    .createQueryBuilder('member')
                    .where('member.memberId = :memberId', { memberId })
                    .andWhere('member.teamId = :teamId', { teamId })
                    .andWhere('member.isActive = :isActive', { isActive: 1 })
                    .andWhere('member.deletedAt is null')
                    .getOne();
      if (!member) {
        return {
          statusCode: 404,
          message: 'false',
        }
      }
      return {
        statusCode: 200,
        message: 'true',
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to check member exist in team',
      }
    }
  }

  async create(
    createMemberDto: CreateMemberDto
  ): Promise<ResponseDto> {
     try {
      const checkMemberExistInTeam = await this.checkMemberExistInTeam(createMemberDto.member, createMemberDto.team);
      if (checkMemberExistInTeam.statusCode === 200) {
        return {
          statusCode: 400,
          message: 'Member already exist in team',
        }
      }
      const userResponse = await this.userService.findOneById(createMemberDto.member);
      const user = Array.isArray(userResponse)
                  ? userResponse[0]
                  : userResponse;
      if (!user) {
        throw new Error('User not found');
      }
      const teamResponse = await this.teamService.findOneById(createMemberDto.team);
      const team = Array.isArray(teamResponse)
                  ? teamResponse[0]
                  : teamResponse;
      if (!team) {
        throw new Error('Team not found');
      }

    //   const roadmap = this.roadmapRepository.create({
    //     ...createRoadmapDto,
    //     owner, 
    // });

      const division = await this.memberRepository.create({
        ...createMemberDto,
        member: user,
        team,
      })
      const result = await this.memberRepository.save(division);
      return {
        statusCode: 201,
        message: 'Create member successfully',
        data: result,
      }
     } catch (error) {
        return {
          statusCode: 500,
          message: 'Failed to create member',
        }
     }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const members = await this.memberRepository
                      .createQueryBuilder('member')
                      .where('member.isActive = :isActive', { isActive: 1 })
                      .andWhere('member.deletedAt is null')
                      .skip((page - 1) * limit)
                      .take(limit)
                      .getMany();
      return {
        statusCode: 200,
        message: 'Find all members successfully',
        data: members,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to find all members',
      }
    }
  }

  async findOneById(
    id: number
  ): Promise<any> {
    try {
      const division = await this.memberRepository
                        .createQueryBuilder('member')
                        .where('member.id = :id', { id })
                        .andWhere('member.isActive = :isActive', { isActive: 1 })
                        .andWhere('member.deletedAt is null')
                        .getOne();
      if(!division) {
        return {
          statusCode: 404,
          message: 'Member not found',
        }
      }
      return {
        statusCode: 200,
        message: 'Find member successfully',
        data: division,
      }
    } catch (error) {
      return {
        error: error.message,
        statusCode: 500,
        message: 'Failed to find member',
      }
    }
  }

  async update(
    id: number, 
    updateMemberDto: UpdateMemberDto
  ): Promise<ResponseDto> {
    try {
        const userResponse = await this.userService.findOneById(updateMemberDto.member);
        const user = Array.isArray(userResponse)
                    ? userResponse[0]
                    : userResponse;
        if (!user) {
          return {
            statusCode: 404,
            message: 'User not found',
          }
        }
        const teamResponse = await this.teamService.findOneById(updateMemberDto.team);
        const team = Array.isArray(teamResponse)
                    ? teamResponse[0]
                    : teamResponse;
        if (!team.data) {
          return {
            statusCode: 404,
            message: 'Team not found',
          }
        }
        const memberResponse = await this.findOneById(id);
        const member = Array.isArray(memberResponse)
                    ? memberResponse[0]
                    : memberResponse;
        if (!member.data) {
          return {
            statusCode: 404,
            message: 'Member not found',
          }
        }
        const updatedMember = this.memberRepository.merge(member.data, {
          ...updateMemberDto,
          member: user.data,
          team: team.data,
        });
        const result = await this.memberRepository.save(updatedMember);
        return {
          statusCode: 200,
          message: 'Update member successfully',
          data: result,
        }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update member',
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const member = await this.findOneById(id);
      if (!member.data) {
        return {
          statusCode: 404,
          message: 'Member not found',
        }
      }
      member.data.isActive = false;
      member.data.deletedAt = new Date();
      const result = await this.memberRepository.save(member.data);
      return {
        statusCode: 200,
        message: 'Remove member successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to remove member',
      }
    }
  }
}