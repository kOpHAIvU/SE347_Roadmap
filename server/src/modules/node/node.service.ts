import { time } from 'console';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoadmapService } from '../roadmap/roadmap.service';
import { ResponseDto } from './common/response.dto';
import { Node } from '../node/entities/node.entity';
import { TimelineService } from '../timeline/timeline.service';

@Injectable()
export class NodeService {
    constructor(
        @InjectRepository(Node)
        private nodeRepository: Repository<Node>,
        private roadmapService: RoadmapService,
        @Inject(forwardRef(() => TimelineService))
        private timelineService: TimelineService,
    ) {}

    async create(createNodeDto: CreateNodeDto): Promise<ResponseDto> {
        try {
            const node = await this.nodeRepository.create({
                ...createNodeDto,
                roadmap: null,
                timeline: null,
            });
            const roadmapResponse = await this.roadmapService.findOneById(createNodeDto.roadmap);
            const roadmap = Array.isArray(roadmapResponse.data) ? roadmapResponse.data[0] : roadmapResponse.data;
            if (!roadmap && typeof createNodeDto.roadmap !== 'undefined') {
                return {
                    statusCode: 404,
                    message: 'Roadmap not found',
                    data: null,
                };
            }
            if (createNodeDto.roadmap !== null) {
                node.roadmap = roadmap;
            }

            console.log('createNodeDto.timeline', createNodeDto.timeline);
            const timelineResponse = await this.timelineService.findOneById(createNodeDto.timeline);
            const timeline = Array.isArray(timelineResponse.data) ? timelineResponse.data[0] : timelineResponse.data;
            if (!timeline && typeof createNodeDto.timeline !== 'undefined') {
                return {
                    statusCode: 404,
                    message: 'Timeline not found',
                    data: null,
                };
            }

            if (createNodeDto.timeline !== null) {
                node.timeline = timeline;
            }

            const savedNode = await this.nodeRepository.save(node);

            return {
                statusCode: 201,
                message: 'Node created successfully',
                data: savedNode,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    // async findAll(page: number = 1, limit: number = 10): Promise<ResponseDto> {
    //     try {
    //         const nodes = await this.nodeRepository
    //             .createQueryBuilder('node')
    //             .leftJoinAndSelect('node.roadmap', 'roadmap')
    //             .leftJoinAndSelect('node.timeline', 'timeline')
    //             .where('node.isActive = :isActive', { isActive: 1 })
    //             .andWhere('node.deletedAt is null')
    //             .skip((page - 1) * limit)
    //             .take(limit)
    //             .getMany();
    //         if (nodes.length === 0) {
    //             return {
    //                 statusCode: 404,
    //                 message: 'Node not found',
    //                 data: null,
    //             };
    //         }

    //         return {
    //             statusCode: 200,
    //             message: 'Nodes fetched successfully',
    //             data: nodes,
    //         };
    //     } catch (error) {
    //         return {
    //             statusCode: 500,
    //             message: 'Server error when fetching nodes',
    //             data: null,
    //         };
    //     }
    // }

    async findAll(page: number = 1, limit: number = 10): Promise<ResponseDto> {
        try {
            const nodes = await this.nodeRepository
                .createQueryBuilder('node')
                .leftJoinAndSelect('node.roadmap', 'roadmap')
                .leftJoinAndSelect('node.timeline', 'timeline')
                .where('node.isActive = :isActive', { isActive: 1 })
                .andWhere('node.deletedAt is null')
                .orderBy('node.id', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();
            if (nodes.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Node not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Node fetched successfully',
                data: nodes,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Server error when fetching nodes',
                data: null,
            };
        }
    }

    async findOneById(id: number): Promise<ResponseDto> {
        try {
            const node = await this.nodeRepository
                .createQueryBuilder('node')
                .leftJoinAndSelect('node.roadmap', 'roadmap')
                .leftJoinAndSelect('node.timeline', 'timeline')
                .leftJoinAndSelect('node.comment', 'comment')
                .where('node.id = :id', { id })
                .andWhere('node.isActive = :isActive', { isActive: 1 })
                .andWhere('node.deletedAt is null')
                .getOne();
            if (!node) {
                return {
                    statusCode: 404,
                    message: 'Node not found',
                    data: null,
                };
            }

            return {
                statusCode: 200,
                message: 'Node fetched successfully',
                data: node,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Server error when fetching node',
                data: null,
            };
        }
    }

    async update(id: number, updateNodeDto: UpdateNodeDto): Promise<ResponseDto> {
        try {
            const nodeResponse = await this.findOneById(id);
            if (nodeResponse.statusCode !== 200) {
                return nodeResponse;
            }
            const node = Array.isArray(nodeResponse.data) ? nodeResponse.data[0] : nodeResponse.data;
            if (!node) {
                return {
                    statusCode: 404,
                    message: 'Node not found',
                    data: null,
                };
            }
            const updateNode = await this.nodeRepository.create({
                ...node,
                ...updateNodeDto,
                roadmap: node.roadmap,
                timeline: node.timeline,
            });

            const result = await this.nodeRepository.save(updateNode);

            return {
                statusCode: 200,
                message: 'Node updated successfully',
                data: result,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Server error when updating node',
                data: null,
            };
        }
    }

    async findAllNodeByTimelineId(timelineId: number): Promise<ResponseDto> {
        try {
            const nodes = await this.nodeRepository
                .createQueryBuilder('node')
                .leftJoinAndSelect('node.comment', 'comment')
                .where('node.timelineId = :timelineId', { timelineId })
                .andWhere('node.isActive = :isActive', { isActive: 1 })
                .andWhere('node.deletedAt is null')
                .orderBy('node.id', 'ASC')
                .getMany();
            if (nodes.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Node not found',
                    data: null,
                };
            }
        } catch (error) {
            return {
                statusCode: 200,
                message: error.message,
                data: null,
            };
        }
    }

    async remove(id: number): Promise<ResponseDto> {
        try {
            const nodeResponse = await this.findOneById(id);
            if (nodeResponse.statusCode !== 200) {
                return nodeResponse;
            }
            const node = Array.isArray(nodeResponse.data) ? nodeResponse.data[0] : nodeResponse.data;

            node.isActive = false;
            node.deletedAt = new Date();
            const result = await this.nodeRepository.save(node);

            return {
                statusCode: 200,
                message: 'Node deleted successfully',
                data: result,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Server error when deleting node',
                data: null,
            };
        }
    }

    async findNodeByRoadmapId(roadmap: number): Promise<ResponseDto> {
        try {
            const nodes = await this.nodeRepository
                .createQueryBuilder('node')
                .leftJoinAndSelect('node.comment', 'comment')
                .where('node.roadmapId = :roadmap', { roadmap })
                .andWhere('node.isActive = :isActive', { isActive: 1 })
                .andWhere('node.deletedAt is null')
                .orderBy('node.id', 'ASC')
                .getMany();
            if (nodes.length === 0) {
                return {
                    statusCode: 404,
                    message: 'Node not found',
                    data: null,
                };
            }
            return {
                statusCode: 200,
                message: 'Node fetched successfully',
                data: nodes,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    async deleteNodeByRoadmapId(roadmapId: number) {
        try {
            const nodes = await this.nodeRepository
                .createQueryBuilder('node')
                .where('node.roadmapId = :roadmapId', { roadmapId })
                .andWhere('node.isActive = :isActive', { isActive: 1 })
                .andWhere('node.deletedAt is null')
                .getMany();
            for (let i = 0; i < nodes.length; i++) {
                const idNode = nodes[i].id;
                const result = await this.remove(idNode);
                if (result.statusCode !== 200) {
                    return {
                        statusCode: 500,
                        message: 'Cannot delete node ' + idNode,
                        data: null,
                    };
                }
            }
            return {
                statusCode: 200,
                message: 'Node deleted successfully',
                data: null,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message,
                data: null,
            };
        }
    }

    async deleteNodeByTimelineId(timelineId: number) {
        try {
            const nodes = await this.nodeRepository
                .createQueryBuilder('node')
                .where('node.timeline = :timelineId', { timelineId })
                .andWhere('node.isActive = :isActive', { isActive: 1 })
                .andWhere('node.deletedAt is null')
                .getMany();
            for (let i = 0; i < nodes.length; i++) {
                const idNode = nodes[i].id;
                const result = await this.remove(idNode);
                if (result.statusCode !== 200) {
                    return {
                        statusCode: 500,
                        message: 'Cannot delete node ' + idNode,
                        data: null,
                    };
                }
            }
            return {
                statusCode: 200,
                message: 'Node deleted successfully',
                data: null,
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

/*
const [nodes, setNodes] = useState([
  {
      id: 0, level: 1,
      x: 50, y: 50,
      type: 'Checkbox',
      due_time: 2,
      content: 'Write something... Chiều cao dựa trên chiều cao của văn bản hoặc giá trị mặc định',
      ticked: false,
      nodeDetail: nodeDetail,
      nodeComment: [
          {
              userId: '1',
              username: 'KoPhaiVu',
              text: "haha",
              comment: "whao"
          },
          {
              userId: '2',
              username: 'KoPhaiThien',
              text: "mcc",
              comment: "whao"
          },
      ]
  },
  {
      id: 1, level: 1,
      x: 50, y: 150,
      type: 'Checkbox',
      due_time: 2,
      content: 'Nhạc Remix TikTok | Vạn Sự Tùy Duyên Remix - Phía Xa Vời Có Anh Đang Chờ - Nonstop Nhạc Remix 2024',
      ticked: true,
      nodeDetail: '',
      nodeComment: null
  }
]);

*/
