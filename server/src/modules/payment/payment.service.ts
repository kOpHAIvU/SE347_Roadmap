import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly userService: UserService,
  ) {}  

  encodeTo8Char(id: number): string {
    // Chuyển số thành Buffer và mã hóa Base64
    const base64 = Buffer.from(id.toString()).toString('base64');
    // Loại bỏ padding "=" và giới hạn chuỗi đầu ra
    const customBase64 = base64.replace(/=/g, '');
    // Đảm bảo chuỗi có độ dài 8 ký tự
    return customBase64.padEnd(8, 'X').substring(0, 8); // Thêm 'X' nếu thiếu ký tự
  }
  async create(
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
        user: user
      })

      const template_payment = await this.paymentRepository.save(newPayment)
      const idTransaction = this.encodeTo8Char(template_payment.id)
      template_payment.code = idTransaction
      const payment = await this.paymentRepository.save(template_payment)
      
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
    data: Payment[]
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
      if (payments.length === 0) {
        return {
          statusCode: 404,
          message: "No payment found",
          data: payments
        }
      }

      return {
        statusCode: 200,
        message: "Get this list of payments successfully",
        data: payments
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
    updatePaymentDto: UpdatePaymentDto
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
        ...updatePaymentDto
      })
      const userResponse = await this.userService.findOneById(updatePaymentDto.userId)
      if (userResponse.statusCode === 200) {
        const user = Array.isArray(userResponse.data)
                          ? userResponse.data[0]
                          : userResponse.data;
        newPayment.user = user;
      }
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
}
