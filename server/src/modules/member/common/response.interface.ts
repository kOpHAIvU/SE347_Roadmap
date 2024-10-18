import { Member } from "../entities/member.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Member | Member[];
}