import { IsNotEmpty, IsString } from "class-validator";

export class CreateTeamDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    avatar: string;

    @IsNotEmpty()
    timeline: number;

    @IsNotEmpty()
    leader: number;

    isActive: boolean;
}
