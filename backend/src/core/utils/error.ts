import { ErrorCode } from "../../shared/types/error-code";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: ErrorCode;
    public readonly details?: unknown;

    constructor(
        message: string,
        options: {
            statusCode?: number;
            code?: ErrorCode;
            details?: unknown;
        } = {},
    ) {
        super(message);
        this.name = "AppError";
        this.statusCode = options.statusCode ?? 500;
        this.code = options.code ?? "INTERNAL_ERROR";
        this.details = options.details;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export function isAppError(err: unknown): err is AppError {
    return err instanceof AppError;
}

export interface ErrorResponseBody {
    success: false;
    message: string;
    code: ErrorCode;
    details?: unknown;
}

export function toErrorResponse(err: unknown): ErrorResponseBody {
    if (isAppError(err)) {
        return {
            success: false,
            message: err.message,
            code: err.code,
            ...(err.details ? { details: err.details } : {}),
        };
    }

    return {
        success: false,
        message: err instanceof Error ? err.message : "Unexpected error",
        code: "INTERNAL_ERROR",
    };
}
