import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
    // @IsEmail()
    // @IsNotEmpty()
    // email: string;

    // @IsEmail()
    // @IsNotEmpty()
    // username: string;

    @IsString()
  @IsOptional() // Cho phép không bắt buộc
  username?: string;

  @IsEmail()
  @IsOptional() // Cho phép không bắt buộc
  email?: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
