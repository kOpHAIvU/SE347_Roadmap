import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReportDto {
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
