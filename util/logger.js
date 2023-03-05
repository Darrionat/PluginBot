import {createLogger, transports, format} from 'winston';

const logFormat = format.printf(({level, message, timestamp, stack}) => {
  return `${timestamp} - ${level} - ${stack || message}`;
});

const logger = createLogger({
  format: format.combine(
      format.colorize(),
      format.timestamp({format: 'YYYY-MM-DD HH:mm:SS'}),
      format.errors({stack: true}),
      logFormat,
  ),
  transports: [new transports.Console()],
});

export default {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
};
