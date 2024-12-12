import { Node } from "../entities/node.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Node | Node[];
}