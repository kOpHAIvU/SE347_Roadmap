import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roadmap } from 'src/modules/roadmap/entities/roadmap.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    poster: number;

    @IsString()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    roadmap: number;

    // @IsNumber()
    // left: number;

    // @IsNumber()
    // right: number;

    @IsNumber()
    parentComment?: number;

    @IsNumber()
    isActive?: boolean;

    @IsNumber()
    node: number;
}
