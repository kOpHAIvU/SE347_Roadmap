import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTimelineDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    avatar?: string;
    
    roadmap: number;

    leader: number;

    isActive: boolean;
}
