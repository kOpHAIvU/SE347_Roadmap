import { Inject, Injectable, Logger, Query } from '@nestjs/common';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ResponseDto } from './common/roadmap.interface';
import { ClientProxy } from '@nestjs/microservices';
import {env} from '../../configs/env.config';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class RoadmapService {


  constructor(
    @Inject("RoadmapConfiguration") private rabbitClient: ClientProxy,
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,
    private userService: UserService,
    private configService: ConfigService,
    private cloudinary: CloudinaryService
  ) {}
  
  async create(
    createRoadmapDto: CreateRoadmapDto,
    file: Express.Multer.File,
  ): Promise<ResponseDto>{
    try {
      const ownerResponse = await this.userService.findOneById(createRoadmapDto.owner); 
      const owner = Array.isArray(ownerResponse.data)
                    ? ownerResponse.data[0]
                    : ownerResponse.data;
      console.log("Avatar of roadmap", file);
      let avatarUrl: string;
      try {
        if (file) {
          const uploadResponse = await this.cloudinary.uploadImage(file);
          avatarUrl = uploadResponse.secure_url.toString() + " " + uploadResponse.public_id.toString();

        }
      } catch(error) {
        throw new Error(error);
      }
      const roadmap = this.roadmapRepository.create({
          ...createRoadmapDto,
          owner, 
          avatar: avatarUrl || null,
      });

      if (!roadmap) {
        return {
          statusCode: 500,
          message: 'Failed to create roadmap'
        }
      }

      const lastCode = await this.findTheLastCodeOfRoadmap();
      const newCode = `RMIT${lastCode + 1}`;
      roadmap.code = newCode;

      console.log("Connection is");
      console.log(this.configService.get<string>('URL'));

      const result = await this.roadmapRepository.save(roadmap); 
     // console.log("Owner:", result.owner.role.id)
     console.log("Owner:", result.owner)
      if (result.owner.role.id === 1) {
        console.log("Owner is admin");
        console.log(env.RABBITMQ.NAME);
        try {
          await this.rabbitClient.connect();

        } catch (error) {
          console.log("Error connect rabbitmq: ", error);
        }

        console.log("Result send data to rabbitMQ: ");
        const rabbit = this.rabbitClient.emit("Create_new_roadmap", result);

      }
      return {
        statusCode: 201,
        message: 'Create roadmap successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
      }
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    idUser: number
  ): Promise<ResponseDto> {
    try {

      const userResponse = await this.userService.findOneById(idUser);
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null,
        }
      }
    const user = Array.isArray(userResponse.data)
                ? userResponse.data[0]
                : userResponse.data;
    console.log("UUser send request: ", user);
      let roadmap: Roadmap[], totalRecord: number;
      if (user.role.id === 1) {
        // role is admin
        roadmap = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .leftJoinAndSelect('roadmap.owner', 'owner')
                      .leftJoinAndSelect('roadmap.node', 'node')
                      .leftJoinAndSelect('owner.comment', 'comment')
                      .where("roadmap.isActive = :isActive", { isActive: true })
                      .andWhere('roadmap.deletedAt is null')
                      .orderBy('roadmap.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
        totalRecord = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .getCount();  
      // role is user
      } else {
        roadmap = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .leftJoinAndSelect('roadmap.owner', 'owner')
                      .leftJoinAndSelect('roadmap.node', 'node')
                      .leftJoinAndSelect('owner.comment', 'comment')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .andWhere('roadmap.owner = :owner', { owner: user.id })
                      .andWhere('roadmap.isPublic = :isPublic', { isPublic: true })
                      .orderBy('roadmap.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
        totalRecord = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .andWhere('roadmap.owner = :owner', { owner: user.id })
                      .andWhere('roadmap.isPublic = :isPublic', { isPublic: true })
                      .getCount();
      }
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',

        }
      }
      
      return {
        statusCode: 200,
        message: 'Get this of roadmap successfully',
        data: roadmap,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }

  }

  async findTheLastCodeOfRoadmap(): Promise<number> {
    try {
      const roadmap = await this.roadmapRepository 
                      .createQueryBuilder('roadmap')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .orderBy('roadmap.id', 'DESC')
                      .getOne();
      if (!roadmap) {
        return 0;
      }
      const code = roadmap.code;
      const numberPart = parseInt(code.slice(4), 10); 
      return +numberPart;

    } catch (error) {
      return -1;
    }
  }

  async findOneById(
    id: number
  ): Promise<ResponseDto> {
    try {
      const roadmap = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .leftJoinAndSelect('roadmap.node', 'node')
                      .leftJoinAndSelect('roadmap.owner', 'owner')
                      .leftJoinAndSelect('roadmap.comment', 'comment')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .andWhere('roadmap.isActive = :isActive', { isActive: 1 })
                      .andWhere('roadmap.id = :id', { id })
                      .getOne();
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get roadmap',
        data: null
      }
    }
  }

  async findOneByCode(
    code: string
  ): Promise<ResponseDto> {
    try {
      const roadmap = await this.roadmapRepository.findOneBy({ 
        code,
        isActive: true,
        deletedAt: IsNull(),
      });
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null

        }
      }
      return {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get roadmap'
      }
    }
  }

  async updateById(
    id: number, 
    updateRoadmapDto: UpdateRoadmapDto,
    file?: Express.Multer.File
  ): Promise<ResponseDto> {
    try {
      const getData = await this.findOneById(id);
      const roadmap = Array.isArray(getData.data) 
        ? getData.data[0] 
        : getData.data;

      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found'
        }
      }
      const ownerResponse = await this.userService.findOneById(updateRoadmapDto.owner);
      const owner = Array.isArray(ownerResponse.data)
                    ? ownerResponse.data[0]
                    : ownerResponse.data;

      if (!owner) {
        return {
          statusCode: 404,
          message: 'User not found',
        }
      }

      let public_id: string, secure_url: string ;
      let avatarUrl: string = null;
      if (file) {
        console.log("Come here");
        const url = roadmap.avatar.split(' ');
        public_id = url[1];
        secure_url = url[0];
        console.log("The split avatar: ", public_id + "   " + secure_url);
        try {
          const deleteResponse = await this.cloudinary.deleteImage(public_id);
        } catch(error) {
          throw new Error(error);
        }
        const uploadResponse = await this.cloudinary.uploadImage(file);
        avatarUrl = uploadResponse.secure_url.toString() + " " + uploadResponse.public_id.toString();
      }

      console.log("Avatar of roadmap is: ", avatarUrl);
      let roadmapCreate;

      if (avatarUrl !== null) {
        console.log("Avatar of roadmap is: ", avatarUrl);
        roadmapCreate = this.roadmapRepository.create({
          ...roadmap,
          ...updateRoadmapDto,
          owner,
          avatar: avatarUrl || null,
        })
      } else {
        roadmapCreate = this.roadmapRepository.create({
          ...roadmap,
          ...updateRoadmapDto,
          owner,
        })
      }
      console.log("Roadmap create: ", roadmapCreate);
      
      const result = await this.roadmapRepository.save(roadmapCreate);
      Logger.log(roadmap);

      return {
        statusCode: 201,
        message: 'Update roadmap successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data:null
      }
    }
  }

  async updateByCode(
    code: string, 
    updateRoadmapDto: UpdateRoadmapDto
  ): Promise<ResponseDto> {  
    try {

      const getData = await this.findOneByCode(code);
      //const roadmap = getData.data;
      const roadmap = Array.isArray(getData.data)
                      ? getData[0] : getData

      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found'
        }
      }

      const ownerResponse = await this.userService.findOneById(updateRoadmapDto.owner);
      const owner = Array.isArray(ownerResponse.data)
                    ? ownerResponse.data[0]
                    : ownerResponse.data;
      if (!owner) {
        return {
          statusCode: 404,
          message: 'User not found',
        }
      }

      const roadmapCreate = this.roadmapRepository.create({
        ...roadmap,
        ...updateRoadmapDto,
        owner,
      })
      const result = await this.roadmapRepository.save(roadmapCreate);

      return {
        statusCode: 201,
        message: 'Update roadmap successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update roadmap'
      }
    }
  }

  async removeById(
    id: number
  ): Promise<ResponseDto> {
    try {
      const getData = await this.findOneById(id);
      const roadmap = Array.isArray(getData.data) 
        ? getData.data[0] 
        : getData.data;

      console.log("Roadmap is: ", roadmap);
//
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null,
        }
      }

      const url = roadmap.avatar.split(' ');
      const public_id = url[1];
      try {
        const deleteResponse = await this.cloudinary.deleteImage(public_id);
      } catch(error) {
        throw new Error(error);
      }

      roadmap.deletedAt = new Date();
      const result = await this.roadmapRepository.save(roadmap);

      return {
        statusCode: 200,
        message: 'Delete roadmap successfully',
        data: result,
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null
      }
    }
  }

  async removeByCode(
    code: string
  ): Promise<ResponseDto> {
    try {
      const getData = await this.findOneByCode(code);
      const roadmap = Array.isArray(getData.data) 
        ? getData.data[0] 
        : getData.data;
      //const roadmap = getData.data;
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found'
        }
      }

      roadmap.isActive = false;
      roadmap.deletedAt = new Date();
      const result = await this.roadmapRepository.save(roadmap);

      return {
        statusCode: 200,
        message: 'Delete roadmap successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete roadmap'
      }
    }
  }

  async findRoadmapsByOwner(
    owner: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const roadmaps = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .leftJoinAndSelect('roadmap.node', 'node')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .andWhere('roadmap.owner = :owner', { owner })
                      .orderBy('roadmap.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      if (roadmaps.length === 0) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null,
        }
      }
      return {
        statusCode: 200,
        message: 'Get roadmap by owner successfully',
        data: roadmaps,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get roadmap by owner',
        data: null,
      }
    }
  }

  async findRoadmapsByType(
    type: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const roadmap = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .leftJoinAndSelect('roadmap.node', 'node')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .andWhere('roadmap.type = :type', { type })
                      .orderBy('roadmap.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null,
        }
      }

      return {
        statusCode: 200,
        message: 'Get roadmap by type successfully',
        data: roadmap,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to get roadmap by type',
        data: null,
      }
    }
  }
  
}
