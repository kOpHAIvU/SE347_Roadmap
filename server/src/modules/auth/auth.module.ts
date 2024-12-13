import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import {JwtModule} from '@nestjs/jwt';
import { JwtStrategy } from './common/jwt-strategy';
import { RoleModule } from '../role/role.module';
import { ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    RoleModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60m'), // Giá trị mặc định là '60m'
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
