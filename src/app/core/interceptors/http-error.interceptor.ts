import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/** Normaliza erros do backend (GlobalExceptionHandler) em uma mensagem amigável. */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let message = 'Erro inesperado. Tente novamente.';
      if (err.status === 0) message = 'Não foi possível conectar ao servidor PayPulse.';
      else if (err.error?.message) message = err.error.message;
      else if (err.status === 400) message = 'Dados inválidos enviados para a API.';
      else if (err.status === 404) message = 'Recurso não encontrado.';
      return throwError(() => new Error(message));
    })
  );
