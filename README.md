# 🌅 Horizon QA Automation Framework

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Playwright](https://img.shields.io/badge/playwright-ready-2EAD33.svg)](https://playwright.dev/python/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Testing: pytest](https://img.shields.io/badge/testing-pytest-blue.svg)](https://docs.pytest.org/en/latest/)

A robust, scalable, and maintainable QA automation framework developed for the Horizon Broadband technical assessment. This repository serves as a comprehensive suite for functional UI testing and automated web performance profiling.

---

## 📑 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#-usage)
  - [Test Execution](#test-execution)
  - [Lighthouse Profiling](#lighthouse-profiling)
- [Reporting & Artifacts](#-reporting--artifacts)
- [Project Structure](#-project-structure)
- [Engineering Practices](#-engineering-practices)
- [Roadmap](#-roadmap)

---

## 📖 Overview

The Horizon QA Automation Framework is engineered to enforce high standards of quality across functional workflows and performance metrics. It integrates dual automation capabilities:

1. **Automated E2E Testing**: Validates critical user journeys (e.g., authentication) on the Horizon web application.
2. **Lighthouse Performance Monitoring**: A programmatic wrapper around Google Lighthouse for extracting, parsing, and storing deep web performance and accessibility metrics.

---

## ✨ Key Features

### 🔐 UI Automation (Playwright + Pytest)
- **Page Object Model (POM)** architecture for maximum reusability and maintainability.
- Robust state validation and explicit waiting strategies.
- Comprehensive coverage of positive, negative, and edge-case authentication flows.
- Automatic failure capturing (screenshots, traces).
- Rich HTML report generation.

### ⚡ Lighthouse Profiling
- **CLI-driven** Lighthouse execution for any target URL.
- Automated extraction of core metrics: *Performance, Accessibility, Best Practices, SEO, and Core Web Vitals*.
- Granular failure analysis identifying specific failed audits.
- Actionable recommendations generated based on audit results.
- Persistent JSON reporting for historical analysis.

---

## 🏗️ Architecture & Tech Stack

**Core Technologies**: Python, PyTest, Playwright, Node.js (Lighthouse CLI)
**Infrastructure**: Git, GitHub Actions

```mermaid
flowchart TB
    %% Styling
    classDef core fill:#2b3a42,stroke:#3b4d54,stroke-width:2px,color:#fff
    classDef testSuite fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    classDef performance fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    classDef external fill:#1976D2,stroke:#1565C0,stroke-width:2px,color:#fff
    classDef report fill:#9C27B0,stroke:#7B1FA2,stroke-width:2px,color:#fff

    subgraph "Horizon QA Automation Framework"
        direction TB
        Main[("🚀 Core Orchestrator")]:::core

        subgraph "UI Automation Suite"
            direction TB
            TR[("🧪 PyTest Runner")]:::testSuite
            POM["📦 Page Object Model"]:::testSuite
            PW["🎭 Playwright WebDriver"]:::testSuite
            TR --> POM
            POM --> PW
        </subgraph>

        subgraph "Lighthouse Performance Profiler"
            direction TB
            CLI["💻 Python CLI Wrapper"]:::performance
            LH["⚡ Node.js Lighthouse CLI"]:::performance
            PAR["📝 JSON Report Parser"]:::performance
            REC["💡 Recommendation Engine"]:::performance
            CLI --> LH
            LH --> PAR
            PAR --> REC
        </subgraph>

        Main --> TR
        Main --> CLI
    end

    subgraph "External Interactions"
        direction TB
        App(("🌐 Horizon Web App")):::external
        App2(("🌐 Target URL")):::external
    end

    subgraph "Artifacts & Reporting"
        direction TB
        Rep1[("📊 HTML Test Reports")]:::report
        Rep2[("📸 Failure Screenshots")]:::report
        Rep3[("📈 Lighthouse JSON")]:::report
    end

    PW -->|Interacts with| App
    LH -->|Profiles| App2
    TR -.->|Generates| Rep1
    TR -.->|Generates| Rep2
    REC -.->|Outputs| Rep3
```

---

## 🚀 Getting Started

### Prerequisites
- **Python** 3.10 or higher
- **Node.js** (v18+) & **npm** (Required for Lighthouse)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd horizon-qa-automation
   ```

2. **Initialize Python Environment**
   ```bash
   python -m venv .venv
   
   # Windows
   .\.venv\Scripts\activate
   
   # Linux/macOS
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Browsers (Playwright)**
   ```bash
   playwright install chromium
   ```

5. **Install Node Packages**
   ```bash
   npm install
   ```

### Configuration

Environment variables dictate the runtime behavior. Copy the sample file and update the values:

```bash
cp .env.example .env
```

**.env file specification:**
```ini
BASE_URL=https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com
HORIZON_USERNAME=<your_test_username>
HORIZON_PASSWORD=<your_test_password>
HEADLESS=true
```
> **⚠️ Security Note:** Ensure `.env` remains in your `.gitignore` to prevent credential leakage.

---

## 🧪 Usage

### Test Execution

The testing suite leverages `pytest` with various markers for targeted execution.

| Command | Description |
|---------|-------------|
| `pytest` | Execute the entire test suite |
| `pytest -m login` | Execute only tests marked with `@pytest.mark.login` |
| `pytest --headed` | Run tests with browser UI visible (for debugging) |
| `pytest -v -s` | Verbose output with print statements |

### Lighthouse Profiling

Trigger Lighthouse audits via the CLI wrapper script:

```bash
python lighthouse_tool.py <TARGET_URL>
```

**Example:**
```bash
python lighthouse_tool.py https://horizon-plus.dfp8hwwhcxnpq.amplifyapp.com/languages
```

---

## 📊 Reporting & Artifacts

Test artifacts and reports are automatically aggregated into the `reports/` directory:

- **Test Results (HTML/XML)**: `reports/test-results/`
- **Failure Screenshots**: `reports/screenshots/`
- **Lighthouse JSON Profiles**: `reports/lighthouse/`

---

## 📂 Project Structure

<details>
<summary>Click to expand directory structure</summary>

```text
horizon-qa-automation/
├── .github/                 # CI/CD Workflows
├── config/                  # Configuration loaders and constants
├── lighthouse/              # Lighthouse wrapper, parsers, and engines
├── pages/                   # Page Object classes (POM)
├── reports/                 # Generated artifacts (ignored in git)
├── tests/                   # Pytest test definitions
├── utils/                   # Shared helper utilities
├── .env.example             # Template for environment variables
├── conftest.py              # Pytest fixtures and hooks
├── lighthouse_tool.py       # Entry point for Lighthouse profiling
├── pytest.ini               # Pytest configuration
├── requirements.txt         # Python dependencies
└── README.md                # Documentation
```
</details>

---

## 🛠️ Engineering Practices

This framework adheres to strict software engineering principles:
- **Separation of Concerns**: Test logic is strictly decoupled from UI interaction logic via the Page Object Model.
- **Configurability**: Environment-agnostic execution through `.env` variable injection.
- **Resilience**: Explicit waits and robust locator strategies using Playwright's auto-waiting mechanisms.
- **Observability**: Extensive logging and automated visual artifact generation on failure.
- **Version Control**: Meaningful commit history and branch strategies.

---

## 🛣️ Roadmap

- [ ] Parallel Test Execution (via `pytest-xdist`)
- [ ] Cross-browser Execution (Firefox, WebKit)
- [ ] Integration with Allure Reporting
- [ ] Historical Lighthouse Score Tracking Dashboard
- [ ] Dockerized Test Execution Environment
- [ ] Slack/Teams Notifications for CI Pipeline

---

## 👨‍💻 Author

**Riyazudeen S S**
