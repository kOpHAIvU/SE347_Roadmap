import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { time } from 'console';
export class CreateFavoriteDto {
    @IsNotEmpty()
    time?: Date;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    roadmapId: number;
}
