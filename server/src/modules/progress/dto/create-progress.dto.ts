import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProgressDto {

    @IsNumber()
    @IsNotEmpty()
    node: number;

    @IsNumber()
    @IsNotEmpty()
    timelineId: number;

    @IsNumber()
    @IsNotEmpty()
    teamId: number;

    @IsNumber()
    @IsNotEmpty()
    memberId: number;

    createdAt: Date;

    deletedAt: Date | null;
}
