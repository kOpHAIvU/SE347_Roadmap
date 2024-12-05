import { GroupDivision } from "../../group-division/entities/group-division.entity";

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: GroupDivision | GroupDivision[];
}