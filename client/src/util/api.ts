/**
 * Fetches from given URL
 * @param url Request URL
 * @param options Fetch options, default values: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }
 * @returns JSON-parsed response
 */

export async function fetchAPI(
  url: string | URL | globalThis.Request,
  options: RequestInit
) {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(8000),
    });
    const data = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // Network error, timeout, JSON parse error, etc.
    console.error('fetchAPI failed:', err);

    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return {
        status: 'error',
        statusCode: 500,
        message: 'Request timeout - server may be down',
      };
    }

    if (err.message?.includes('Failed to fetch')) {
      return {
        status: 'error',
        statusCode: 500,
        message: 'Backend unreachable. Server may be down.',
      };
    }

    return {
      status: 'error',
      statusCode: 500,
      message: err.message || 'Network error',
    };
  }
}
