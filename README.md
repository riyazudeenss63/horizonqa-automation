# Horizon QA Automation

## Project Overview

This project implements a maintainable QA automation framework for the Horizon Broadband technical assessment.

The project contains two major automation components:

1. Web Lighthouse Performance Monitoring Tool
2. Automated login validation for the Horizon web application

The framework is designed with reusable components, Page Object Model principles, automated reporting, logging, failure screenshots, and CI support.

## Features

### Lighthouse Performance Monitoring

- Accepts any web URL through the command line
- Executes Lighthouse automatically
- Generates a JSON Lighthouse report
- Extracts Performance, Accessibility, Best Practices and SEO scores
- Extracts Core Web Vitals and other important metrics
- Identifies failed audits
- Generates actionable recommendations
- Stores reports for later analysis

### Login Automation

- Automated browser-based login
- Page Object Model
- Valid credential test
- Invalid credential test
- Input validation tests
- Assertions for authentication state
- Failure screenshots
- HTML test reporting

## Technology Stack

- Python
- PyTest
- Playwright
- Lighthouse
- Node.js
- Git
- GitHub Actions

## Architecture

```text
Tests
  |
  +-- Login Tests
  |      |
  |      +-- Login Page Object
  |
  +-- Lighthouse Tests
         |
         +-- Scanner
         +-- Parser
         +-- Recommendation Engine
```

## Project Structure

```text
horizon-qa-automation/
│
├── .github/
├── config/
├── lighthouse/
├── pages/
├── tests/
├── utils/
├── reports/
├── .env.example
├── conftest.py
├── lighthouse_tool.py
├── pytest.ini
├── requirements.txt
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd horizon-qa-automation
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Windows:

```powershell
.\.venv\Scripts\activate
```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Install Playwright browser

```bash
playwright install chromium
```

### 5. Install Node dependencies

```bash
npm install
```

## Configuration

Create a `.env` file based on `.env.example`.

```text
BASE_URL=https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com
HORIZON_USERNAME=<test username>
HORIZON_PASSWORD=<test password>
HEADLESS=true
```

Credentials are intentionally excluded from source control.

## Running Login Tests

Run all tests:

```bash
pytest
```

Run login tests:

```bash
pytest -m login
```

Run in headed mode:

```bash
pytest --headed
```

## Running Lighthouse

```bash
python lighthouse_tool.py https://example.com
```

Example:

```bash
python lighthouse_tool.py https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com/languages
```

## Reports

Test reports are generated under:

```text
reports/test-results/
```

Screenshots from failed tests are stored under:

```text
reports/screenshots/
```

Lighthouse reports are stored under:

```text
reports/lighthouse/
```

## Engineering Practices

The project follows:

- Page Object Model
- Separation of test and implementation logic
- Explicit assertions
- Reusable utilities
- Logging
- Failure screenshots
- Environment-based configuration
- Secure credential handling
- Meaningful Git commits
- CI automation

## Future Improvements

Possible future improvements include:

- Cross-browser execution
- Parallel test execution
- Historical Lighthouse score tracking
- Performance regression detection
- Slack/email notifications
- Docker-based execution
- Expanded API validation
- Allure reporting

## Author

Riyazudeen S S
"# horizon-qa-automation"
