import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('new')
  async sendPushNotification(
    @Body() deviceToken?: string,
    @Body() title?: string,
    @Body() body?: string,
    @Body() data?: any,
  ) {
    deviceToken = "eWaeyfIATDAz_i8fjZPKQ4:APA91bGybAZlAt0vlDxWiQ01CWXeZZgHmNMVCS82ehSvQzVS9A8X3WmjUJjkjLw6feDRZNllAtISUT0NpN3HZBPjv7sTA6knPP-KP8fOJiQVK__wTu2RaGc"
    title = "Test"
    body = "This is test notification"
    data = {
      "key": "value"
    }
    return this.firebaseService.sendPushNotification(deviceToken, title, body, data);
  }
  
}
