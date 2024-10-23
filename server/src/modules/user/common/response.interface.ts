import { User } from "../entities/user.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: User | User[];
}