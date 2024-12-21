import { Injectable } from '@nestjs/common';
import { CreateGroupDivisionDto } from './dto/create-group-division.dto';
import { UpdateGroupDivisionDto } from './dto/update-group-division.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupDivision } from './entities/group-division.entity';
import { TimelineService } from '../timeline/timeline.service';
import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import { ResponseDto } from './common/response.interface';
import { group } from 'console';
import { ppid } from 'process';

@Injectable()
export class GroupDivisionService {
    constructor(
        @InjectRepository(GroupDivision)
        private groupDivisionRepository: Repository<GroupDivision>,
        private teamService: TeamService,
        private userService: UserService,
        private timelineService: TimelineService,
    ) {}

    async create(createGroupDivisionDto: CreateGroupDivisionDto): Promise<ResponseDto> {
        try {
            const teamResponse = await this.teamService.findOneById(createGroupDivisionDto.teamId);
            const team = Array.isArray(teamResponse.data) ? teamResponse.data[0] : teamResponse.data;
            if (!team) {
                return {
                    statusCode: 404,
                    message: 'Team not found',
                    data: null,
                };
            }

            const userResponse = await this.userService.findOneById(createGroupDivisionDto.userId);
            const user = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                    data: null,
                };
            }

            const timelineResponse = await this.timelineService.findOneById(createGroupDivisionDto.timelineId);
            const timeline = Array.isArray(timelineResponse.data) ? timelineResponse.data[0] : timelineResponse.data;
            if (!timeline) {
                return {
                    statusCode: 404,
                    message: 'Timeline not found',
                    data: null,
                };
            }

            const groupDivision = await this.groupDivisionRepository.create({
                ...createGroupDivisionDto,
                team: team,
                user: user,
                timeline: timeline,
            });

            const savedGroupDivision = await this.groupDivisionRepository.save(groupDivision);

