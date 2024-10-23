import { IsNotEmpty, IsString } from "class-validator";

export class CreateTimelineDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    roadmap: number;

    isActive: boolean;
    
}
