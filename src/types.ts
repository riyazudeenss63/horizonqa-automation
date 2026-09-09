export interface LighthouseScores {
  performance: number;
  accessibility: number;
  best_practices: number;
  seo: number;
}

export interface LighthouseMetrics {
  first_contentful_paint: string;
  largest_contentful_paint: string;
  speed_index: string;
  total_blocking_time: string;
  cumulative_layout_shift: string;
}

export interface FailedAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  category?: 'performance' | 'accessibility' | 'best_practices' | 'seo';
}

export interface LighthouseReport {
  id: string;
  url: string;
  timestamp: string;
  durationSeconds: number;
  scores: LighthouseScores;
  metrics: LighthouseMetrics;
  failed_audits: FailedAudit[];
  recommendations: string[];
}

export type TestStatus = 'idle' | 'running' | 'passed' | 'failed' | 'skipped';

export interface TestStep {
  name: string;
  selector?: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  durationMs?: number;
  detail?: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  durationMs?: number;
  failureReason?: string;
  screenshot?: string;
  steps: TestStep[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
  message: string;
}

export interface QASettings {
  baseUrl: string;
  loginUrl: string;
  lighthouseUrl: string;
  username: string;
  password: string;
  headless: boolean;
  timeout: number;
  qualityGatePerformance: number;
}
