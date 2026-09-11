import React, { useState } from 'react';
import { Terminal, Download, Trash2, Filter, Search, Copy, Check } from 'lucide-react';
import { LogEntry } from '../types';

interface AutomationLogsViewProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const AutomationLogsView: React.FC<AutomationLogsViewProps> = ({ logs, onClearLogs }) => {
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleDownloadLogFile = () => {
    const logContent = logs
      .map((l) => `${l.timestamp} | ${l.level.padEnd(5)} | ${l.source.padEnd(14)} | ${l.message}`)
      .join('\n');

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'automation.log';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLogs = () => {
    const logContent = filteredLogs
      .map((l) => `${l.timestamp} | ${l.level.padEnd(5)} | ${l.source.padEnd(14)} | ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(logContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-700" />
            <span>Automation Execution Logs</span>
          </h2>
          <p className="text-xs text-stone-500">
            Reports logger stream formatted according to utils/logger.py (reports/test-results/automation.log)
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={handleCopyLogs}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadLogFile}
            className="px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download automation.log file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>automation.log</span>
          </button>

          <button
            onClick={onClearLogs}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Clear all log entries"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <div className="flex gap-1">
            {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  levelFilter === lvl
                    ? 'bg-teal-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search log messages..."
            className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Console Terminal Window */}
      <div className="bg-stone-900 rounded-xl border border-stone-800 shadow-md overflow-hidden">
        <div className="bg-stone-950 px-4 py-2 border-b border-stone-800 flex items-center justify-between text-[11px] text-stone-400 font-mono">
          <span>CONSOLE OUTPUT ({filteredLogs.length} entries)</span>
          <span>PID: QA-SESSION-2026</span>
        </div>

        <div className="p-4 font-mono text-xs overflow-y-auto max-h-[500px] space-y-1">
          {filteredLogs.length === 0 ? (
            <div className="text-stone-500 italic py-6 text-center">
              No matching log records found.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2 hover:bg-stone-800/60 p-1 rounded transition-colors"
              >
                <span className="text-stone-500 select-none shrink-0">{log.timestamp}</span>
                <span
                  className={`font-semibold shrink-0 select-none px-1.5 py-0.2 rounded text-[10px] ${
                    log.level === 'ERROR'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : log.level === 'WARN'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-teal-950 text-teal-300 border border-teal-800'
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-teal-400 shrink-0 select-none">[{log.source}]</span>
                <span className="text-stone-200 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
