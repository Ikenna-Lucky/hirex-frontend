const COMPANY_KEY = "hirex_company";

export interface StoredCompany {
  id: string;
  name: string;
  email: string;
  logoUrl?: string | null;
  industry?: string | null;
  isVerified?: boolean;
}

// Tokens are now httpOnly cookies set by the API — JS cannot read them.
// We only store non-sensitive company display data in localStorage.

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

export function clearStoredCompany(): void {
  localStorage.removeItem(COMPANY_KEY);
}

// Used for client-side UI decisions only — actual security is enforced by the API cookie
export function isAuthenticated(): boolean {
  return !!getStoredCompany();
}
