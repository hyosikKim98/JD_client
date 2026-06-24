import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { ApiError, normalizeHttpError } from './errors';

// 환경 변수 — 비밀값 금지, base URL과 공개 설정만 허용
const BASE_URL = Constants.expoConfig?.extra?.['apiBaseUrl'] as string | undefined
  ?? (process.env['EXPO_PUBLIC_API_BASE_URL'] as string | undefined)
  ?? 'http://localhost:8080';

const TIMEOUT_MS = Number(process.env['EXPO_PUBLIC_API_TIMEOUT_MS'] ?? '10000');

// 토큰 갱신 직렬화: 동시 401 응답이 여러 번 갱신 요청 보내지 않도록
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function drainQueue(token: string | null, error: unknown) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

// 런타임에 주입되는 콜백 — 순환 의존 방지
interface TokenCallbacks {
  getAccessToken: () => string | null;
  refreshTokens: () => Promise<string>;
  onAuthFailure: () => void;
}

let tokenCallbacks: TokenCallbacks | null = null;

export function configureApiClient(callbacks: TokenCallbacks) {
  tokenCallbacks = callbacks;
}

function buildClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
  });

  // 요청 인터셉터 — 액세스 토큰 주입
  client.interceptors.request.use((config) => {
    const token = tokenCallbacks?.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  // 응답 인터셉터 — 401 처리 및 오류 정규화
  client.interceptors.response.use(
    (res) => res,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        throw new ApiError({ type: 'unknown', retryable: false }, '알 수 없는 오류');
      }

      const status = error.response?.status;
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // 네트워크 오류 (응답 없음)
      if (!error.response) {
        throw new ApiError({ type: 'network', retryable: true }, '네트워크 오류');
      }

      // 401: 토큰 갱신 시도 (단일 갱신, 나머지 큐잉)
      if (status === 401 && !originalRequest._retry && tokenCallbacks) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${token}` };
            originalRequest._retry = true;
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await tokenCallbacks.refreshTokens();
          isRefreshing = false;
          drainQueue(newToken, null);
          originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${newToken}` };
          return client(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          drainQueue(null, refreshError);
          tokenCallbacks.onAuthFailure();
          throw new ApiError({ type: 'unauthorized', retryable: false }, '세션이 만료되었어요');
        }
      }

      const appError = normalizeHttpError(status ?? 0, error.response?.data);
      throw new ApiError(appError, `HTTP ${status}`);
    },
  );

  return client;
}

export const apiClient = buildClient();

// 편의 래퍼
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.get(url, config);
  return res.data;
}

export async function apiPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.post(url, data, config);
  return res.data;
}

export async function apiPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.put(url, data, config);
  return res.data;
}

export async function apiPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.patch(url, data, config);
  return res.data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<T> = await apiClient.delete(url, config);
  return res.data;
}
