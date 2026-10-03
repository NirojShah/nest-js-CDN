interface ResponseDto<T = unknown> {
    statusCode: number;
    message: string;
    data?: T;
    error?: string | null;
}

export default ResponseDto;