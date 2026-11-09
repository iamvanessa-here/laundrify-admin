export const API_BASE = 'http://localhost:3001/api';
const TOKEN_KEY = 'laundrify_token';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/** Header Authorization untuk dipakai di setiap fetch ke API yang dilindungi. */
export const authHeader = (): Record<string, string> => ({
  Authorization: `Bearer ${getToken()}`,
});
