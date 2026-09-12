// src/common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If data is already wrapped with a message and statusCode, don't double-wrap it
        if (data && typeof data === 'object' && 'statusCode' in data && 'message' in data) {
          return data;
        }

        // Standard auto-wrapping for raw return values
        return {
          statusCode: response.statusCode,
          message: 'Request successful',
          data: data ?? null,
        };
      }),
    );
  }
}