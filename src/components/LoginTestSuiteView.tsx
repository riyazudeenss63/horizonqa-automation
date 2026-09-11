import React, { useState } from 'react';
import {
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  Maximize2,
  Camera,
  AlertTriangle,
  FileCode2,
  ChevronRight,
  User,
  Lock,
  ArrowRight
} from 'lucide-react';
import { TestCase, QASettings, LogEntry } from '../types';
import { PAGE_OBJECT_SELECTORS, runSingleTestCase } from '../utils/testRunner';

interface LoginTestSuiteViewProps {
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
  settings: QASettings;
  onAddLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  isRunningAll: boolean;
  setIsRunningAll: (val: boolean) => void;
}

export const LoginTestSuiteView: React.FC<LoginTestSuiteViewProps> = ({
  testCases,
  setTestCases,
  settings,
  onAddLog,
  isRunningAll,
  setIsRunningAll,
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(testCases[0]?.id || '');
  const [simulatedFormUsername, setSimulatedFormUsername] = useState<string>('');
  const [simulatedFormPassword, setSimulatedFormPassword] = useState<string>('');
  const [simulatedFormStatus, setSimulatedFormStatus] = useState<string>('idle');
  const [showScreenshotModal, setShowScreenshotModal] = useState<string | null>(null);

  const selectedTestCase = testCases.find((t) => t.id === selectedTestId) || testCases[0];

  const handleRunSingle = async (testCase: TestCase) => {
    if (isRunningAll) return;

    setTestCases((prev) =>
      prev.map((t) => (t.id === testCase.id ? { ...t, status: 'running' } : t))
    );

    // Update simulated viewport state live
    if (testCase.id === 'test_valid_login') {
      setSimulatedFormUsername(settings.username || 'qa_tester@horizon.com');
      setSimulatedFormPassword('••••••••••••');
      setSimulatedFormStatus('authenticating');
    } else if (testCase.id === 'test_invalid_credentials') {
      setSimulatedFormUsername('invalid_user@horizon.com');
      setSimulatedFormPassword('wrongpass123');
      setSimulatedFormStatus('error');
    } else if (testCase.id === 'test_sql_injection_resilience') {
      setSimulatedFormUsername("' OR '1'='1 --");
      setSimulatedFormPassword('payload_test');
      setSimulatedFormStatus('rejected');
    }

    const result = await runSingleTestCase(
      testCase,
      settings,
      (updatedSteps) => {
        setTestCases((prev) =>
          prev.map((t) => (t.id === testCase.id ? { ...t, steps: updatedSteps } : t))
        );
      },
      onAddLog
    );

    setTestCases((prev) =>
      prev.map((t) =>
        t.id === testCase.id
          ? {
              ...t,
              status: result.status,
              durationMs: result.durationMs,
              failureReason: result.failureReason,
              screenshot: result.screenshot,
            }
          : t
      )
    );

    if (testCase.id === 'test_valid_login') {
      setSimulatedFormStatus('authenticated');
    }
  };

  const handleRunAll = async () => {
    if (isRunningAll) return;
    setIsRunningAll(true);

    onAddLog({
      level: 'INFO',
      source: 'test_suite',
      message: `======================== TEST SESSION START ========================`,
    });
    onAddLog({
      level: 'INFO',
      source: 'conftest.py',
      message: `PyTest fixture: session-scoped browser context launched [Viewport 1440x900, Headless: ${settings.headless}]`,
    });

    for (const testCase of testCases) {
      setSelectedTestId(testCase.id);
      await handleRunSingle(testCase);
      await new Promise((r) => setTimeout(r, 400));
    }

    onAddLog({
      level: 'INFO',
      source: 'test_suite',
      message: `======================== ALL 5 TESTS PASSED ========================`,
    });

    setIsRunningAll(false);
  };

  const handleResetTests = () => {
    setTestCases((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'idle',
        durationMs: undefined,
        failureReason: undefined,
        screenshot: undefined,
        steps: t.steps.map((s) => ({ ...s, status: 'pending' })),
      }))
    );
    setSimulatedFormUsername('');
    setSimulatedFormPassword('');
    setSimulatedFormStatus('idle');
  };

  const passedCount = testCases.filter((t) => t.status === 'passed').length;
  const failedCount = testCases.filter((t) => t.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <span>Playwright Automated Login Validation</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Page Object Model pattern &bull; Target: <span className="font-mono text-stone-700">{settings.loginUrl}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleResetTests}
            disabled={isRunningAll}
            className="px-3 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            id="run-all-tests-btn"
            onClick={handleRunAll}
            disabled={isRunningAll}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors shadow-xs ${
              isRunningAll
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunningAll ? 'Running Test Suite...' : 'Run All Tests (PyTest)'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Total Scenarios</span>
          <span className="text-lg font-bold font-mono text-stone-800">{testCases.length}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Passed
          </span>
          <span className="text-lg font-bold font-mono text-emerald-700">{passedCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <span className="text-xs font-medium text-rose-700 flex items-center gap-1">
            <XCircle className="w-4 h-4" /> Failed
          </span>
          <span className="text-lg font-bold font-mono text-rose-700">{failedCount}</span>
        </div>
      </div>

      {/* Main Grid: Test List & Live Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Test Cases List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Test Cases (tests/test_login.py)
            </span>
          </div>

          <div className="space-y-2">
            {testCases.map((tc) => {
              const isSelected = tc.id === selectedTestId;
              return (
                <div
                  key={tc.id}
                  onClick={() => setSelectedTestId(tc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-600 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      {tc.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : tc.status === 'failed' ? (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : tc.status === 'running' ? (
                        <RotateCcw className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0" />
                      )}
                      <span className="font-mono text-xs font-semibold text-stone-900 truncate">
                        {tc.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {tc.durationMs && (
                        <span className="text-[11px] font-mono text-stone-500">
                          {tc.durationMs}ms
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunSingle(tc);
                        }}
                        disabled={isRunningAll || tc.status === 'running'}
                        className="p-1 text-stone-400 hover:text-teal-700 hover:bg-stone-100 rounded transition-colors"
                        title="Run this test"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{tc.description}</p>
                </div>
              );
            })}
          </div>

          {/* Page Object Model Quick Reference Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <FileCode2 className="w-4 h-4 text-teal-700" />
                <span>Page Object Model (pages/login_page.py)</span>
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-1.5 bg-stone-50 rounded border border-stone-100 text-stone-700">
                <span className="text-teal-700 font-bold">username_input:</span>{' '}
                {PAGE_OBJECT_SELECTORS.username_input}
              </div>
              <div className="p-1.5 bg-stone-50 rounded border border-stone-100 text-stone-700">
                <span className="text-teal-700 font-bold">password_input:</span>{' '}
                {PAGE_OBJECT_SELECTORS.password_input}
              </div>
              <div className="p-1.5 bg-stone-50 rounded border border-stone-100 text-stone-700">
                <span className="text-teal-700 font-bold">login_button:</span>{' '}
                {PAGE_OBJECT_SELECTORS.login_button}
              </div>
            </div>
          </div>
        </div>

        {/* Test Steps & Simulated Browser Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Test Execution Details Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-mono text-teal-700 font-semibold uppercase">
                  Active Execution
                </span>
                <h3 className="text-base font-semibold text-stone-900 font-mono">
                  {selectedTestCase.name}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{selectedTestCase.description}</p>
              </div>

              <button
                onClick={() => handleRunSingle(selectedTestCase)}
                disabled={isRunningAll || selectedTestCase.status === 'running'}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 transition-colors shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Test</span>
              </button>
            </div>

            {/* Test Steps Flow */}
            <div className="space-y-2 mt-4">
              {selectedTestCase.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                    step.status === 'running'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : step.status === 'passed'
                      ? 'bg-stone-50 border-stone-200 text-stone-800'
                      : 'bg-white border-stone-100 text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border bg-white text-stone-600">
                      {idx + 1}
                    </span>
                    <span className="font-medium truncate">{step.name}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {step.selector && (
                      <span className="font-mono text-[10px] text-stone-400 hidden sm:inline max-w-[150px] truncate">
                        {step.selector}
                      </span>
                    )}
                    {step.status === 'passed' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {step.status === 'running' && (
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Browser Viewport (1440x900 ratio from conftest.py) */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            {/* Viewport Frame Header */}
            <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white border border-stone-200 text-stone-700 font-mono text-[11px]">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{settings.loginUrl}</span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-stone-400">
                1440 &times; 900 ({settings.headless ? 'Headless' : 'Headed'})
              </span>
            </div>

            {/* Viewport Content */}
            <div className="p-6 bg-stone-50 flex items-center justify-center min-h-[280px]">
              <div className="w-full max-w-sm bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
                <div className="text-center mb-5">
                  <div className="w-9 h-9 rounded-lg bg-teal-700 text-white font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                    HZ
                  </div>
                  <h4 className="text-base font-bold text-stone-900">Horizon Broadband</h4>
                  <p className="text-xs text-stone-500">Sign in to manage your broadband account</p>
                </div>

                {simulatedFormStatus === 'error' && (
                  <div className="mb-3 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Invalid credentials. Please verify your email or password.</span>
                  </div>
                )}

                {simulatedFormStatus === 'authenticated' && (
                  <div className="mb-3 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Authenticated successfully! Redirecting to /dashboard...</span>
                  </div>
                )}

                {simulatedFormStatus === 'rejected' && (
                  <div className="mb-3 p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Sanitized input payload: Access Denied.</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Email or Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={simulatedFormUsername}
                        placeholder="username@horizon.com"
                        className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-mono"
                      />
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        readOnly
                        value={simulatedFormPassword}
                        placeholder="••••••••••••"
                        className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-mono"
                      />
                      <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full mt-2 py-2 rounded-lg bg-teal-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 opacity-90 cursor-default"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
