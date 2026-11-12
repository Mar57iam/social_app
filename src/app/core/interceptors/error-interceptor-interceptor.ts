import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../../shared/ui/alert/alert.service';

export const errorInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        alertService.showError(getErrorMessage(error));
      }

      return throwError(() => error);
    }),
  );
};

function getErrorMessage(error: HttpErrorResponse): string {
  const responseMessage = error.error?.message;
  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (error.status === 0) {
    return 'Unable to connect. Check your internet connection and try again.';
  }

  if (error.status === 401) {
    return 'Your email or password is incorrect, or your session has expired.';
  }

  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.status === 404) {
    return 'The requested information could not be found.';
  }

  if (error.status >= 500) {
    return 'A server error occurred. Please try again later.';
  }

  return 'Something went wrong. Please try again.';
}
