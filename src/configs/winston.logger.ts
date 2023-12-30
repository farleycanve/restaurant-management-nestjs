import { createLogger, format, transports } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const options = {
  file: {
    filename: 'log/error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
};

// for development environment
const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.ms(),
    nestWinstonModuleUtilities.format.nestLike('Interview', {
      colors: true,
      prettyPrint: true,
    }),
  ),
  transports: [new transports.Console(options.console)],
};

// for production environment
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new DailyRotateFile({
      filename: 'log/combine/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      level: 'info',
    }),
    new DailyRotateFile({
      filename: 'log/error/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      level: 'error',
    }),
  ],
};

// export log instance based on the current environment
const instanceLogger =
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const instance = createLogger(instanceLogger);
