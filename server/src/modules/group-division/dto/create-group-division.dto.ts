import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGroupDivisionDto {

    @IsString()
    @IsNotEmpty()
    teamId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    timelineId: number;

    @IsNotEmpty()
    timeOfParticipation: Date;
}
