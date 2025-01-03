import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupDivisionDto {
    @IsString()
    @IsNotEmpty()
    teamId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    timelineId: number;

    // role means 1:administrator, 2:editor, 3: view, 4: onPending...
    @IsNumber()
    role: number;
}
