import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { v1 as uuidv1 } from 'uuid';
import * as moment from 'moment';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment.service';
import * as qs from 'qs';

@Injectable()
export class MomoService {
  private readonly appId: string;
  private readonly key1: string;
  private readonly key2: string;
  private readonly endpoint: string;
  private readonly callback_url: string;
  private readonly status_check: string;

  constructor(
    private readonly configService: ConfigService,
   // private readonly payment: PaymentService
  ) {
    this.appId = this.configService.get<string>('ZALOPAY_APP_ID');
    this.key1 = this.configService.get<string>('ZALOPAY_KEY1');
    this.key2 = this.configService.get<string>('ZALOPAY_KEY2');
    this.endpoint = this.configService.get<string>('ZALOPAY_ENDPOINT');
    this.callback_url = this.configService.get<string>('ZALOPAY_CALLBACK_URL');
    this.status_check = this.configService.get<string>('ZALOPAY_STATUS');
}

  /**
   * Tạo đơn hàng ZaloPay
   * @param amount Số tiền thanh toán
   * @param appUser Người dùng thực hiện thanh toán
   * @returns Response từ ZaloPay
   */
  async createOrder(
    amount: number, 
    appUser: string
  ): Promise<{
    returncode: number,
    returnmessage: string,
    oderurl: string,
    apptransid: string,
  }> {
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
    console.log("Callback url: ", this.callback_url);
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
      callbackurl: this.callback_url,
    };

    console.log("Request data: ", params);

    // Tạo MAC theo công thức
    const data = `${params.appid}|${params.apptransid}|${params.appuser}|${params.amount}|${params.apptime}|${params.embeddata}|${params.item}`;
    params['mac'] = crypto.HmacSHA256(data, this.key1).toString();

    try {
      const response = await axios.post(this.endpoint, null, {
        params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      console.log('Create ZaloPay order:', response.data);
      const returnValue = {
        returncode: response.data.returncode,
        returnmessage: response.data.returnmessage,
        oderurl: response.data.orderurl,
        apptransid: params.apptransid,
      }
      return returnValue;
    } catch (error) {
      console.error('Error creating ZaloPay order:', error.message);
      throw new Error(error.message);
    }
  }

  async checkTransactionStatus(
    appTransId: string,
    orderId: number
  ): Promise<{
    statusCode: number,
    message: string,
    data: any
  }> {
    const postData = {
      appid: this.appId,
      apptransid: appTransId,
    };

    // Tạo MAC
    const data = `${postData.appid}|${postData.apptransid}|${this.key1}`;
    postData['mac'] = crypto.HmacSHA256(data, this.key1).toString();

    const postConfig = {
      method: 'post',
      url: this.status_check,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
    };

    try {
      const response = await axios(postConfig);
      console.log('Transaction Status Response:', response.data);
      if (response.data.returncode !== 1) {
        console.log("Transaction status not success");
        return {
          statusCode: 404,
          message: "Giao dịch chưa thành công, vui lòng thử lại",
          data: null
        }
      }
      return {
        statusCode: 200,
        message: "Giao dịch thành công",
        data: response.data
      };
    } catch (error) {
      console.error('Error checking transaction status:', error.message);
      throw new Error(error.message);
    }
  }

  async handleCallback(dataStr: string, reqMac: string): Promise< { 
    statusCode: number,
    message: string,
    data? : any
   }> {
    try {
      // Tạo MAC từ dữ liệu callback
      const mac = crypto.HmacSHA256(dataStr, this.key2).toString();
        console.log("MAC: ", mac);
      // So sánh MAC để xác thực callback từ ZaloPay
      if (reqMac !== mac) {
        return {
          statusCode: 400,
          message: 'MAC not equal',
          data: null
        };
      }

      // Nếu callback hợp lệ, xử lý dữ liệu giao dịch
      const dataJson = JSON.parse(dataStr);
      if (dataJson.returncode !== 1) {
        return {
          statusCode: 404,
          message: "Giao dịch chưa thành công, vui lòng thử lại",
          data: null
        }
      }

      return {
        statusCode: 200,
        message: "Giao dịch thành công",
        data: dataJson
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      };
    }
  }

  
}
