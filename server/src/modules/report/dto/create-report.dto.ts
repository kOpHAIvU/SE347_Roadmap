import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReportDto {
    @IsString()
    title: string;

    type: string;

    @IsString()
    content: string;

    @IsNumber()
    posterId?: number;

    @IsNumber()
    receiverId?: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;  
}
