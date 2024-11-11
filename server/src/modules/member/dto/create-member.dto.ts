import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateMemberDto {

    @IsNumber()
    @IsNotEmpty()
    performance: number;

    @IsNotEmpty()
    member: number;

    @IsNotEmpty()
    timeline: number;

    isActive: boolean;

    permission: number;

}


