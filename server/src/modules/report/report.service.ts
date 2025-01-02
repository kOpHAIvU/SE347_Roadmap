import { Inject, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { IsNull, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from './common/response.interface';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ReportGateway } from './report.gateway';
import {Report} from './entities/report.entity'
import { FirebaseService } from '../firebase/firebase.service';
import { report } from 'process';
import { GmailNotificationStrategy } from '../notification/strategy/gmail-notification.service';
import { RoadmapService } from '../roadmap/roadmap.service';
import { Roadmap } from '../roadmap/entities/roadmap.entity';

@Injectable()
export class ReportService {

  constructor(
    @Inject("RoadmapConfigurationReport") private rabbitClient: ClientProxy,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private userService: UserService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
    private gmailService: GmailNotificationStrategy,
    private roadmapService: RoadmapService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<ResponseDto> {
    try {
      const report = this.reportRepository.create({
        ...createReportDto,
        reporter: null,
        receive: null,
        roadmap: null
      });
      const posterResponse = await this.userService.findOneById(createReportDto.posterId); 
      const poster = Array.isArray(posterResponse.data)
                    ? posterResponse.data[0]
                    : posterResponse.data;
      if (!poster && createReportDto.posterId !== null) {
        return {
          statusCode: 404,
          message: 'Poster not found',
          data: null
        };
      }
      report.reporter = poster;

      const receiverResponse = await this.userService.findOneById(createReportDto.receiverId);
      const receiver = Array.isArray(receiverResponse.data)
                    ? receiverResponse.data[0]
                    : receiverResponse.data;
      if (!receiver && createReportDto.receiverId !== null) {
        return {
          statusCode: 404,
          message: 'Receiver not found',
          data: null
        };
      }
      report.receive = receiver;

      if (typeof createReportDto.roadmapId !== 'undefined') {
        const roadmapResponse = await this.roadmapService.findOneById(createReportDto.roadmapId);
        const roadmap = Array.isArray(roadmapResponse.data)
                      ? roadmapResponse.data[0]
                      : roadmapResponse.data;
        if (!roadmap) {
          return {
            statusCode: 404,
            message: 'Roadmap not found',
            data: null
          };
        }
        report.roadmap = roadmap;
      }

      const result = await this.reportRepository.save(report);
      if (!result) {
        return {
          statusCode: 500,
          message: 'Failed to create report'
        }
      }


      console.log("URL with rabbitMQ", this.configService.get<string>('URL'));
      try {
        await this.rabbitClient.connect();
      } catch (error) {
        console.log("Error connect rabbitmq: ", error);
      }
      this.rabbitClient.emit("Create_new_report", result);
      
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

  async getReportsByType(
    type: string, 
    page: number = 1,
    limit: number = 10
  ): Promise<{
    statusCode: number,
    message: string,
    data: {
      total: number,
      reports: Report[]
    }
  }> {
    try {
      const reports = await this.reportRepository
                      .createQueryBuilder('report')
                      .leftJoinAndSelect('report.reporter', 'reporter')
                      .leftJoinAndSelect('report.receive', 'receive')
                      //.where("report.isActive = :isActive", { isActive: 1 })
                      .andWhere('report.deletedAt is null')
                      .andWhere('report.type = :type', { type })
                      .orderBy('report.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      const total = await this.reportRepository
                      .createQueryBuilder('report')
                     // .where("report.isActive = :isActive", { isActive: 1 })
                      .andWhere('report.deletedAt is null')
                      .andWhere('report.type = :type', { type })
                      .getCount();
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
        data: {
          total,
          reports
        }
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async handleNotificationFromRabbitMQ(
    data: Report
  ): Promise<void> {
    console.log('Notification received from RabbitMQ:', data);
   // this.reportGateway.sendNotificationToClients(data.content);
    const receiver = await this.userService.findOneById(data.receive.id);
    const receiverData = Array.isArray(receiver.data)
                        ? receiver.data[0]
                        : receiver.data;
    if (receiverData) {
      const responseReport = await this.firebaseService.sendPushNotification(receiverData.deviceToken, data.title, data.content);
      const responseGmail = await this.gmailService.sendEmail(receiverData.email, data.title, data.content);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    statusCode: number,
    message: string,
    data: {
      totalRecord: number,
      totalCheck: number,
      reports: Report[]
    }
  }> {
    try {
      const reports = await this.reportRepository
                      .createQueryBuilder('report')
                      .leftJoinAndSelect('report.reporter', 'reporter')
                      .leftJoinAndSelect('report.receive', 'receive')
                      .leftJoinAndSelect('report.roadmap', 'roadmap')
                      //.where("report.isActive = :isActive", { isActive: 1 })
                      .where("report.isChecked = false")
                      .andWhere('report.deletedAt is null')
                      .orderBy('report.createdAt', 'DESC')
                      .skip((page - 1) * limit)  
                      .take(limit)                
                      .getMany();
      const total = await this.reportRepository
                      .createQueryBuilder('report')
                     // .where("report.isActive = :isActive", { isActive: 1 })
                      .andWhere('report.deletedAt is null')
                      .getCount();
      const checkedReport = await this.reportRepository
                      .createQueryBuilder('report')
                      .where('report.isChecked = true')
                      .getCount();
      if (reports.length == 0) {
        return {
          statusCode: 404,
          message: 'Report not found',
          data: {
            totalRecord: total,
            totalCheck: 0,
            reports: null
          }
        }
      }
      return {
        statusCode: 200,
        message: 'Get all reports successfully',
        data: {
          totalRecord: total,
          totalCheck: checkedReport,
          reports
        }
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findReportsByUser(
    idUser: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    statusCode: number,
    message: string,
    data: {
      total: number,
      reports: Report[]
    }
  }> {
    try {
      const reports = await this.reportRepository
                                .createQueryBuilder('report')
                                .leftJoinAndSelect('report.reporter', 'reporter')
                                .leftJoinAndSelect('report.receive', 'receive')
                                .where('report.reporter= :posterId', {posterId: idUser})
                                .andWhere('report.deletedAt is null') 
                                .orderBy('report.createdAt', 'DESC')
                                .skip((page - 1) * limit)  
                                .take(limit)                
                                .getMany();
      const  total = await this.reportRepository
                                .createQueryBuilder('report')
                                .where('report.reporter= :posterId', {posterId: idUser})
                                .andWhere('report.deletedAt is null')
                                .getCount();          
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
        data: {
          total,
          reports
        }
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
       // isActive: true,
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
        message: error.message,
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
      const updateData = this.reportRepository.create({
        ...report,
        ...updateReportDto,
        reporter: report.reporter, 
        receive: null,
      });

      
      if (typeof updateReportDto.receiverId !== 'undefined') {
        const receiverResponse = await this.userService.findOneById(updateReportDto.receiverId);
        const receiver = Array.isArray(receiverResponse.data)
                      ? receiverResponse.data[0]
                      : receiverResponse.data;
        if (!receiver) {
          return {
            statusCode: 404,
            message: 'Receiver not found',
            data: null
          };
        }
        updateData.receive = receiver;
      }

      const result = await this.reportRepository.save(updateData);
      return {
        statusCode: 200,
        message: 'Update report successfully',
        data: result,
      }
    } catch (error) {
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
      // report.isActive = false;
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
        message: error.message,
        data: null
      }
    }
  }

  async banRoadmap(
    idRoadmap: number,
  ): Promise<{
    statusCode: number,
    message: string,
    data: {
      idRoadmap: number,
      title: string,
    }
  }> {
    try {
      const numberOfReport = await this.reportRepository
                            .createQueryBuilder('report')
                            .where('report.roadmap = :idRoadmap', {idRoadmap})
                            .andWhere('report.isChecked = true')
                            .getCount();
      if (numberOfReport >= 3) {
        const result = await this.roadmapService.removeById(idRoadmap);
        if (result.statusCode !== 200) {
          return {
            statusCode: 500,
            message: 'Ban roadmap failed',
            data: null,
          }
        }
        const deletedRoadmap = Array.isArray(result.data)
                                ? result.data[0]
                                : result.data;
        return {
          statusCode: 200,
          message: 'Ban roadmap successfully',
          data: {
            idRoadmap: deletedRoadmap.id,
            title: deletedRoadmap.title,
          },
        }
      }
      return {
        statusCode: 200,
        message: "The roadmap's ban count is not enough to delete",
        data: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async checkReport(
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
      report.isChecked = true;
      const result = await this.reportRepository.save(report);
      return {
        statusCode: 200,
        message: 'Check report successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
}
