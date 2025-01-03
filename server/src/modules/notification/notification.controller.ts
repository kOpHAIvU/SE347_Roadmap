import { UserService } from './../user/user.service';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Inject,
    Sse,
    ParseIntPipe,
    UseGuards,
    Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Roadmap } from '../roadmap/entities/roadmap.entity';
import { Server } from 'socket.io';
import { Observable, of } from 'rxjs';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { GmailNotificationStrategy } from './strategy/gmail-notification.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ConfigService } from '@nestjs/config';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly gmailService: GmailNotificationStrategy,
        private readonly userService: UserService,
        private readonly firebaseService: FirebaseService,
        private readonly configureService: ConfigService,
    ) {}

    @EventPattern('Create_new_roadmap')
    async handlePostNotificationWhenCreateNewRoadmap(@Payload() newRoadmap: Roadmap) {
        console.log('Create notification:', newRoadmap);
        const notificationTitle = 'New Roadmap Has Been Uploaded!';
        const notificationContent = `Welcome to the latest updates! We just released a new Roadmap to help you easily track and plan for the future of the system.\n
                The title of roadmap is: ${newRoadmap.title}\n
                Please check it out and let us know if you have any feedback or questions.\n`;
        const urlRoadmap = `${process.env.WEBSITE_DOMAIN}/roadmap/ + newRoadmap.id`;
        const notificationHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                            background-color: #f9f9f9;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                            border: 1px solid #eaeaea;
                        }
                        .header {
                            background-color: #a58abd;
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                        }
                        .content {
                            padding: 20px;
                            color: #333333;
                        }
                        .footer {
                            text-align: center;
                            background-color: #f2f2f2;
                            padding: 10px;
                            font-size: 12px;
                            color: #777777;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            margin: 20px 0;
                            background-color: #a280c0;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                        .button:hover {
                            background-color: #a280c0;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>New Roadmap Uploaded!</h1>
                        </div>
                        <div class="content">
                            <p>Dear User,</p>
                            <p>Welcome to the latest updates! We just released a new Roadmap to help you easily track and plan for the future of the system.</p>
                            <p><strong>Roadmap Title:</strong> ${newRoadmap.title}</p>
                            <p>We encourage you to check it out and let us know your feedback.</p>
                            <a href="${urlRoadmap}" class="button">View Roadmap</a>
                        </div>
                        <div class="footer">
                            <p>Thank you for staying updated with us!</p>
                            <p>© 2025 Your Company Name. All Rights Reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`;

        const usersResponse = await this.userService.findAllFirebase();
        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [usersResponse.data];
        console.log('Users:', users);
        for (let i = 0; i < users.length; i++) {
            console.log('User get notification:', users[i]);
            if (users[i].deviceToken) {
                // console.log("User get notifications: ", users[i].email);
                let deviceToken = users[i].deviceToken;
                const response = await this.firebaseService.sendPushNotification(
                    deviceToken,
                    notificationTitle,
                    notificationContent,
                );
                console.log('Send notification to device:', response);
            }
            if (users[i].email) {
                const sendGmail = await this.gmailService.sendEmail(
                    users[i].email,
                    notificationTitle,
                    notificationContent,
                    notificationHtml,
                );
                console.log('Send Gmail:', sendGmail);
            }
        }

        const createNotificationDto = {
            title: notificationTitle,
            content: notificationContent,
            posterId: 1,
            receiverId: null,
            isActive: true,
            type: 'gmail',
            isCheck: false,
        };

        try {
            const resultResponse = await this.notificationService.create(createNotificationDto);

            if (resultResponse.statusCode === 201) {
                const newNotification = Array.isArray(resultResponse.data)
                    ? resultResponse.data[0]
                    : resultResponse.data;
                console.log('New notification:', newNotification);
                // const sizeOfQuery = this.notificationWorker.addNotification(newNotification);
                // const response = this.notificationGateway.handleSendNotificationWhenHavingNewRoadmap(newNotification);
                // console.log('Response:', response);
            } else {
                console.error('Failed to create notification');
            }
        } catch (error) {
            console.error('Error creating notification:', error.message);
        }
    }

    // @Get('item/:id')
    // async findOne(@Param('id') id: string) {
    //   const retrieveRoadmap = await this.notificationService.findOne(+id);
    //   const roadmap  = Array.isArray(retrieveRoadmap.data)
    //                     ? retrieveRoadmap.data[0]
    //                     : retrieveRoadmap.data;
    //   const response = this.notificationGateway.handleSendNotificationWhenHavingNewRoadmap("Hi roadmap");
    //   return this.notificationService.findOne(+id);
    // }

    @Post('gmail')
    async sendGmail() {}

    @Post('new')
    @UseGuards(JwtAuthGuard, RoleGuard)
    async create(@Body() createNotificationDto: CreateNotificationDto) {
        return await this.notificationService.create(createNotificationDto);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('admin')
    async findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
        return await this.notificationService.findAll(page, limit);
    }

    @Get('item/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.notificationService.findOne(+id);
    }

    // api này để lấy tất cả các thông báo của một user
    @Get('all/owner')
    @UseGuards(JwtAuthGuard)
    async findNotificationsByUserId(
        @Req() req: any,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        console.log('User ID:', req.user.userId);
        return await this.notificationService.findNotificationsByUser(req.user.userId, page, limit);
    }

    @Patch('item/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
        return await this.notificationService.update(id, updateNotificationDto);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.notificationService.remove(id);
    }
}
