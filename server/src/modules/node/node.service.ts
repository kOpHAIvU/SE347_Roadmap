import { Injectable } from '@nestjs/common';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoadmapService } from '../roadmap/roadmap.service';
import { ResponseDto } from './common/response.dto';
import {Node} from "../node/entities/node.entity";

@Injectable()
export class NodeService {

  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    private roadmapService: RoadmapService,
  ) {}

  async create(
    createNodeDto: CreateNodeDto
  ): Promise<ResponseDto> {
    try {
      const roadmapResponse = await this.roadmapService.findOneById(createNodeDto.roadmap);
      const roadmap = Array.isArray(roadmapResponse.data)
                  ? roadmapResponse.data[0]
                  : roadmapResponse.data;
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null
        }
      }

      const node = await this.nodeRepository.create({
        ...createNodeDto,
        roadmap: roadmap,
      });

      const savedNode = await this.nodeRepository.save(node);

      return {
        statusCode: 201,
        message: 'Node created successfully',
        data: savedNode,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when creating node',
        data: null,
      };
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const nodes = await this.nodeRepository
                      .createQueryBuilder('node')
                      .leftJoinAndSelect('node.roadmap', 'roadmap')
                      .where('node.isActive = :isActive', { isActive: 1 })
                      .andWhere('node.deletedAt is null')
                      .skip((page - 1) * limit)
                      .take(limit)
                      .getMany();
      if (nodes.length === 0) {
        return {
          statusCode: 404,
          message: 'Node not found',
          data: null
        }
      }

      return {
        statusCode: 200,
        message: 'Nodes fetched successfully',
        data: nodes,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when fetching nodes',
        data: null,
      }
    }
  }

  async findOneById(
    id: number
  ): Promise<ResponseDto> {
    try {
      const node = await this.nodeRepository
                      .createQueryBuilder('node')
                      .leftJoinAndSelect('node.roadmap', 'roadmap')
                      .where('node.id = :id', { id })
                      .andWhere('node.isActive = :isActive', { isActive: 1 })
                      .andWhere('node.deletedAt is null')
                      .getOne();
      if (!node) {
        return {
          statusCode: 404,
          message: 'Node not found',
          data: null
        }
      }

      return {
        statusCode: 200,
        message: 'Node fetched successfully',
        data: node,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Server error when fetching node',
        data: null,
      }
    }
  }

  async update(
    id: number, 
    updateNodeDto: UpdateNodeDto
  ): Promise<ResponseDto> {
    try {
      const nodeResponse = await this.findOneById(id);
      if (nodeResponse.statusCode !== 200) {
        return nodeResponse;
      }
      const node  = Array.isArray(nodeResponse.data)
                  ? nodeResponse.data[0]
                  : nodeResponse.data;

      const roadmapResponse = await this.roadmapService.findOneById(updateNodeDto.roadmap);
      const roadmap = Array.isArray(roadmapResponse.data)
                  ? roadmapResponse.data[0]
                  : roadmapResponse.data;
      if (!roadmap) {
        return {
          statusCode: 404,
          message: 'Roadmap not found',
          data: null
        }
      }

      const updateNode = this.nodeRepository.create({
        ...node,
        ...updateNodeDto,
        roadmap: roadmap,
      });

      const result = await this.nodeRepository.save(updateNode);

      return {
        statusCode: 200,
        message: 'Node updated successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when updating node',
        data: null,
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const nodeResponse = await this.findOneById(id);
      if (nodeResponse.statusCode !== 200) {
        return nodeResponse;
      }
      const node  = Array.isArray(nodeResponse.data)
                  ? nodeResponse.data[0]
                  : nodeResponse.data;
                  
      node.isActive = false;
      node.deletedAt = new Date();
      const result = await this.nodeRepository.save(node);

      return {
        statusCode: 200,
        message: 'Node deleted successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when deleting node',
        data: null,
      }
    }
  }
}
