import { GroupDivision } from "../../group-division/entities/group-division.entity";
import { Favorite } from "../entities/favorite.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Favorite | Favorite[];
}