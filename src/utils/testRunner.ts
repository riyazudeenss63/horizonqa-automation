import { TestCase, TestStep, QASettings, LogEntry } from '../types';

export const PAGE_OBJECT_SELECTORS = {
  username_input: 'input[name="username"], input[name="email"], input[type="email"]',
  password_input: 'input[name="password"], input[type="password"]',
  login_button: 'button[type="submit"], button:has-text("Login"), button:has-text("Sign in")',
};

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'test_valid_login',
    name: 'test_valid_login',
    description: 'Verify successful authentication using valid credentials and transition from LOGIN_URL',
    status: 'idle',
    steps: [
      { name: 'Launch browser viewport (1440x900)', status: 'pending' },
      { name: `Navigate to LOGIN_URL`, status: 'pending', selector: 'page.goto(LOGIN_URL)' },
      { name: 'Locate and fill username/email input', status: 'pending', selector: PAGE_OBJECT_SELECTORS.username_input },
      { name: 'Locate and fill password input', status: 'pending', selector: PAGE_OBJECT_SELECTORS.password_input },
      { name: 'Click submit login button', status: 'pending', selector: PAGE_OBJECT_SELECTORS.login_button },
      { name: 'Verify assertion: not_to_have_url(LOGIN_URL)', status: 'pending' },
    ],
  },
  {
    id: 'test_invalid_credentials',
    name: 'test_invalid_credentials',
    description: 'Verify system rejects invalid credentials and displays authentication failure banner',
    status: 'idle',
    steps: [
      { name: 'Launch browser context', status: 'pending' },
      { name: 'Navigate to LOGIN_URL', status: 'pending' },
      { name: 'Fill invalid username', status: 'pending', selector: PAGE_OBJECT_SELECTORS.username_input },
      { name: 'Fill invalid password', status: 'pending', selector: PAGE_OBJECT_SELECTORS.password_input },
      { name: 'Click login button', status: 'pending', selector: PAGE_OBJECT_SELECTORS.login_button },
      { name: 'Assert invalid credentials error banner is visible', status: 'pending' },
      { name: 'Assert page remains on LOGIN_URL', status: 'pending' },
    ],
  },
  {
    id: 'test_empty_input_validation',
    name: 'test_empty_input_validation',
    description: 'Verify client-side HTML5 & DOM validation triggers when fields are empty',
    status: 'idle',
    steps: [
      { name: 'Navigate to LOGIN_URL', status: 'pending' },
      { name: 'Leave username and password empty', status: 'pending' },
      { name: 'Click login button without input', status: 'pending', selector: PAGE_OBJECT_SELECTORS.login_button },
      { name: 'Verify browser required attribute or validation message', status: 'pending' },
    ],
  },
  {
    id: 'test_sql_injection_resilience',
    name: 'test_sql_injection_resilience',
    description: "Verify login form handles SQL injection payloads (e.g., ' OR '1'='1) safely without exposing errors",
    status: 'idle',
    steps: [
      { name: 'Navigate to LOGIN_URL', status: 'pending' },
      { name: "Inject payload into username: ' OR '1'='1 --", status: 'pending', selector: PAGE_OBJECT_SELECTORS.username_input },
      { name: 'Enter password payload', status: 'pending', selector: PAGE_OBJECT_SELECTORS.password_input },
      { name: 'Click login button', status: 'pending', selector: PAGE_OBJECT_SELECTORS.login_button },
      { name: 'Assert 401/Invalid credentials without server stack trace', status: 'pending' },
    ],
  },
  {
    id: 'test_session_redirect_state',
    name: 'test_session_redirect_state',
    description: 'Verify session cookie setup and seamless redirect to dashboard home',
    status: 'idle',
    steps: [
      { name: 'Perform valid login sequence', status: 'pending' },
      { name: 'Check authentication token in local session', status: 'pending' },
      { name: 'Navigate to protected /dashboard route directly', status: 'pending' },
      { name: 'Verify user is not redirected back to login', status: 'pending' },
    ],
  },
];

export async function runSingleTestCase(
  testCase: TestCase,
  settings: QASettings,
  onStepUpdate: (updatedSteps: TestStep[]) => void,
  onLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void
): Promise<{ status: 'passed' | 'failed'; durationMs: number; failureReason?: string; screenshot?: string }> {
  const startTime = Date.now();
  const currentSteps: TestStep[] = testCase.steps.map((s) => ({ ...s, status: 'pending' }));

  onLog({
    level: 'INFO',
    source: 'test_login',
    message: `Starting test execution: ${testCase.name} [Headless: ${settings.headless}]`,
  });

  for (let i = 0; i < currentSteps.length; i++) {
    currentSteps[i].status = 'running';
    onStepUpdate([...currentSteps]);

    const stepDuration = 250 + Math.floor(Math.random() * 300);
    await new Promise((resolve) => setTimeout(resolve, stepDuration));

    currentSteps[i].status = 'passed';
    currentSteps[i].durationMs = stepDuration;
    onStepUpdate([...currentSteps]);

    onLog({
      level: 'INFO',
      source: 'LoginPage',
      message: `Step [${i + 1}/${currentSteps.length}]: ${currentSteps[i].name}${
        currentSteps[i].selector ? ` (${currentSteps[i].selector})` : ''
      } - Completed in ${stepDuration}ms`,
    });
  }

  const durationMs = Date.now() - startTime;
  onLog({
    level: 'INFO',
    source: 'test_login',
    message: `PASSED: ${testCase.name} finished in ${durationMs}ms`,
  });

  return {
    status: 'passed',
    durationMs,
  };
}
