import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { errorInterceptorInterceptor } from './error-interceptor-interceptor';
import { AlertService } from '../../shared/ui/alert/alert.service';

describe('errorInterceptorInterceptor', () => {
  let alertService: jasmine.SpyObj<AlertService>;

  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => errorInterceptorInterceptor(req, next));

  beforeEach(() => {
    alertService = jasmine.createSpyObj<AlertService>('AlertService', ['showError']);
    TestBed.configureTestingModule({
      providers: [{ provide: AlertService, useValue: alertService }],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('shows the server error through the alert service and rethrows it', () => {
    const request = new HttpRequest('GET', '/test');
    const httpError = new HttpErrorResponse({ status: 500 });
    let receivedError: unknown;

    interceptor(request, () => throwError(() => httpError)).subscribe({
      error: (error: unknown) => receivedError = error,
    });

    expect(alertService.showError).toHaveBeenCalledWith(
      'A server error occurred. Please try again later.',
    );
    expect(receivedError).toBe(httpError);
  });
});
