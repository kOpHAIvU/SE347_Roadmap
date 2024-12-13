import * as https from 'https';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SMSNotificationStrategy {
  private readonly apiUrl = 'https://qdee6w.api.infobip.com/sms/2/text/advanced';
  private readonly apiKey = 'App 013996f0c0e3b163fbb58d7c6ae32ad1-002b0cf4-04d5-4328-ae0e-c8cf3b349d93';

  async sendSms(to: string, from: string, text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        hostname: 'qdee6w.api.infobip.com',
        path: '/sms/2/text/advanced',
        headers: {
          Authorization: this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          resolve(JSON.parse(body.toString()));
        });

        res.on('error', (error) => {
          reject(error);
        });
      });

      const postData = JSON.stringify({
        messages: [
          {
            destinations: [{ to }],
            from,
            text,
          },
        ],
      });

      req.write(postData);
      req.end();
    });
  }
}
