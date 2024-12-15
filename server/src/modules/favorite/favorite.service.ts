import { find } from 'rxjs';
import { create } from 'domain';
import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { RoadmapService } from '../roadmap/roadmap.service';
import { UserService } from '../user/user.service';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class FavoriteService {

  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private roadmapService: RoadmapService,
    private userService: UserService
  ) {}

  async create(
    createFavoriteDto: CreateFavoriteDto
  ): Promise<ResponseDto> {
    try {
      const roadmapResponse = await this.roadmapService.findOneById(createFavoriteDto.roadmapId);
      if (roadmapResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Roadmap is not found when creating new favorite",
          data: null,
        }
      }
      const roadmap = Array.isArray(roadmapResponse.data)
                            ? roadmapResponse.data[0]
                            : roadmapResponse.data;

      const userResponse = await this.userService.findOneById(createFavoriteDto.userId);
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "User is not found when creating new favorite",
          data: null,
        }
      }
      const user = Array.isArray(userResponse.data)
                            ? userResponse.data[0]
                            : userResponse.data;
  
      const newFavorite = this.favoriteRepository.create({
        ...createFavoriteDto,
        user,
        roadmap
      });  
      newFavorite.time = new Date();
      const result = await  this.favoriteRepository.save(newFavorite);

      return {
        statusCode: 200,
        message: "Favorite is created successfully",
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const favorites = await this.favoriteRepository
                            .createQueryBuilder('favorite')
                            .leftJoinAndSelect('favorite.user', 'user')
                            .leftJoinAndSelect('favorite.roadmap', 'roadmap')
                            .andWhere('favorite.deletedAt is null')
                            .orderBy('favorite.time', 'DESC')
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();

    if (favorites.length === 0) {
      return {
        statusCode: 404,
        message: "Favorite is not found",
        data: null,
      }
    }  
    return {
      statusCode: 200,
      message: "Get all favorite roadmaps successfully",
      data: favorites,
    }                      
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const favorite = await this.favoriteRepository
                            .createQueryBuilder('favorite')
                            .leftJoinAndSelect('favorite.user', 'user')
                            .leftJoinAndSelect('favorite.roadmap', 'roadmap')
                            .where('favorite.id = :id', {id})
                            .andWhere('favorite.deletedAt is null')
                            .getOne();
    if (!favorite) {
      return {
        statusCode: 404,
        message: "Favorite is not found",
        data: null,
      }
    }
    return {
      statusCode: 200,
      message: "Get favorite roadmap successfully",
      data: favorite,
    }
    }catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findFavoriteByUser(
    id: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      console.log("ID user", id);
      const favorite = await this.favoriteRepository
                                  .createQueryBuilder('favorite')
                                  .leftJoinAndSelect('favorite.roadmap', 'roadmap')
                                  .leftJoinAndSelect('favorite.user', 'user')
                                  .where('favorite.userId = :userId', { userId: id })
                                  .andWhere('favorite.deletedAt is null')
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
      if (favorite.length === 0) {
        return {
          statusCode: 404,
          message: "The favorite roadmaps of this user is not found",
          data: null
        }
      }
      return {
        statusCode: 200,
        message: "Get the list of favorite roadmaps successfully",
        data: favorite
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateFavoriteDto: UpdateFavoriteDto
  ): Promise<ResponseDto> {
    try {
      const favoriteResponse = await this.findOne(id);
      console.log("Favorite response", favoriteResponse);
      if (favoriteResponse.statusCode !== 200) {
        return {
          statusCode: 200,
          message: "Favorite roadmap is not found when updating information",
          data: null,
        }
      }
      const favorite = Array.isArray(favoriteResponse.data)
                            ? favoriteResponse.data[0]
                            : favoriteResponse.data;
      const roadmapResponse = await this.roadmapService.findOneById(updateFavoriteDto.roadmapId);
      if (roadmapResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Roadmap is not found when updating favorite",
          data: null,
        }
      }
      const roadmap = Array.isArray(roadmapResponse.data)
                            ? roadmapResponse.data[0]
                            : roadmapResponse.data;
      const userResponse = await this.userService.findOneById(updateFavoriteDto.userId);
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "User is not found when updating favorite",
          data: null
        }
      }    
      const user = Array.isArray(userResponse.data)
                        ? userResponse.data[0]
                        : userResponse.data;     
       const newInformation = this.favoriteRepository.create({
        ...updateFavoriteDto,
        user,
        roadmap,
       })           
       const result = await this.favoriteRepository.save(newInformation);
        return {
          statusCode: 200,
          message: "Favorite is updated successfully",
          data: result
        }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const favoriteResponse = await this.findOne(id);
      if (favoriteResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "The favorite roadmap information is not found when deleting information",
          data: null
        }
      }
      const favorite = Array.isArray(favoriteResponse.data)
                            ? favoriteResponse.data[0]
                            : favoriteResponse.data;  
      favorite.deletedAt = new Date();
      const result = await this.favoriteRepository.save(favorite);
      return {
        statusCode: 200,
        message: "Favorite is deleted successfully",
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
}
