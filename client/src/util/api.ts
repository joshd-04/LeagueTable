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
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (e) {
    throw e;
  }
}
