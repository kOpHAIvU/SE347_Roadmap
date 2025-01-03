import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTimelineDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    avatar?: string;

    startTime?: Date;
    dueTime?: Date;
    
    roadmap: number;

    leader: number;

    isActive: boolean;
}
