import { time } from 'console';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNodeDto {
    
    @IsString()
    @IsNotEmpty()
    level: number;

    @IsNumber()
    @IsNotEmpty()
    xAxis: number;

    @IsNumber()
    @IsNotEmpty()
    yAxis: number;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    @IsBoolean()
    tick: boolean;

    @IsNumber()
    @IsNotEmpty()
    dueTime: number;

    @IsString()
    attachFile: string;

    @IsString()
    content: string;

    @IsString()
    detail: string;

    @IsNumber()
    roadmap?: number;

    @IsNumber()
    timeline?: number;

}
