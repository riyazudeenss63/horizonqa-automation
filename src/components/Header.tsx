import React from 'react';
import { Gauge, ShieldCheck, Terminal, Layers, Settings, ExternalLink } from 'lucide-react';
import { QASettings } from '../types';

interface HeaderProps {
  activeTab: 'lighthouse' | 'login' | 'pom' | 'logs';
  setActiveTab: (tab: 'lighthouse' | 'login' | 'pom' | 'logs') => void;
  settings: QASettings;
  onOpenSettings: () => void;
  isScanning: boolean;
  isRunningTests: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenSettings,
  isScanning,
  isRunningTests,
}) => {
  return (
    <header id="qa-app-header" className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              HZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-stone-900 tracking-tight">Horizon QA Automation</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate max-w-xs sm:max-w-md">
                Lighthouse Audits &bull; Playwright Login Suite &bull; Horizon Broadband
              </p>
            </div>
          </div>

          {/* Quick Environment Status */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 rounded-md text-stone-600 border border-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono truncate max-w-[200px]" title={settings.baseUrl}>
                {settings.baseUrl.replace('https://', '')}
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 rounded-md text-stone-600 border border-stone-200">
              <span className="text-stone-400">Headless:</span>
              <span className="font-semibold text-stone-700">{settings.headless ? 'True' : 'False'}</span>
            </div>
          </div>

          {/* Settings Trigger */}
          <div className="flex items-center gap-2">
            <button
              id="settings-modal-button"
              onClick={onOpenSettings}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors border border-transparent hover:border-stone-200"
              title="QA Environment Configuration"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav id="qa-tabs-navigation" className="flex space-x-1 sm:space-x-4 border-t border-stone-100 pt-1 -mb-px overflow-x-auto">
          <button
            id="tab-lighthouse"
            onClick={() => setActiveTab('lighthouse')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'lighthouse'
                ? 'border-teal-700 text-teal-700 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Lighthouse Monitor</span>
            {isScanning && (
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            )}
          </button>

          <button
            id="tab-login"
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'login'
                ? 'border-teal-700 text-teal-700 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login Automation Suite</span>
            {isRunningTests && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </button>

          <button
            id="tab-pom"
            onClick={() => setActiveTab('pom')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'pom'
                ? 'border-teal-700 text-teal-700 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Page Object Model (POM)</span>
          </button>

          <button
            id="tab-logs"
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'logs'
                ? 'border-teal-700 text-teal-700 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Automation Logs & Reports</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
