import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
    @IsNotEmpty()
    isActive: boolean;
}
