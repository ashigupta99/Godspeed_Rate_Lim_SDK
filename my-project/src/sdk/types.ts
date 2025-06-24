export interface Context {
  userId: string;
  orgId: string;
  service: string;
  userTier: string;
  currentUsage: number;
  quotaLimit: number;
  peakTime: boolean;
}

export interface Rule {
  condition: string;
  action: string;
}

export interface TokenPayload {
  userId: string;
  orgId: string;
  iat?: number;
  exp?: number;
}