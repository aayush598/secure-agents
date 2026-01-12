import { SDKError, UnauthorizedError } from '../core/error';

export async function httpRequest<T>(
  url: string,
  options: RequestInit,
  timeoutMs = 100_000,
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (res.status === 401) {
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      const body = await res.text();
      throw new SDKError('Request failed', res.status, body);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new SDKError('Request timeout');
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}
