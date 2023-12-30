// src/middleware/logger.middleware.ts

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers } = req;
    if (process.env.NODE_ENV === 'production') {
      this.logger.log(
        `[${method}] ${originalUrl} header:${JSON.stringify(headers)}`,
      );
    }

    next();
  }
}
