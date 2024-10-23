import { Roadmap } from "../entities/roadmap.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Roadmap | Roadmap[];
}