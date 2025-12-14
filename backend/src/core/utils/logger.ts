import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
    name: "marketplace-mapper-backend",
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    transport: !isProduction
        ? {
            // Pretty logs in dev; pure JSON in prod
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
            },
        }
        : undefined,
    formatters: {
        level(label: string) {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});
