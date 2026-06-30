import { Params } from 'nestjs-pino';

export const pinoLoggerConfig: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              singleLine: true,
              colorize: true,
            },
          }
        : undefined,
    autoLogging: false,
  },
};
