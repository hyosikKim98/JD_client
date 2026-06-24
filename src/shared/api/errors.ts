// CLAUDE.md §9 - 오류 정규화 타입
export type AppError =
  | { type: 'network'; retryable: true }
  | { type: 'unauthorized'; retryable: boolean }
  | { type: 'forbidden'; retryable: false }
  | { type: 'validation'; fields?: Record<string, string> | undefined }
  | { type: 'conflict'; code: string }
  | { type: 'notFound'; code?: string | undefined }
  | { type: 'server'; retryable: true }
  | { type: 'unknown'; retryable: false };

export class ApiError extends Error {
  constructor(
    public readonly appError: AppError,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP 상태 코드 → AppError 변환
export function normalizeHttpError(
  status: number,
  data: unknown,
): AppError {
  switch (status) {
    case 401:
      return { type: 'unauthorized', retryable: false };
    case 403:
      return { type: 'forbidden', retryable: false };
    case 404:
      return { type: 'notFound', code: extractCode(data) };
    case 409:
      return { type: 'conflict', code: extractCode(data) ?? 'CONFLICT' };
    case 422: {
      const fields = extractValidationFields(data);
      return { type: 'validation', fields };
    }
    case 500:
    case 502:
    case 503:
    case 504:
      return { type: 'server', retryable: true };
    default:
      return { type: 'unknown', retryable: false };
  }
}

function extractCode(data: unknown): string | undefined {
  if (
    data !== null &&
    typeof data === 'object' &&
    'code' in data &&
    typeof (data as Record<string, unknown>)['code'] === 'string'
  ) {
    return (data as Record<string, string>)['code'];
  }
  return undefined;
}

function extractValidationFields(data: unknown): Record<string, string> | undefined {
  if (
    data !== null &&
    typeof data === 'object' &&
    'fields' in data &&
    typeof (data as Record<string, unknown>)['fields'] === 'object'
  ) {
    return (data as { fields: Record<string, string> }).fields;
  }
  return undefined;
}

// AppError → 사용자에게 보여줄 안전한 메시지 (서버 메시지 직접 노출 금지)
export function toUserMessage(error: AppError): string {
  switch (error.type) {
    case 'network':
      return '인터넷 연결을 확인하고 다시 시도해 주세요.';
    case 'unauthorized':
      return '다시 로그인해 주세요.';
    case 'forbidden':
      return '이 작업을 수행할 권한이 없어요.';
    case 'validation':
      return '입력한 내용을 확인해 주세요.';
    case 'conflict':
      return '이미 처리된 요청이에요.';
    case 'notFound':
      return '요청한 항목을 찾을 수 없어요.';
    case 'server':
      return '서버에 일시적인 문제가 생겼어요. 잠시 후 다시 시도해 주세요.';
    default:
      return '문제가 발생했어요. 다시 시도해 주세요.';
  }
}
