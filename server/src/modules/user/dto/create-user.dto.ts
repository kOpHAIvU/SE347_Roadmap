import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsString()
    @IsNotEmpty()
    @Exclude()
    password: string;

    @IsString()
    fullName: string;

    @IsString()
    gender: string;

    @IsString()
    email: string;

}
