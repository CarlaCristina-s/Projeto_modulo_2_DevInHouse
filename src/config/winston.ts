import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

 const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',  // nivel de criticidade
  format: combine(
    timestamp({
      format: 'DD-MM-YYYY hh:mm:ss.SSS A',
    }),
    align(),
    printf((info: any) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({
    filename: 'logs.txt'
  }), new winston.transports.Console()],
});

export default logger
