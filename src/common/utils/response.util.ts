// src/common/utils/response.util.ts
import type { ResponseApi } from '../../response/response.interface.js';

export function createResponse<T>(
  message: string,
  data?: T,
  statusCode = 200,
  error: string | null = null,
): ResponseApi<T> {
  return {
    statusCode,
    message,
    ...(data !== undefined && { data }),
    error,
  };
}