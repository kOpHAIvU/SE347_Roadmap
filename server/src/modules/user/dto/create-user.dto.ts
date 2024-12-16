import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    username: string;
    
    @Exclude()
    password: string;

    @IsString()
    fullName: string;

    @IsString()
    gender: string;

    @IsString()
    email: string;

    @IsString()
    role: number;

    @IsString()
    avatar: string;

    @IsString()
    deviceToken: string;

}
