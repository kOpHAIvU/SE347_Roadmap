import { Team } from "../entities/team.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Team | Team[];
}