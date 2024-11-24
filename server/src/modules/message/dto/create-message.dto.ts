import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMessageDto {

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    sendTime: Date;

    @IsNotEmpty()
    @IsBoolean()
    check: boolean;

    @IsNotEmpty()
    @IsNumber()
    sender: number;

    @IsNotEmpty()
    @IsNumber()
    team: number;
}
