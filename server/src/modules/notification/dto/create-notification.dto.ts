import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    type: string;

    @IsNumber()
    posterId: number;

    @IsNumber()
    receiverId: number;

    @IsBoolean()
    @IsOptional()
    isCheck?: boolean;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;  

}
