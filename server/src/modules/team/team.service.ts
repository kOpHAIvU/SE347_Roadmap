import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { TimelineService } from '../timeline/timeline.service';
import { UserService } from '../user/user.service';
import { ResponseDto } from './common/response.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private readonly teamRepository: Repository<Team>,
        private readonly userService: UserService,
        private readonly cloudinary: CloudinaryService,
    ) {}

    async create(createGroupDto: CreateTeamDto, file?: Express.Multer.File): Promise<ResponseDto> {
        const leaderResponse = await this.userService.findOneById(createGroupDto.leader);
        const leader = Array.isArray(leaderResponse.data) ? leaderResponse.data[0] : leaderResponse.data;
        if (!leader) {
            throw new Error('User not found');
        }

        let avatarUrl: string = '';
        try {
            if (file) {
                const uploadResponse = await this.cloudinary.uploadImage(file);
                avatarUrl = uploadResponse.secure_url.toString() + ' ' + uploadResponse.public_id.toString();
            }
        } catch (error) {
            throw new Error(error);
        }

        try {
            const group = await this.teamRepository.create({
                ...createGroupDto,
                leader: leader,
                avatar: avatarUrl || '',
            });

            const savedGroup = await this.teamRepository.save(group);
            console.log('File', avatarUrl);
            return {
                statusCode: 200,
                message: 'Group created successfully',
                data: savedGroup,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    async findAll(page: number, limit: number): Promise<ResponseDto> {
        try {
            const groups = await this.teamRepository
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.leader', 'leader')
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
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Server error when finding groups',
                data: null,
            };
        }
    }

    async findOneById(id: number): Promise<ResponseDto> {
        try {
            const group = await this.teamRepository
                .createQueryBuilder('team')
                .leftJoinAndSelect('team.leader', 'leader')
                .where('team.id = :id', { id })
                .andWhere('team.isActive = :isActive', { isActive: 1 })
                .andWhere('team.deletedAt is null')
                .getOne();
            if (!group) {
                return {
                    statusCode: 404,
                    message: 'Team not found',
                    data: null,
                };
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
                data: null,
            };
        }
    }

    async update(id: number, updateTeamDto: UpdateTeamDto, file?: Express.Multer.File): Promise<ResponseDto> {
        try {
            const leaderResponse = await this.userService.findOneById(updateTeamDto.leader);
            const leader = Array.isArray(leaderResponse.data) ? leaderResponse.data[0] : leaderResponse.data;
            if (!leader) {
                throw new Error('User not found');
            }
            const teamResponse = await this.findOneById(id);
            const team = Array.isArray(teamResponse.data) ? teamResponse.data[0] : teamResponse.data;
            if (!team) {
                return {
                    statusCode: 404,
                    message: 'Group not found',
                    data: null,
                };
            }

            let public_id: string, secure_url: string;
            let avatarUrl: string = null;
            if (file) {
                console.log('Come here');
                const url = team.avatar.split(' ');
                public_id = url[1];
                secure_url = url[0];
                console.log('The split avatar: ', public_id + '   ' + secure_url);
                try {
                    const deleteResponse = await this.cloudinary.deleteImage(public_id);
                } catch (error) {
                    throw new Error(error);
                }
                const uploadResponse = await this.cloudinary.uploadImage(file);
                avatarUrl = uploadResponse.secure_url.toString() + ' ' + uploadResponse.public_id.toString();
            }

            let updateTeam;
            if (avatarUrl !== null) {
                updateTeam = await this.teamRepository.create({
                    ...team,
                    ...updateTeamDto,
                    leader,
                    avatar: avatarUrl || null,
                });
            } else {
                updateTeam = await this.teamRepository.create({
                    ...team,
                    ...updateTeamDto,
                    leader,
                });
            }

            const result = await this.teamRepository.save(updateTeam);
            return {
                statusCode: 200,
                message: 'Update group successfully',
                data: result,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Failed to update group',
                data: null,
            };
        }
    }

    async remove(id: number, file?: Express.Multer.File): Promise<ResponseDto> {
        try {
            const teamResponse = await this.findOneById(id);
            const team = Array.isArray(teamResponse.data) ? teamResponse.data[0] : teamResponse.data;
            if (!team) {
                return {
                    statusCode: 404,
                    message: 'Group not found',
                    data: null,
                };
            }
            const url = team.avatar.split(' ');
            const public_id = url[1];
            try {
                const deleteResponse = await this.cloudinary.deleteImage(public_id);
            } catch (error) {
                throw new Error(error);
            }

            team.isActive = false;
            team.deletedAt = new Date();
            const result = await this.teamRepository.save(team);
            return {
                statusCode: 200,
                message: 'Delete group successfully',
                data: result,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Failed to delete group',
                data: null,
            };
        }
    }
}
