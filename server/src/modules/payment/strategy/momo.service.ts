import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { v1 as uuidv1 } from 'uuid';
import * as moment from 'moment';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MomoService {
  private readonly appId: string;
  private readonly key1: string;
  private readonly key2: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.appId = this.configService.get<string>('ZALOPAY_APP_ID');
    this.key1 = this.configService.get<string>('ZALOPAY_KEY1');
    this.key2 = this.configService.get<string>('ZALOPAY_KEY2');
    this.endpoint = this.configService.get<string>('ZALOPAY_ENDPOINT');
  }

  /**
   * Tạo đơn hàng ZaloPay
   * @param amount Số tiền thanh toán
   * @param appUser Người dùng thực hiện thanh toán
   * @returns Response từ ZaloPay
   */
  async createOrder(amount: number, appUser: string): Promise<any> {
    const transId = `${moment().format('YYMMDD')}_${uuidv1()}`; // Mã giao dịch (yyMMdd_xxxx)
    const embedData = { merchantinfo: 'embeddata123' };
    const items = [
      {
       // itemid: 'knb',
        itemname: 'Pay for premium service',
        itemprice: amount,
        itemquantity: 1,
      },
    ];

    const params = {
      appid: this.appId,
      appuser: appUser,
      apptime: Date.now(),
      amount,
      apptransid: transId,
      embeddata: JSON.stringify(embedData),
      item: JSON.stringify(items),
      description: 'ZaloPay Integration Demo',
      bankcode: 'zalopayapp',
    };

    // Tạo MAC theo công thức
    const data = `${params.appid}|${params.apptransid}|${params.appuser}|${params.amount}|${params.apptime}|${params.embeddata}|${params.item}`;
    params['mac'] = crypto.HmacSHA256(data, this.key1).toString();

    try {
      const response = await axios.post(this.endpoint, null, {
        params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating ZaloPay order:', error.message);
      throw new Error(error.message);
    }
  }
}
