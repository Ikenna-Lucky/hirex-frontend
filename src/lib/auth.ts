const TOKEN_KEY = "hirex_token";
const COMPANY_KEY = "hirex_company";

export interface StoredCompany {
  id: string;
  name: string;
  email: string;
  logoUrl?: string | null;
  industry?: string | null;
  isVerified?: boolean;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(COMPANY_KEY);
}

export function getStoredCompany(): StoredCompany | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COMPANY_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredCompany;
  } catch {
    return null;
  }
}

export function setStoredCompany(company: StoredCompany): void {
  localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
