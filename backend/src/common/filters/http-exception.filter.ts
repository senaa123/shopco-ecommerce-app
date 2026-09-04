import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

/** `402` -> `"Payment Required"`, falling back to a generic label. */
function reasonFromStatus(status: number): string {
  const name: string | undefined = HttpStatus[status];
  if (!name) {
    return status >= 500 ? 'Internal Server Error' : 'Error';
  }
  return name
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Global exception filter that normalises every error into a consistent JSON
 * shape:
 *
 * ```json
 * {
 *   "statusCode": 400,
 *   "message": "…",
 *   "error": "Bad Request",
 *   "path": "/api/…",
 *   "timestamp": "2026-01-01T00:00:00.000Z"
 * }
 * ```
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';
    let error = reasonFromStatus(status);

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as Record<string, unknown>;
        message = (body.message as string | string[]) ?? exception.message;
        error = (body.error as string) ?? reasonFromStatus(status);
      }
    }

    if (status >= 500) {
      this.logger.error(exception);
    }

    const body: ErrorBody = {
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }
}
