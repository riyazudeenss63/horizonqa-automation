import { LighthouseReport, LogEntry, QASettings } from '../types';

export const DEFAULT_SETTINGS: QASettings = {
  baseUrl: 'https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com',
  loginUrl: 'https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com/login',
  lighthouseUrl: 'https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com',
  username: 'qa_tester@horizon.com',
  password: '',
  headless: true,
  timeout: 120,
  qualityGatePerformance: 50,
};

export const INITIAL_REPORT: LighthouseReport = {
  id: 'report-baseline-01',
  url: 'https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com',
  timestamp: new Date().toISOString(),
  durationSeconds: 3.4,
  scores: {
    performance: 78,
    accessibility: 88,
    best_practices: 92,
    seo: 85,
  },
  metrics: {
    first_contentful_paint: '1.4 s',
    largest_contentful_paint: '2.8 s',
    speed_index: '2.1 s',
    total_blocking_time: '240 ms',
    cumulative_layout_shift: '0.042',
  },
  failed_audits: [
    {
      id: 'unused-javascript',
      title: 'Reduce unused JavaScript',
      description: 'Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.',
      score: 0.62,
      category: 'performance',
    },
    {
      id: 'render-blocking-resources',
      title: 'Eliminate render-blocking resources',
      description: 'Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.',
      score: 0.71,
      category: 'performance',
    },
    {
      id: 'color-contrast',
      title: 'Background and foreground colors do not have a sufficient contrast ratio',
      description: 'Low-contrast text is difficult or impossible for many users to read. Ensure minimum WCAG AA ratio of 4.5:1.',
      score: 0.81,
      category: 'accessibility',
    },
    {
      id: 'meta-description',
      title: 'Document does not have a meta description',
      description: 'Meta descriptions may be included in search results to concisely summarize page content.',
      score: 0.0,
      category: 'seo',
    },
  ],
  recommendations: [
    'Performance needs improvement. Optimize large resources and reduce main-thread work.',
    'Improve accessibility by checking ARIA labels, contrast, semantic HTML and keyboard navigation.',
    'Improve SEO metadata, page structure and crawlability.',
    'Review Lighthouse audit: Reduce unused JavaScript',
    'Review Lighthouse audit: Eliminate render-blocking resources',
    'Review Lighthouse audit: Background and foreground colors do not have a sufficient contrast ratio',
    'Review Lighthouse audit: Document does not have a meta description',
  ],
};

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-11 12:35:10',
    level: 'INFO',
    source: 'horizon_qa',
    message: 'Horizon QA Automation Framework initialized (Session: Playwright + Lighthouse Engine)',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-11 12:35:11',
    level: 'INFO',
    source: 'config.settings',
    message: 'Loaded configuration: BASE_URL=https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com, HEADLESS=true',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-11 12:35:12',
    level: 'INFO',
    source: 'LighthouseScanner',
    message: 'Baseline performance audit completed for target URL: https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-11 12:35:13',
    level: 'INFO',
    source: 'LighthouseParser',
    message: 'Extracted scores: Performance=78, Accessibility=88, Best Practices=92, SEO=85',
  },
  {
    id: 'log-5',
    timestamp: '2026-09-11 12:35:13',
    level: 'INFO',
    source: 'LighthouseRecommender',
    message: 'Generated 7 actionable optimization directives based on diagnostic thresholds',
  },
];
