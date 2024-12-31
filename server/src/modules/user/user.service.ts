import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../auth/dto/login-dto';
import { ResponseDto } from './common/response.interface';
import { RoleService } from '../role/role.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly roleService: RoleService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async create(createUserDto: CreateUserDto, file?: Express.Multer.File): Promise<User> {
        const roleResponse = await this.roleService.findOne(createUserDto.role);
        if (roleResponse.statusCode == 404 || roleResponse.statusCode == 500) {
            throw new UnauthorizedException('Role is not found');
        }

        console.log('File to upload:', file);
        let avatarUrl: string;
        try {
            if (typeof createUserDto.avatar !== 'undefined') {
                const uploadResponse = await this.cloudinaryService.uploadImage(file);
                avatarUrl = uploadResponse.secure_url.toString() + ' ' + uploadResponse.public_id.toString();
            }
        } catch (error) {
            throw new Error(error);
        }

        console.log('Role response:', roleResponse);
        let user: User = null;
        if (createUserDto.password) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
            user = await this.usersRepository.create({
                ...createUserDto,
                role: roleResponse.data,
                password: hashedPassword,
                avatar: avatarUrl || null,
            });
        } else {
            user = await this.usersRepository.create({
                ...createUserDto,
                role: roleResponse.data,
            });
        }
        console.log('User:', user);

        const userSaved = await this.usersRepository.save(user);
        delete userSaved.password;
        return userSaved;
    }

    async findOne(loginDto: LoginDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({
            username: loginDto.username,
        });
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }

    async findOneById(id: number): Promise<ResponseDto> {
        try {
            console.log('Id of user get profile: ', id);
            //const user = await this.usersRepository.findOne({where: {id}});
            const user = await this.usersRepository
                .createQueryBuilder('user')
                .select([
                    'user.id',
                    'user.username',
                    'user.fullName',
                    'user.gender',
                    'user.email',
                    'user.avatar',
                    'user.role',
                    'user.deviceToken',
                ])
                .leftJoinAndSelect('user.role', 'role')
                .where('user.id = :id', { id })
                .andWhere('user.isActive = :isActive', { isActive: true })
                .andWhere('user.deletedAt is null')
                .getOne();
            console.log('Leader is: ', user);
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                    data: null,
                };
            }

            return {
                statusCode: 200,
                message: 'Get user successfully',
                data: user,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Server error when getting user',
                data: null,
            };
        }
    }

    async findByEmail(email: string): Promise<ResponseDto> {
        try {
            //const user = await this.usersRepository.findOne({where: {email}});
            const user = await this.usersRepository
                .createQueryBuilder('user')
                .select([
                    'user.id',
                    'user.username',
                    'user.fullName',
                    'user.gender',
                    'user.email',
                    'user.avatar',
                    'user.role',
                    'user.deviceToken',
                ])
                .where('user.email = :email', { email })
                .andWhere('user.isActive = :isActive', { isActive: true })
                .andWhere('user.deletedAt is null')
                .getOne();
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Get user successfully',
                data: user,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Server error when getting user',
                data: [],
            };
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<ResponseDto> {
        try {
            const userResponse = await this.findOneById(id);
            if (userResponse.statusCode !== 200) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                    data: null,
                };
            }
            const user = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
            const roleResponse = await this.roleService.findOne(updateUserDto.role);
            if (roleResponse.statusCode !== 200) {
                return {
                    statusCode: 404,
                    message: 'Role not found',
                    data: null,
                };
            }
            const role = Array.isArray(roleResponse.data) ? roleResponse.data[0] : roleResponse.data;
            let public_id: string, secure_url: string, avatarUrl: string;

            if (file) {
                const url = user.avatar.split(' ');
                public_id = url[1];
                secure_url = url[0];
                let deleteResponse;
                try {
                    deleteResponse = await this.cloudinaryService.deleteImage(public_id);
                } catch {
                    throw new Error('Error when deleting image');
                }
                let uploadResponse;
                try {
                    uploadResponse = await this.cloudinaryService.uploadImage(file);
                } catch (error) {
                    throw new Error(error);
                }
                avatarUrl = uploadResponse.secure_url.toString() + ' ' + uploadResponse.public_id.toString();
            }

            const updatedUser = await this.usersRepository.create({
                ...user,
                ...updateUserDto,
                role: role,
                avatar: avatarUrl,
            });
            const result = await this.usersRepository.save(updatedUser);
            return {
                statusCode: 200,
                message: 'Update user successfully',
                data: updatedUser,
            };
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
    ): Promise<{
        statusCode: number;
        message: string;
        data: {
            total: number;
            users: User[];
        }
    }> {
        try {
            const users = await this.usersRepository
                .createQueryBuilder('user')
                .select([
                    'user.id',
                    'user.username',
                    'user.fullName',
                    'user.gender',
                    'user.email',
                    'user.avatar',
                    'user.role',
                    'user.deviceToken',
                ])
                .where('user.isActive = :isActive', { isActive: true })
                .andWhere('user.deletedAt is null')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();
            const total = await this.usersRepository
                .createQueryBuilder('user')
                .where('user.isActive = :isActive', { isActive: true })
                .andWhere('user.deletedAt is null')
                .getCount();
            if (!users) {
                return {
                    statusCode: 404,
                    message: 'User not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Get user successfully',
                data: {
                    total,
                    users,
                },
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    async remove(id: number): Promise<ResponseDto> {
        try {
            const userResponse = await this.findOneById(id);
            if (userResponse.statusCode !== 200) {
                return {
                    statusCode: 404,
                    message: 'User not found when deleting user',
                    data: null,
                };
            }
            const user = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
            const url = user.avatar.split(' ');
            const public_id = url[1];

            try {
                const deleteResponse = await this.cloudinaryService.deleteImage(public_id);
            } catch (error) {
                throw new Error(error);
            }
            user.email = "";
            user.deletedAt = new Date();
            user.isActive = false;

            const result = await this.usersRepository.save(user);
            return {
                statusCode: 200,
                message: 'Delete user successfully',
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

    async findUserByName(
        name: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<{
        status: number,
        message: string,
        data: {
            total: number,
            users: User[],
        }
    }> {
        try {
            const users = await this.usersRepository
                .createQueryBuilder('user')
                .select([
                    'user.id',
                    'user.username',
                    'user.fullName',
                ])
                .where('user.fullName like :name', { name: `%${name}%` })
                .andWhere('user.isActive = :isActive', { isActive: true })
                .andWhere('user.deletedAt is null')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();
            if (!users) {
                return {
                    status: 404,
                    message: 'User not found',
                    data: null,
                }
            }
            const total = await this.usersRepository
                .createQueryBuilder('user')
                .where('user.fullName like :name', { name: `%${name}%` })
                .andWhere('user.isActive = :isActive', { isActive: true })
                .andWhere('user.deletedAt is null')
                .getCount();
            return {
                status: 200,
                message: 'Get user successfully',
                data: {
                    total,
                    users,
                },
            }
        } catch(error) {
            return {
                status: 500,
                message: error.message,
                data: null,
            }
        }
    }
}
