import React, { useState } from 'react';
import { Header } from './components/Header';
import { LighthouseScannerView } from './components/LighthouseScannerView';
import { LoginTestSuiteView } from './components/LoginTestSuiteView';
import { PomInspectorView } from './components/PomInspectorView';
import { AutomationLogsView } from './components/AutomationLogsView';
import { SettingsModal } from './components/SettingsModal';
import { DEFAULT_SETTINGS, INITIAL_REPORT, INITIAL_LOGS } from './data/mockData';
import { INITIAL_TEST_CASES } from './utils/testRunner';
import { LighthouseScannerEngine } from './utils/lighthouseEngine';
import { LighthouseReport, TestCase, LogEntry, QASettings } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lighthouse' | 'login' | 'pom' | 'logs'>('lighthouse');
  const [settings, setSettings] = useState<QASettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Lighthouse state
  const [currentReport, setCurrentReport] = useState<LighthouseReport | null>(INITIAL_REPORT);
  const [history, setHistory] = useState<LighthouseReport[]>([INITIAL_REPORT]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ stage: 'Ready', percent: 0 });

  // Test suite state
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [isRunningAllTests, setIsRunningAllTests] = useState(false);

  // Logs state
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  const addLog = (newLog: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const entry: LogEntry = {
      ...newLog,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
    };
    setLogs((prev) => [entry, ...prev]);
  };

  const handleRunScan = async (url: string) => {
    setIsScanning(true);
    setScanProgress({ stage: 'Initializing scanner...', percent: 5 });

    addLog({
      level: 'INFO',
      source: 'LighthouseScanner',
      message: `Running command: lighthouse ${url} --output=json --chrome-flags=--headless --quiet`,
    });

    try {
      const scanner = new LighthouseScannerEngine();
      const report = await scanner.executeScan(url, (stage, percent) => {
        setScanProgress({ stage, percent });
      });

      setCurrentReport(report);
      setHistory((prev) => [report, ...prev]);

      addLog({
        level: 'INFO',
        source: 'LighthouseParser',
        message: `Parsed scores: Performance: ${report.scores.performance}, Accessibility: ${report.scores.accessibility}, Best Practices: ${report.scores.best_practices}, SEO: ${report.scores.seo}`,
      });

      if (report.scores.performance < settings.qualityGatePerformance) {
        addLog({
          level: 'WARN',
          source: 'QualityGate',
          message: `Quality Gate Warning: Performance score (${report.scores.performance}) is below configured threshold of ${settings.qualityGatePerformance}`,
        });
      } else {
        addLog({
          level: 'INFO',
          source: 'QualityGate',
          message: `Quality Gate OK: Performance score (${report.scores.performance}) >= ${settings.qualityGatePerformance}`,
        });
      }
    } catch (err: any) {
      addLog({
        level: 'ERROR',
        source: 'LighthouseScanner',
        message: `Scan failure: ${err.message || 'Unknown error occurred'}`,
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 flex flex-col text-stone-900">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isScanning={isScanning}
        isRunningTests={isRunningAllTests}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'lighthouse' && (
          <LighthouseScannerView
            currentReport={currentReport}
            history={history}
            isScanning={isScanning}
            scanProgress={scanProgress}
            onRunScan={handleRunScan}
            onSelectHistoricalReport={(rep) => setCurrentReport(rep)}
            settings={settings}
          />
        )}

        {activeTab === 'login' && (
          <LoginTestSuiteView
            testCases={testCases}
            setTestCases={setTestCases}
            settings={settings}
            onAddLog={addLog}
            isRunningAll={isRunningAllTests}
            setIsRunningAll={setIsRunningAllTests}
          />
        )}

        {activeTab === 'pom' && <PomInspectorView />}

        {activeTab === 'logs' && (
          <AutomationLogsView logs={logs} onClearLogs={() => setLogs([])} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Horizon Broadband &bull; QA Automation &amp; Lighthouse Performance Framework</span>
          <span className="font-mono text-stone-400">
            Target: {settings.baseUrl}
          </span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          addLog({
            level: 'INFO',
            source: 'Settings',
            message: `Updated QA settings: baseUrl=${newSettings.baseUrl}, timeout=${newSettings.timeout}s`,
          });
        }}
      />
    </div>
  );
};

export default App;
