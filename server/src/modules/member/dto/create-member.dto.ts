import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateMemberDto {

    @IsNumber()
    @IsNotEmpty()
    performance: number;

    @IsNotEmpty()
    member: number;

    @IsNotEmpty()
    team: number;

    isActive: boolean;

}


