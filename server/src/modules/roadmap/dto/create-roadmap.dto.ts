import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoadmapDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    avatar: string;

    @IsString()
    @IsNotEmpty()
    content: string;
    
    @IsNumber()
    owner: number;

    @IsNumber()
    @IsOptional()
    clone: number;

    @IsNumber()
    @IsOptional()
    react: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;  

    type: string;
}


