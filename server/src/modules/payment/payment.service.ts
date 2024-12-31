import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { UserService } from '../user/user.service';
import { MomoService } from './strategy/momo.service';
import { Cloudinary } from '../cloudinary/entities/cloudinary.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly userService: UserService,
    private readonly momoService: MomoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}  

  encodeTo8Char(id: number): string {
    // Chuyển số thành Buffer và mã hóa Base64
    const base64 = Buffer.from(id.toString()).toString('base64');
    // Loại bỏ padding "=" và giới hạn chuỗi đầu ra
    const customBase64 = base64.replace(/=/g, '');
    // Đảm bảo chuỗi có độ dài 8 ký tự
    return customBase64.padEnd(8, 'X').substring(0, 8); // Thêm 'X' nếu thiếu ký tự
  }
  async createByZalopay(
    createPaymentDto: CreatePaymentDto
  ): Promise<{
    statusCode: number,
    message: string,
    data: Payment
  }> {
    try {
      const userResponse = await this.userService.findOneById(createPaymentDto.userId)
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "User is not found",
          data: null
        }
      }

      const user = Array.isArray(userResponse.data) 
                        ? userResponse.data[0] 
                        : userResponse.data
      const newPayment = this.paymentRepository.create({
        ...createPaymentDto,
        user: user,
        status: false
      })

      if (createPaymentDto.type === 'zalopay') {
        const momoPayment = await this.momoService.createOrder(createPaymentDto.totalPayment, user.fullName);
        console.log('Create payment via zalopay', momoPayment);
        if (momoPayment.returncode !== 1) {
          return {
            statusCode: 400,
            message: momoPayment.returnmessage,
            data: null
          }
        }
        newPayment.code = momoPayment.apptransid;
        newPayment.oderurl = momoPayment.oderurl;
      }
      const payment = await this.paymentRepository.save(newPayment)
      
      return {
        statusCode: 200,
        message: "Payment created successfully",
        data: payment
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async createByBanking(
    createPaymentDto: CreatePaymentDto,
    file?: Express.Multer.File
  ): Promise<{
    statusCode: number,
    message: string,
    data: Payment
  }> {
    try {
      const userResponse = await this.userService.findOneById(createPaymentDto.userId)
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "User is not found",
          data: null
        }
      }
      const user = Array.isArray(userResponse.data) 
                        ? userResponse.data[0] 
                        : userResponse.data
      console.log('File to upload:', file);
      let imageUrl: string;
      if (typeof file !== 'undefined') {
        const uploadResponse = await this.cloudinaryService.uploadImage(file);
        imageUrl = uploadResponse.secure_url.toString() + ' ' + uploadResponse.public_id.toString();
      }
      const newPayment = this.paymentRepository.create({
        ...createPaymentDto,
        user: user,
        status: false,
        type: 'banking',
        image: imageUrl || null,
      })
      const payment = await this.paymentRepository.save(newPayment)
      
      return {
        statusCode: 200,
        message: "Payment created successfully",
        data: payment
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
    limit: number = 10
  ): Promise<{
    statusCode: number, 
    message: string,
    data: {
      total: number,
      data: Payment[]
    }
  }> {
    try {
      const payments = await this.paymentRepository
                                .createQueryBuilder('payment')
                                .leftJoinAndSelect('payment.user', 'user')
                                .where('payment.deletedAt IS NULL')
                                .andWhere('payment.isActive = true')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany()
      const total = await this.paymentRepository
                          .createQueryBuilder('payment')
                          .where('payment.deletedAt IS NULL')
                          .andWhere('payment.isActive = true')
                          .getCount() 
      if (payments.length === 0) {
        return {
          statusCode: 404,
          message: "No payment found",
          data: null
        }
      }

      return {
        statusCode: 200,
        message: "Get this list of payments successfully",
        data: {
          total,
          data: payments
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

  async findOne(
    id: number
  ): Promise<{
    statusCode: number,
    message: string,
    data: Payment
  }> {
    try {
      const payment = await this.paymentRepository
                                .createQueryBuilder('payment')
                                .leftJoinAndSelect('payment.user', 'user')
                                .where('payment.id = :id', { id })
                                .andWhere('payment.deletedAt IS NULL')
                                .andWhere('payment.isActive = true')
                                .getOne()
      if (!payment) {
        return {
          statusCode: 404,
          message: "Payment not found",
          data: payment
        }
      }
      return {
        statusCode: 200,
        message: "Get this payment successfully",
        data: payment
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
    updatePaymentDto: UpdatePaymentDto,
    file?: Express.Multer.File
  ): Promise<{
    statusCode: number,
    message: string,
    data: Payment
  }> {
    try { 
      const oldPaymentResponse = await this.findOne(id);
      if (oldPaymentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Payment not found",
          data: null
        }
      }
      let public_id: string, secure_url: string, avatarUrl: string;
      if (updatePaymentDto.type === 'banking' && typeof file !== 'undefined') {
        if (file) {
            const url = updatePaymentDto.image.split(' ');
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

        const uploadResponse = await this.cloudinaryService.uploadImage(file);
        updatePaymentDto.image = uploadResponse.secure_url.toString() + ' ' + uploadResponse.public_id.toString();

      }
      const newPayment = this.paymentRepository.create({
        ...oldPaymentResponse.data,
        ...updatePaymentDto
      })
      const result = await this.paymentRepository.save(newPayment);
      return {
        statusCode: 200,
        message: "Payment updated successfully",
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

  async updatePaymentStatus(
    id: number,
  ) {
    try {
      const oldPaymentResponse = await this.findOne(id);
      if (oldPaymentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Payment not found",
          data: null
        }
      }
      const newPayment = this.paymentRepository.create({
        ...oldPaymentResponse.data,
        status: true
      })
      const result = await this.paymentRepository.save(newPayment);
      return {
        statusCode: 200,
        message: "Payment status updated successfully",
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
  ): Promise<{
    statusCode: number,
    message: string,
    data: Payment
  }> {
    try {
      const oldPaymentResponse = await this.findOne(id);
      if (oldPaymentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Payment not found",
          data: null
        }
      }
      const newPayment = this.paymentRepository.create({
        ...oldPaymentResponse.data,
        isActive: false,
        deletedAt: new Date()
      })
      const result = await this.paymentRepository.save(newPayment);
      return {
        statusCode: 200,
        message: "Payment deleted successfully",
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

  async findAllPaymentByType(
    type: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    status: number,
    message: string,
    data: Payment[]
  }> {
    try {
      const payments = await this.paymentRepository
                                .createQueryBuilder('payment')
                                .leftJoinAndSelect('payment.user', 'user')
                                .where('payment.type = :type', { type })
                                .andWhere('payment.deletedAt IS NULL')
                                .andWhere('payment.isActive = true')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany()
      if (payments.length === 0) {
        return {
          status: 404,
          message: "No payment found",
          data: payments
        }
      }
      return {
        status: 200,
        message: "Get this list of payments successfully",
        data: payments
      }
    } catch(error) {
      return {
        status: 500,
        message: error.message,
        data: null
      }
    }
  }
}
