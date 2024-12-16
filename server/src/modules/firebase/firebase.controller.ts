import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CreateFirebaseDto } from './dto/create-firebase.dto';
import { UpdateFirebaseDto } from './dto/update-firebase.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('new')
  async sendPushNotification(
    @Body() deviceToken: string,
    @Body() title: string,
    @Body() body: string,
    @Body() data?: any,
  ) {
    deviceToken = "diAIwCbfGx5yNA4wJmrSFz:APA91bGydlGe4vFQi6q1AXm7djrKZTCPOswKPeZhdTUISvUdesZ3xrvrzbc4TgxgN-i_bG7dmgGmGJRRa8BC-WxeXhcpk-FH5-Y-KVpbuaDhSWtZymXgAEM"
    title = "Test"
    body = "This is test notification"
    data = {
      "key": "value"
    }
    return this.firebaseService.sendPushNotification(deviceToken, title, body, data);
  }
  
}
