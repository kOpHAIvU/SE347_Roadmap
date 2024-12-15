import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Roadmap } from "src/modules/roadmap/entities/roadmap.entity";
import { User } from "src/modules/user/entities/user.entity";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    poster: number;

    @IsNumber()
    @IsNotEmpty()
    roadmap: number;

    @IsNumber()
    @IsNotEmpty()
    parentComment: number;

    @IsNumber()
    isActive?: boolean;
}
