import { Progress } from "../entities/progress.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Progress| Progress[];
}