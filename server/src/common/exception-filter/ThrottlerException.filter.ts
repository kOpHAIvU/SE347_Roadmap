import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response
      .status(429)
      .json({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
      });
  }
}
