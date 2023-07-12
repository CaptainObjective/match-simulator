import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors, Injectable } from '@nestjs/common';
import { of, tap } from 'rxjs';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private lastSuccessfulInvocationTime = 0;

  intercept(context: ExecutionContext, next: CallHandler) {
    const invocationTime = Date.now();
    const timeThatUserHasToWaitBetweenInvocations = 5 * 60 * 1000;

    const isInvocationAllowed =
      this.lastSuccessfulInvocationTime + timeThatUserHasToWaitBetweenInvocations > invocationTime;

    if (isInvocationAllowed) return of({ message: 'Rate limit reached. Please try again later' });

    return next.handle().pipe(
      tap(() => {
        this.lastSuccessfulInvocationTime = invocationTime;
      }),
    );
  }
}

export const RateLimit = () => UseInterceptors(RateLimitInterceptor);
