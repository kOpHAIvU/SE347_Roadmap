import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    if (!admin.apps.length) {
      console.log('Initializing Firebase...');
      // Nếu chưa có ứng dụng Firebase nào được khởi tạo, tiến hành khởi tạo
      const firebaseConfig = {
        type: this.configService.get<string>('FIREBASE_TYPE'),
        project_id: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        private_key_id: this.configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
        private_key: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        client_email: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        client_id: this.configService.get<string>('FIREBASE_CLIENT_ID'),
        auth_uri: this.configService.get<string>('FIREBASE_AUTH_URI'),
        token_uri: this.configService.get<string>('FIREBASE_TOKEN_URI'),
        auth_provider_x509_cert_url: this.configService.get<string>('FIREBASE_AUTH_PROVIDER_CERT_URL'),
        client_x509_cert_url: this.configService.get<string>('FIREBASE_CLIENT_CERT_URL'),
      };

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
      });

      console.log('Firebase initialized successfully');
    } else {
      // Nếu đã khởi tạo, sử dụng app đã có
      this.firebaseApp = admin.app();
      console.log('Firebase app already initialized');
    }
  }

  async sendPushNotification(
    deviceToken: string,
    title: string,
    body: string,
    data?: any,
  ): Promise<string> {
    const message = {
      notification: {
        title,
        body,
      },
      token: deviceToken,
      data: data || {}, // Optional custom data
    };

    try {
      console.log("Send notification to device:", message);
      const response = await admin.messaging().send(message);
      console.log('Notification sent:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error.message);
    }
  }
}
