import { Report } from '../entities/report.entity';

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Report | Report[];
}