import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsNumber()
    posterId: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;  

}
