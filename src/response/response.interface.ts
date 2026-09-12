export interface ResponseApi<T = unknown> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string | null;
}