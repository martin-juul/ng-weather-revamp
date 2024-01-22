import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { LocalStorageCacheBackend } from './local-storage-cache-backend';
import { inject } from '@angular/core';

export class CachingInterceptor implements HttpInterceptor {
  private backend = inject(LocalStorageCacheBackend);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // only GET requests can be cached
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const item = this.backend.get<HttpResponse<unknown>>(req.url);
    if (item) {
      // subtle "bug" but the cache backend returns plain javascript objects, so we construct the class ourselves.
      return of(new HttpResponse(item));
    }

    return next.handle(req)
      .pipe(tap(res => {
        if (res instanceof HttpResponse) {
          this.backend.set(req.url, res);
        }
      }));
  }
}
