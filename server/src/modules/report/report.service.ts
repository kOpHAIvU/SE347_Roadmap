import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { IsNull, Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class ReportService {

  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private userService: UserService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<ResponseDto> {
    try {
      const posterResponse = await this.userService.findOneById(createReportDto.posterId); 
      const owner = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data;
      if (!owner) {
        return {
          statusCode: 404,
          message: 'Poster not found',
          data: null
        };
      }
      const report = this.reportRepository.create({
        ...createReportDto,
        reporter: owner,
      });
      const result = await this.reportRepository.save(report);
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to create report'
        }
      }
      return {
        statusCode: 201,
        message: 'Create report successfully',
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Server is not OK",
        data: null
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const reports = await this.reportRepository
                      .createQueryBuilder('report')
                      .leftJoinAndSelect('report.reporter', 'reporter')
                      .where("report.isActive = :isActive", { isActive: 1 })
                      .andWhere('report.deletedAt is null')
                      .orderBy('report.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      if (reports.length == 0) {
        return {
          statusCode: 404,
          message: 'Report not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get all reports successfully',
        data: reports
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Server is not OK",
        data: null
      }
    }
  }

  async findReportsByUser(
    idUser: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDto> {
    try {
      const reports = await this.reportRepository
                                .createQueryBuilder('report')
                                .leftJoinAndSelect('report.user', "user")
                                .where('report.poster = :posterId')
                                .andWhere('report.deletedAt is null') 
                                .orderBy('report.createdAt', 'DESC')
                                .skip((page - 1) * limit)  
                                .take(limit)                
                                .getMany();
      if (reports.length === 0) {
        return {
          statusCode: 404,
          message: "The list of reports of this user is not found",
          data: null
        }
      }
      return {
        statusCode: 200,
        message: "Get the list of reports of this user successfully",
        data: reports
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const report = await this.reportRepository.findOneBy({ 
        id,
        isActive: true,
        deletedAt: IsNull(),
      });
      if (!report) {
        return {
          statusCode: 404,
          message: 'Report not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get report successfully',
        data: report
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Server is not OK",
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateReportDto: UpdateReportDto
  ): Promise<ResponseDto> {
    try {
      const reportResponse = await this.findOne(id);
      const report = Array.isArray(reportResponse.data) 
        ? reportResponse.data[0] 
        : reportResponse.data;

      if (!report) {
        return {
          statusCode: 404,
          message: 'Report not found',
          data: null
        }
      }

      const posterResponse = await this.userService.findOneById(updateReportDto.posterId); 
      const owner = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data;                  
      if (!owner) {
        return {
          statusCode: 404,
          message: 'Poster not found',
          data: null
        };
      }

      const updateData = this.reportRepository.create({
        ...report,
        ...updateReportDto,
        reporter: owner, 
      }); 
      console.log(updateData);
      const result = await this.reportRepository.save(updateData);
      return {
        statusCode: 200,
        message: 'Update report successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Server is not OK",
        data: null
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const reportResponse = await this.findOne(id);
      const report = Array.isArray(reportResponse.data) 
        ? reportResponse.data[0] 
        : reportResponse.data;

      if (!report) {
        return {
          statusCode: 404,
          message: 'Report not found',
          data: null
        }
      }
      report.isActive = false;
      report.deletedAt = new Date();
      const result = await this.reportRepository.save(report);
      return {
        statusCode: 200,
        message: 'Delete report successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Server is not OK",
        data: null
      }
    }
  }
}
