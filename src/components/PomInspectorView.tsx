import React, { useState } from 'react';
import { Layers, Copy, Check, FileCode, Terminal, BookOpen } from 'lucide-react';
import { PAGE_OBJECT_SELECTORS } from '../utils/testRunner';

export const PomInspectorView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const loginPagePyCode = `from playwright.sync_api import Page, expect
from config.settings import LOGIN_URL

class LoginPage:
    def __init__(self, page: Page):
        self.page = page

        # Dynamic resilient selectors for Horizon application
        self.username_input = page.locator(
            'input[name="username"], '
            'input[name="email"], '
            'input[type="email"]'
        )

        self.password_input = page.locator(
            'input[name="password"], '
            'input[type="password"]'
        )

        self.login_button = page.locator(
            'button[type="submit"], '
            'button:has-text("Login"), '
            'button:has-text("Sign in")'
        )

    def navigate(self):
        self.page.goto(
            LOGIN_URL,
            wait_until="domcontentloaded"
        )

    def login(self, username: str, password: str):
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_button.click()

    def verify_login(self):
        expect(self.page).not_to_have_url(LOGIN_URL)`;

  const conftestPyCode = `import pytest
from playwright.sync_api import sync_playwright
from config.settings import HEADLESS, SCREENSHOT_DIR

@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=HEADLESS
        )
        yield browser
        browser.close()

@pytest.fixture
def page(browser, request):
    context = browser.new_context(
        viewport={"width": 1440, "height": 900}
    )
    page = context.new_page()
    yield page

    # Failure screenshot capture
    if hasattr(request.node, "rep_call") and request.node.rep_call.failed:
        screenshot_path = SCREENSHOT_DIR / f"{request.node.name}.png"
        page.screenshot(path=str(screenshot_path), full_page=True)

    context.close()`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
              Page Object Model &amp; Automation Architecture
            </h2>
            <p className="text-xs text-stone-500">
              Clean separation of test logic and page interactions for Horizon Broadband QA automation.
            </p>
          </div>
        </div>
      </div>

      {/* Selectors Table */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-700" />
          <span>Defined Page Locators (pages/login_page.py)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600">
                <th className="py-2.5 px-3 font-semibold">Element Locator</th>
                <th className="py-2.5 px-3 font-semibold">Target Element</th>
                <th className="py-2.5 px-3 font-semibold">CSS / Text Selector Pattern</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-teal-800">
                  username_input
                </td>
                <td className="py-2.5 px-3 text-stone-700">Username / Email Input</td>
                <td className="py-2.5 px-3 font-mono text-stone-600 bg-stone-50/50">
                  {PAGE_OBJECT_SELECTORS.username_input}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleCopy(PAGE_OBJECT_SELECTORS.username_input, 'user')}
                    className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    title="Copy selector"
                  >
                    {copiedKey === 'user' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-teal-800">
                  password_input
                </td>
                <td className="py-2.5 px-3 text-stone-700">Password Input</td>
                <td className="py-2.5 px-3 font-mono text-stone-600 bg-stone-50/50">
                  {PAGE_OBJECT_SELECTORS.password_input}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleCopy(PAGE_OBJECT_SELECTORS.password_input, 'pass')}
                    className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    title="Copy selector"
                  >
                    {copiedKey === 'pass' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-mono font-semibold text-teal-800">login_button</td>
                <td className="py-2.5 px-3 text-stone-700">Submit Button</td>
                <td className="py-2.5 px-3 font-mono text-stone-600 bg-stone-50/50">
                  {PAGE_OBJECT_SELECTORS.login_button}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => handleCopy(PAGE_OBJECT_SELECTORS.login_button, 'btn')}
                    className="p-1 hover:bg-stone-100 rounded text-stone-500"
                    title="Copy selector"
                  >
                    {copiedKey === 'btn' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-teal-700" />
              <span>pages/login_page.py</span>
            </span>
            <button
              onClick={() => handleCopy(loginPagePyCode, 'login_py')}
              className="p-1 hover:bg-stone-200 rounded text-stone-600"
            >
              {copiedKey === 'login_py' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-4 bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto max-h-[380px]">
            {loginPagePyCode}
          </pre>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="bg-stone-100 px-4 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-teal-700" />
              <span>conftest.py</span>
            </span>
            <button
              onClick={() => handleCopy(conftestPyCode, 'conftest_py')}
              className="p-1 hover:bg-stone-200 rounded text-stone-600"
            >
              {copiedKey === 'conftest_py' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="p-4 bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto max-h-[380px]">
            {conftestPyCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
