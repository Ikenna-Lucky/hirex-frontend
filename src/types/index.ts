export interface Company {
  id: string;
  name: string;
  email: string;
  logoUrl?: string | null;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  location?: string | null;
  description?: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  location?: string | null;
  type?: "full-time" | "part-time" | "contract" | "remote" | "hybrid" | null;
  salaryMin?: string | null;
  salaryMax?: string | null;
  salaryCurrency: string;
  status: "draft" | "active" | "closed" | "archived";
  applicationCount: number;
  closesAt?: string | null;
  createdAt: string;
  company?: Partial<Company>;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

export type ApplicationStage =
  | "applied"
  | "screening"
  | "shortlisted"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  stage: ApplicationStage;
  aiScore?: number | null;
  aiSummary?: string | null;
  aiStrengths?: string | null;
  aiWeaknesses?: string | null;
  scoringStatus: "pending" | "processing" | "completed" | "failed";
  cvUrl: string;
  coverLetter?: string | null;
  notes?: string | null;
  scoredAt?: string | null;
  createdAt: string;
  candidate: Candidate;
  job?: Partial<Job>;
}

export interface SubscriptionPlan {
  key: "starter" | "growth" | "scale";
  name: string;
  priceNGN: number;
  jobLimit: number;
  tagline: string;
  features: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