            return {
                statusCode: 201,
                message: 'GroupDivision created successfully',
                data: savedGroupDivision,
            };
        } catch (err) {
            return {
                statusCode: 500,
                message: 'Server error when creating groupDivision',
                data: null,
            };
        }
    }

    async findAll(page: number = 1, limit: number = 10): Promise<ResponseDto> {
        try {
            const groupDivisions = await this.groupDivisionRepository
                .createQueryBuilder('groupDivision')
                .leftJoinAndSelect('groupDivision.team', 'team')
                .leftJoinAndSelect('groupDivision.user', 'user')
                .leftJoinAndSelect('groupDivision.timeline', 'timeline')
                .where('team.isActive = :isActive', { isActive: 1 })
                .andWhere('team.deletedAt is null')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();
            if (groupDivisions.length === 0) {
                return {
                    statusCode: 404,
                    message: 'GroupDivision not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Find all groupDivisions successfully',
                data: groupDivisions,
            };
        } catch (err) {
            return {
                statusCode: 500,
                message: 'Server error when finding groupDivisions',
                data: null,
            };
        }
    }

    async findOneById(id: number): Promise<ResponseDto> {
        try {
            const groupDivision = await this.groupDivisionRepository
                .createQueryBuilder('groupDivision')
                .leftJoinAndSelect('groupDivision.team', 'team')
                .leftJoinAndSelect('groupDivision.user', 'user')
                .leftJoinAndSelect('groupDivision.timeline', 'timeline')
                .where('groupDivision.id = :id', { id })
                .andWhere('groupDivision.deletedAt is null')
                .getOne();
            if (!groupDivision) {
                return {
                    statusCode: 404,
                    message: 'GroupDivision not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Get groupDivision successfully',
                data: groupDivision,
            };
        } catch (err) {
            return {
                statusCode: 500,
                message: err.message,
                data: null,
            };
        }
    }

    async findOneByFullInformation(userId: number, teamId: number, timelineId: number): Promise<ResponseDto> {
        try {
            console.log(userId, teamId, timelineId);
            const groupDivision = await this.groupDivisionRepository
                .createQueryBuilder('groupDivision')
                .leftJoinAndSelect('groupDivision.team', 'team')
                .leftJoinAndSelect('groupDivision.user', 'user')
                .leftJoinAndSelect('groupDivision.timeline', 'timeline')
                .where('team.id = :teamId', { teamId })
                .andWhere('user.id = :userId', { userId })
                .andWhere('timeline.id = :timelineId', { timelineId })
                .andWhere('groupDivision.deletedAt is null')
                .getOne();
            if (!groupDivision) {
                return {
                    statusCode: 404,
                    message: 'Group division not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Get group division successfully',
                data: groupDivision,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    async findOneByTimeline(teamId: number, timelineId: number): Promise<ResponseDto> {
        try {
            const groupDivision = await this.groupDivisionRepository
                .createQueryBuilder('groupDivision')
                .leftJoinAndSelect('groupDivision.team', 'team')
                .leftJoinAndSelect('groupDivision.user', 'user')
                .leftJoinAndSelect('groupDivision.timeline', 'timeline')
                .where('team.id = :teamId', { teamId })
                .andWhere('timeline.id = :timelineId', { timelineId })
                .andWhere('groupDivision.deletedAt is null')
                .getOne();
            if (!groupDivision) {
                return {
                    statusCode: 404,
                    message: 'Group division not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Get group division successfully',
                data: groupDivision,
            };
        } catch (err) {
            return {
                statusCode: 500,
                message: 'Server error when finding groupDivision',
                data: null,
            };
        }
    }

    async findAllByUser(idUser: number): Promise<ResponseDto> {
        try {
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    async update(id: number, updateGroupDivisionDto: UpdateGroupDivisionDto): Promise<ResponseDto> {
        try {
            const groupDivisionResponse = await this.findOneById(id);
            if (groupDivisionResponse.statusCode !== 200) {
                return {
                    statusCode: 404,
                    message: 'GroupDivision not found',
                    data: null,
                };
            }
            const groupDivision = Array.isArray(groupDivisionResponse.data)
                ? groupDivisionResponse.data[0]
                : groupDivisionResponse.data;
            const newGroupDivision = this.groupDivisionRepository.create({
                ...groupDivision,
                role: updateGroupDivisionDto.role,
            });
            const result = await this.groupDivisionRepository.save(newGroupDivision);
            return {
                statusCode: 200,
                message: 'Update groupDivision successfully',
                data: result,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    // async update(
    //   id: number,
    //   updateGroupDivisionDto: UpdateGroupDivisionDto
    // ): Promise<ResponseDto> {
    //   try {
    //     const groupDivision = await this.findOneById(id);
    //     if (groupDivision.statusCode !== 200) {
    //       return {
    //         statusCode: 404,
    //         message: 'GroupDivision not found',
    //         data: null
    //       };
    //     }

    //     const teamResponse = await this.teamService.findOneById(updateGroupDivisionDto.teamId);
    //     const team = Array.isArray(teamResponse.data)
    //                 ? teamResponse.data[0]
    //                 : teamResponse.data;
    //     if (!team) {
    //       return {
    //         statusCode: 404,
    //         message: 'Team not found',
    //         data: null
    //       }
    //     }

    //     const userResponse = await this.userService.findOneById(updateGroupDivisionDto.userId);
    //     const user = Array.isArray(userResponse.data)
    //                 ? userResponse.data[0]
    //                 : userResponse.data;
    //     if (!user) {
    //       return {
    //         statusCode: 404,
    //         message: 'User not found',
    //         data: null
    //       }
    //     }

    //     const timelineResponse = await this.timelineService.findOneById(updateGroupDivisionDto.timelineId);
    //     const timeline = Array.isArray(timelineResponse.data)
    //                     ? timelineResponse.data[0]
    //                     : timelineResponse.data;
    //     if (!timeline) {
    //       return {
    //         statusCode: 404,
    //         message: 'Timeline not found',
    //         data: null
    //       }
    //     }
    //     const newGroupDivision = this.groupDivisionRepository.create({
    //       id,
    //       ...updateGroupDivisionDto,
    //       team,
    //       user,
    //       timeline,
    //     })
    //     const result = await this.groupDivisionRepository.save(newGroupDivision);

    //     if (!result) {
    //       return {
    //         statusCode: 500,
    //         message: 'Server error when updating groupDivision',
    //         data: null
    //       }
    //     }

    //     return {
    //       statusCode: 200,
    //       message: 'Update groupDivision successfully',
    //       data: result
    //     }
    //   } catch(err) {
    //     return {
    //       statusCode: 500,
    //       message: 'Server error when updating groupDivision',
    //       data: null
    //     }
    //   }
    // }

    async remove(id: number): Promise<ResponseDto> {
        try {
            const groupDivisionResponse = await this.findOneById(id);
            const groupDivision = Array.isArray(groupDivisionResponse.data)
                ? groupDivisionResponse.data[0]
                : groupDivisionResponse.data;
            if (!groupDivision) {
                return {
                    statusCode: 404,
                    message: 'GroupDivision not found',
                    data: null,
                };
            }

            groupDivision.deletedAt = new Date();
            const result = await this.groupDivisionRepository.save(groupDivision);
            if (!result) {
                return {
                    statusCode: 500,
                    message: 'Server error when removing groupDivision',
                    data: null,
                };
            }
            return {
                statusCode: 204,
                message: 'Remove groupDivision successfully',
                data: result,
            };
        } catch (err) {
            return {
                statusCode: 500,
                message: 'Server error when removing groupDivision',
                data: null,
            };
        }
    }

    async getAllGroupDivisionByUserId(userId: number, page: number = 1, limit: number = 10): Promise<ResponseDto> {
        try {
            const groupDivisions = await this.groupDivisionRepository
                .createQueryBuilder('groupDivision')
                .leftJoinAndSelect('groupDivision.team', 'team')
                .leftJoinAndSelect('groupDivision.user', 'user')
                .leftJoinAndSelect('groupDivision.timeline', 'timeline')
                .where('user.id = :userId', { userId })
                .andWhere('groupDivision.deletedAt is null')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();
            if (groupDivisions.length === 0) {
                return {
                    statusCode: 404,
                    message: 'GroupDivision not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Find all groupDivisions successfully',
                data: groupDivisions,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    async getAllGroupDivisionByTeamId(teamId: number): Promise<ResponseDto> {
        try {
            const groupDivisions = await this.groupDivisionRepository
                .createQueryBuilder('groupDivision')
                .leftJoinAndSelect('groupDivision.team', 'team')
                .leftJoinAndSelect('groupDivision.user', 'user')
                .leftJoinAndSelect('groupDivision.timeline', 'timeline')
                .where('team.id = :teamId', { teamId })
                .andWhere('groupDivision.deletedAt is null')
                .getMany();
            if (groupDivisions.length === 0) {
                return {
                    statusCode: 404,
                    message: 'GroupDivision not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Find all groupDivisions successfully',
                data: groupDivisions,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }
}
