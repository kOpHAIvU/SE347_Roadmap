import { Comment } from '../entities/comment.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Comment | Comment[] ;
  }