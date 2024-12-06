import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    @IsBoolean()
    check: boolean;

    @IsNotEmpty()
    @IsNumber()
    senderId: number;

    @IsNotEmpty()
    @IsNumber()
    teamId: number;
}
