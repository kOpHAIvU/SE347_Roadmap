import { Injectable, Logger, Query } from '@nestjs/common';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ResponseDto } from './common/roadmap.interface';

@Injectable()
export class RoadmapService {

  constructor(
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,
    private userService: UserService,
  ) {}

  async create(
    createRoadmapDto: CreateRoadmapDto
  ): Promise<ResponseDto>{
    try {
      const ownerResponse = await this.userService.findOneById(createRoadmapDto.owner); 
      const owner = Array.isArray(ownerResponse.data)
                    ? ownerResponse.data[0]
                    : ownerResponse.data;
      if (!owner) {
          throw new Error('User not found'); 
      }
      const roadmap = this.roadmapRepository.create({
          ...createRoadmapDto,
          owner, 
      });
      const result = await this.roadmapRepository.save(roadmap); 
      return {
        statusCode: 201,
        message: 'Create roadmap successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to create roadmap'
      }
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<ResponseDto> {
    try {
      const roadmap = await this.roadmapRepository
                      .createQueryBuilder('roadmap')
                      .where("roadmap.isActive = :isActive", { isActive: 1 })
                      .andWhere('roadmap.deletedAt is null')
                      .orderBy('roadmap.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();

      return {
        statusCode: 200,
        message: 'Get this of roadmap successfully',
        data: roadmap,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get all road maps'
      }
    }
  }

  async findOneById(
    id: number
  ): Promise<ResponseDto> {
    try {
      const roadmap = await this.roadmapRepository.findOneBy({ 
        id,
        isActive: true,
        deletedAt: IsNull(),
      });
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found'
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
          message: 'Roadmap not found'
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
    updateRoadmapDto: UpdateRoadmapDto
  ): Promise<ResponseDto> {
    try {
      const getData = await this.findOneById(id);
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
      Logger.log(roadmap);

      Object.assign(roadmap, updateRoadmapDto);
      const result = await this.roadmapRepository.save(roadmap);
      Logger.log(roadmap);

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
      updateRoadmapDto.code = roadmap.code;

      Object.assign(roadmap, updateRoadmapDto);
      const result = await this.roadmapRepository.save(roadmap);

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

  async removeById(id: number) {
    try {
      const getData = await this.findOneById(id);
      const roadmap = Array.isArray(getData.data) 
        ? getData.data[0] 
        : getData.data;
     // const roadmap = getData.data;
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found'
        }
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
        error: error.message,
        statusCode: 500,
        message: 'Failed to delete roadmap'
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
  
}
