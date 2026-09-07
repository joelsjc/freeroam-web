export type NewsConfidence =
  | "official"
  | "multi_source"
  | "probable"
  | "rumor"
  | "leak"
  | "unverified";

export interface NewsSourceRef {
  id: string;
  name: string;
  url?: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  summary: string;
  category: string;
  confidence: NewsConfidence;
  importance?: "low" | "medium" | "high" | "urgent";
  sourcePublishedAt?: string;
  detectedAt?: string;
  processedAt?: string;
  sources?: NewsSourceRef[];
  sourceCount?: number;
}

export interface LoginResponse {
  accessToken: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface NewsListResponse {
  data: NewsEvent[];
  total?: number;
}
