import { Message } from "../entities/message.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Message | Message[];
}