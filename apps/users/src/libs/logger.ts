import winston from 'winston';

export const initLogger = () => {
  const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json()),
  });

  return logger;
};
