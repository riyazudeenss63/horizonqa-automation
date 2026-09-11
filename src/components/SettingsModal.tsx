import React, { useState } from 'react';
import { X, Save, Settings, ShieldAlert, Sliders } from 'lucide-react';
import { QASettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: QASettings;
  onSaveSettings: (newSettings: QASettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<QASettings>({ ...settings });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-semibold text-stone-900">
              QA Environment &amp; Threshold Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">
              BASE_URL (Target Web Application)
            </label>
            <input
              type="url"
              required
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900 focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              LOGIN_URL (Playwright Target)
            </label>
            <input
              type="url"
              required
              value={formData.loginUrl}
              onChange={(e) => setFormData({ ...formData, loginUrl: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900 focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              LIGHTHOUSE_URL (Performance Target)
            </label>
            <input
              type="url"
              required
              value={formData.lighthouseUrl}
              onChange={(e) => setFormData({ ...formData, lighthouseUrl: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900 focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Default Test Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="qa_tester@horizon.com"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900 focus:ring-1 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Lighthouse Timeout (Seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={formData.timeout}
                onChange={(e) => setFormData({ ...formData, timeout: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900 focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Quality Gate Performance Min Score
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.qualityGatePerformance}
                onChange={(e) =>
                  setFormData({ ...formData, qualityGatePerformance: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900 focus:ring-1 focus:ring-teal-700"
              />
              <span className="text-[10px] text-stone-400">Default 50 (test_lighthouse.py)</span>
            </div>

            <div className="flex flex-col justify-center">
              <label className="block font-medium text-stone-700 mb-2">Browser Mode</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.headless}
                  onChange={(e) => setFormData({ ...formData, headless: e.target.checked })}
                  className="w-4 h-4 text-teal-700 rounded border-stone-300 focus:ring-teal-700"
                />
                <span className="text-stone-800">Headless Execution (HEADLESS=true)</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors font-medium flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
