import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { MomoService } from './strategy/momo.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService,
    private readonly momoService: MomoService
  ) {}

  @Post('new/zalopay')
   @UseGuards(JwtAuthGuard)
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() request,
  ) {
    const userId = request.user.userId;
    createPaymentDto.userId = userId;
    return this.paymentService.createByZalopay(createPaymentDto);
  }

  @Post('new/banking')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async createByBanking(
    @Req() request,
    @Body() createPaymentDto: CreatePaymentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = request.user.userId;
    createPaymentDto.userId = userId;
    return await this.paymentService.createByBanking(createPaymentDto, file);
  } 

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.paymentService.findAll(page, limit);
  }
 
  @Get('item/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch('item/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string, 
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updatePaymentDto.userId = request.user.userId;
    return await this.paymentService.update(+id, updatePaymentDto, file);
  }

  @Delete('item/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }

  @Post('item/:id')
  @UseGuards(JwtAuthGuard)
  async pay(@Param('id', ParseIntPipe) id: string) {
    return this.paymentService.updatePaymentStatus(+id);
  }

  @Post('callback')
  async callbackZaloPay(
    @Body('data') data: string,
    @Body('mac') mac: string,
  ) {
    console.log('Callback from ZaloPay', data, mac);
    return await this.momoService.handleCallback(data, mac);
  }

  @Post('checkStatus')
  @UseGuards(JwtAuthGuard)
  async checkStatus(
    @Body('transId') transId: string, // Mã của payment trong CSDL - trường id trong CSDL
    @Body('orderId') orderId: number // Mã của transaction trên cổng thanh toán - tương đương trường code trong CSDL
  ) {
    const result =  await this.momoService.checkTransactionStatus(transId, orderId);
    if (result.statusCode === 200) {
      const updatePayment = await this.paymentService.updatePaymentStatus(orderId);
      return {
        statusCode: 200,
        message: 'The bill has been paid successfully.',
        data: updatePayment
      }
    } else {
      return {
        statusCode: 400,
        message: 'The bill has not been paid yet.',
        data: null
      }
    }
  }

  @Get('type/:type')
  @UseGuards(JwtAuthGuard)
  async findAllByType(
    @Param('type') type: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.paymentService.findAllPaymentByType(type, page, limit);
  }
}
//241219_cb55e220-be27-11ef-bbc4-e1112c7842b8