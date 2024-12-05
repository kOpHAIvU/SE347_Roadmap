import { IsNotEmpty, IsNumber } from 'class-validator';
import { time } from 'console';
export class CreateFavoriteDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    time: Date;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    roadmapId: number;
}
