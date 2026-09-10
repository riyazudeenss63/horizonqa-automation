import React, { useState } from 'react';
import {
  Gauge,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Download,
  Clock,
  History,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info
} from 'lucide-react';
import { LighthouseReport, QASettings } from '../types';

interface LighthouseScannerViewProps {
  currentReport: LighthouseReport | null;
  history: LighthouseReport[];
  isScanning: boolean;
  scanProgress: { stage: string; percent: number };
  onRunScan: (url: string) => Promise<void>;
  onSelectHistoricalReport: (report: LighthouseReport) => void;
  settings: QASettings;
}

export const LighthouseScannerView: React.FC<LighthouseScannerViewProps> = ({
  currentReport,
  history,
  isScanning,
  scanProgress,
  onRunScan,
  onSelectHistoricalReport,
  settings,
}) => {
  const [targetUrl, setTargetUrl] = useState(settings.lighthouseUrl);
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetUrl.trim() && !isScanning) {
      onRunScan(targetUrl.trim());
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 90) return '#059669'; // emerald-600
    if (score >= 50) return '#d97706'; // amber-600
    return '#e11d48'; // rose-600
  };

  const handleDownloadSummary = () => {
    if (!currentReport) return;
    const summary = {
      url: currentReport.url,
      scores: currentReport.scores,
      metrics: currentReport.metrics,
      failed_audits: currentReport.failed_audits,
      recommendations: currentReport.recommendations,
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullReport = () => {
    if (!currentReport) return;
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lighthouse-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const isQualityGatePassed = currentReport
    ? currentReport.scores.performance >= settings.qualityGatePerformance
    : false;

  return (
    <div className="space-y-6">
      {/* URL Input & Controls Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
            Lighthouse Performance Monitoring Tool
          </h2>
          <p className="text-xs text-stone-500">
            Execute headless browser performance scans, extract Core Web Vitals, and generate recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                id="lighthouse-url-input"
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com"
                disabled={isScanning}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent font-mono placeholder:font-sans"
              />
            </div>
            <button
              id="run-lighthouse-btn"
              type="submit"
              disabled={isScanning}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${
                isScanning
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning URL...</span>
                </>
              ) : (
                <>
                  <Gauge className="w-4 h-4" />
                  <span>Run Lighthouse Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Quick preset URLs from README */}
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs text-stone-600">
            <span className="text-stone-400 font-medium">Presets:</span>
            <button
              type="button"
              onClick={() => setTargetUrl('https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com')}
              className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono transition-colors"
            >
              Horizon Portal
            </button>
            <button
              type="button"
              onClick={() => setTargetUrl('https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com/languages')}
              className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono transition-colors"
            >
              Horizon /languages
            </button>
            <button
              type="button"
              onClick={() => setTargetUrl('https://example.com')}
              className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono transition-colors"
            >
              example.com
            </button>
          </div>
        </form>

        {/* Live scanning progress bar */}
        {isScanning && (
          <div className="mt-5 p-4 rounded-lg bg-teal-50 border border-teal-200">
            <div className="flex items-center justify-between text-xs font-medium text-teal-900 mb-2">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-700" />
                {scanProgress.stage}
              </span>
              <span>{scanProgress.percent}%</span>
            </div>
            <div className="w-full bg-teal-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-700 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${scanProgress.percent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {currentReport && (
        <>
          {/* Quality Gate Status Banner (based on test_lighthouse.py) */}
          <div
            id="lighthouse-quality-gate"
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isQualityGatePassed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {isQualityGatePassed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  {isQualityGatePassed
                    ? `Quality Gate PASSED: Performance score (${currentReport.scores.performance}) >= ${settings.qualityGatePerformance}`
                    : `Quality Gate FAILED: Performance score (${currentReport.scores.performance}) is below threshold of ${settings.qualityGatePerformance}`}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  Asserted by PyTest suite (tests/test_lighthouse.py) &bull; Tested at{' '}
                  {new Date(currentReport.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleDownloadSummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 hover:bg-white text-stone-800 border border-stone-200 shadow-2xs transition-colors"
                title="Download summary.json generated by lighthouse_tool.py"
              >
                <Download className="w-3.5 h-3.5" />
                <span>summary.json</span>
              </button>
              <button
                onClick={handleDownloadFullReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 hover:bg-white text-stone-800 border border-stone-200 shadow-2xs transition-colors"
                title="Download raw lighthouse-report.json"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Full JSON</span>
              </button>
            </div>
          </div>

          {/* Lighthouse Category Scores */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(
              [
                { label: 'Performance', score: currentReport.scores.performance, key: 'performance' },
                { label: 'Accessibility', score: currentReport.scores.accessibility, key: 'accessibility' },
                { label: 'Best Practices', score: currentReport.scores.best_practices, key: 'best_practices' },
                { label: 'SEO', score: currentReport.scores.seo, key: 'seo' },
              ] as const
            ).map((cat) => (
              <div
                key={cat.key}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="relative w-20 h-20 flex items-center justify-center my-2">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-100"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      stroke={getScoreRingColor(cat.score)}
                      strokeDasharray={`${cat.score}, 100`}
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold font-mono text-stone-900">
                    {Math.round(cat.score)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-stone-800">{cat.label}</span>
                <span
                  className={`mt-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${getScoreColor(
                    cat.score
                  )}`}
                >
                  {cat.score >= 90 ? 'Good' : cat.score >= 50 ? 'Needs Work' : 'Poor'}
                </span>
              </div>
            ))}
          </div>

          {/* Core Web Vitals & Metrics Breakdown */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                  Core Web Vitals & Timing Metrics
                </h3>
                <p className="text-xs text-stone-500">
                  Extracted via LighthouseParser (lighthouse/parser.py)
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-stone-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Audit time: {currentReport.durationSeconds}s</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  First Contentful Paint
                </div>
                <div className="text-base font-bold font-mono text-stone-800 mt-1">
                  {currentReport.metrics.first_contentful_paint}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Target: &lt; 1.8s</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  Largest Contentful Paint
                </div>
                <div className="text-base font-bold font-mono text-stone-800 mt-1">
                  {currentReport.metrics.largest_contentful_paint}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Target: &lt; 2.5s</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  Speed Index
                </div>
                <div className="text-base font-bold font-mono text-stone-800 mt-1">
                  {currentReport.metrics.speed_index}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Target: &lt; 3.4s</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  Total Blocking Time
                </div>
                <div className="text-base font-bold font-mono text-stone-800 mt-1">
                  {currentReport.metrics.total_blocking_time}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Target: &lt; 200ms</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  Cumulative Layout Shift
                </div>
                <div className="text-base font-bold font-mono text-stone-800 mt-1">
                  {currentReport.metrics.cumulative_layout_shift}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Target: &lt; 0.1</div>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations Engine (exact replica of recommender.py) */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                Lighthouse Recommendations Engine
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Generated by LighthouseRecommender (lighthouse/recommender.py) based on threshold logic and audit diagnostics.
            </p>

            <ul className="space-y-2">
              {currentReport.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200 text-sm text-stone-800"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Failed Audits Breakdown (< 0.9 score) */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                  Failed &amp; Warning Audits ({currentReport.failed_audits.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Audits scoring below 0.9 identified by parser.get_failed_audits()
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Score &lt; 0.9
              </span>
            </div>

            {currentReport.failed_audits.length === 0 ? (
              <div className="text-center py-6 text-stone-500 text-sm">
                No failed audits detected for this URL. All audits scored 0.9 or higher!
              </div>
            ) : (
              <div className="space-y-2">
                {currentReport.failed_audits.map((audit) => {
                  const isExpanded = expandedAuditId === audit.id;
                  return (
                    <div
                      key={audit.id}
                      className="border border-stone-200 rounded-lg overflow-hidden bg-stone-50"
                    >
                      <button
                        onClick={() => setExpandedAuditId(isExpanded ? null : audit.id)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-stone-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 pr-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-sm font-medium text-stone-900">{audit.title}</span>
                          <span className="hidden sm:inline-block font-mono text-[11px] text-stone-400">
                            [{audit.id}]
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                            Score: {audit.score !== null ? audit.score : 'N/A'}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-stone-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-stone-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-3.5 bg-white border-t border-stone-200 text-xs text-stone-600 space-y-2">
                          <p>{audit.description}</p>
                          <div className="text-[11px] text-stone-400 font-mono">
                            Audit Key: {audit.id} &bull; Category: {audit.category || 'General'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Historical Scans List */}
          {history.length > 1 && (
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-stone-500" />
                <h3 className="text-sm font-semibold text-stone-800">Recent Scans History</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {history.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => onSelectHistoricalReport(h)}
                    className={`py-2.5 px-3 rounded-lg flex items-center justify-between text-xs cursor-pointer hover:bg-stone-50 transition-colors ${
                      h.id === currentReport.id ? 'bg-teal-50/70 border border-teal-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate max-w-sm sm:max-w-md">
                      <span className="font-mono text-stone-700 truncate">{h.url}</span>
                      <span className="text-stone-400">
                        ({new Date(h.timestamp).toLocaleTimeString()})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-semibold text-stone-800">
                        P: {h.scores.performance}
                      </span>
                      <span className="text-stone-400">A: {h.scores.accessibility}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
