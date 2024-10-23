import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import {JwtModule} from '@nestjs/jwt';
import { JwtStrategy } from './common/jwt-strategy';
import {authConstants} from './common/auth.constants';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    JwtModule.register({
      secret: authConstants.secret,
      signOptions: {
        expiresIn: '30m',
      },})
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
