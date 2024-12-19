import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class MomoService {
  private readonly appId = process.env.ZALOPAY_APP_ID;
  private readonly key1 = process.env.ZALOPAY_KEY1;
  private readonly createOrderUrl = process.env.ZALOPAY_ENDPOINT;

  async createPayment(amount: number, appUser: string): Promise<any> {
    const transId = this.generateTransactionId();
    const embedData = { merchantinfo: 'embeddata123' };
    const items = [
      { itemid: 'knb', itemname: 'kim nguyen bao', itemprice: amount, itemquantity: 1 },
    ];

    const params = {
      appid: this.appId,
      appuser: appUser,
      apptime: Date.now(),
      amount: amount.toString(),
      apptransid: transId,
      embeddata: JSON.stringify(embedData),
      item: JSON.stringify(items),
      description: 'ZaloPay demo',
      bankcode: 'zalopayapp',
      phone: "0123456789",
      address: "123 Nguyen Dinh Chieu",
      email: "nguyenloan2000hbt@gmail.com",
      subappid: "zaloapp",
    };

    const data = `${params.appid}|${params.apptransid}|${params.appuser}|${params.amount}|${params.apptime}|${params.embeddata}|${params.item}`;
    const mac = crypto.createHmac('sha256', this.key1).update(data).digest('hex');

    params['mac'] = mac;

    try {
      const response = await axios.post(this.createOrderUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating ZaloPay order:', error.message);
      throw new Error(error.message);
    }
  }

  private generateTransactionId(): string {
    const date = new Date();
    const yyMMdd = date.toISOString().slice(2, 10).replace(/-/g, '');
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${yyMMdd}_${randomId}`;
  }
}
