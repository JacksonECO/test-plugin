import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextCoreService } from './context-core.service';

@Injectable()
export class ContextCoreInterceptor implements NestInterceptor {
  constructor(private contextService: ContextCoreService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return new Observable((observer) => {
      this.contextService.run(() => {
        this.contextService.importRequest(request);
        next.handle().subscribe(observer);
      });
    });
  }
}
