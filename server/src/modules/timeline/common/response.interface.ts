import { Timeline } from "../entities/timeline.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Timeline | Timeline[];
}