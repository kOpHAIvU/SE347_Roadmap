import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProgressDto {

    @IsNumber()
    @IsNotEmpty()
    node: number;

    @IsNumber()
    @IsNotEmpty()
    groupDivision: number;

    createdAt: Date;

    deletedAt: Date | null;
}
