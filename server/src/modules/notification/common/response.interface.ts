import {Notification} from '../entities/notification.entity';

export interface ResponseDto {
    statusCode: number;
    message: string;
    data?: Notification | Notification[];
}