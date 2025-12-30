# VisaShield AI 🛡️

<div align="center">

![VisaShield AI](https://img.shields.io/badge/VisaShield-AI%20Immigration%20Platform-0A2647?style=for-the-badge&logo=shield&logoColor=white)

**Enterprise Immigration Intelligence Platform**

*AI-powered visa adjudication system designed to streamline the 11.3M case backlog with 938% processing time reduction*

[![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)](https://python.org/)
[![Google ADK](https://img.shields.io/badge/Google-ADK-4285F4?style=flat-square&logo=google-cloud)](https://cloud.google.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Cloud Run](https://img.shields.io/badge/Cloud%20Run-Deployed-4285F4?style=flat-square&logo=google-cloud)](https://cloud.google.com/run)
[![Datadog](https://img.shields.io/badge/Datadog-APM-632CA6?style=flat-square&logo=datadog)](https://www.datadoghq.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Deployment](#-deployment)
  - [Local Development](#local-development)
  - [Cloud Run Deployment](#cloud-run-deployment)
  - [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Application Features](#-application-features)
- [API Documentation](#-api-documentation)
- [Monitoring & Observability](#-monitoring--observability)
- [Security & Compliance](#-security--compliance)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

VisaShield AI is an enterprise-grade immigration intelligence platform that leverages Google's Agent Development Kit (ADK) and Gemini AI to automate and accelerate visa petition adjudication. The platform is designed with a USA government aesthetic, combining official portal styling with modern SaaS functionality.

### The Problem
- **11.3 million case backlog** in the U.S. immigration system
- Manual review processes causing significant delays
- Inconsistent adjudication decisions across officers
- High operational costs for legal teams

### The Solution
VisaShield AI provides:
- **AI-powered adjudication** with chain-of-thought reasoning
- **RAG-based knowledge retrieval** from USCIS Policy Manual, INA statutes, and AAO decisions
- **Real-time citation validation** to prevent hallucinations
- **Comprehensive audit trails** for compliance

---

## ✨ Key Features

### 🤖 AI Co-Pilot Features
| Feature | Description |
|---------|-------------|
| **Legal Reasoning Engine** | Real-time chain-of-thought visualization with criterion-by-criterion evaluation |
| **RAG Knowledge Panel** | Search across 12 volumes of USCIS Policy Manual, INA statutes, and AAO decisions |
| **Draft Determination Generator** | AI-generated approval/denial drafts with citation highlighting |
| **Citation Validator** | Real-time hallucination detection with green/red indicators |
| **Ask VIA** | Interactive AI assistant for immigration queries |

### 📊 Dashboard & Analytics
| Feature | Description |
|---------|-------------|
| **Executive Dashboard** | Command center with backlog metrics, ROI calculator, and processing trends |
| **Legal Quality Dashboard** | Hallucination heatmap, evidence sufficiency meter, precedent match scores |
| **Security Dashboard** | PII leakage feed, prompt injection monitoring, audit trail timeline |
| **Analytics Center** | Datadog-powered insights with real-time metrics |

### 🔒 Security & Compliance
| Feature | Description |
|---------|-------------|
| **Sensitive Data Scanner** | A-Number, passport, SSN/ITIN detection and redaction |
| **Threat Protection** | Jailbreak attempt alerts, suspicious pattern detection |
| **Audit & Traceability** | Full decision audit trail, FOIA request support |
| **Role-Based Access** | Multi-role support (Attorney, Adjudicator, Admin, Compliance Officer) |

### 📁 Case Management
| Feature | Description |
|---------|-------------|
| **Case Portal** | Multi-step form wizard for O-1, H-1B, EB-2 NIW, I-90, I-140, I-129 |
| **Document Management** | Drag-and-drop upload with 500+ page support and OCR preview |
| **Human Review Queue** | AI-flagged cases with side-by-side comparison |
| **Kanban Board** | Visual case tracking (Submitted → In Review → Complete) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                         (Angular 20 + NGINX)                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Dashboard│ │  Cases  │ │AI Adjud.│ │Analytics│ │Compliance│           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       └───────────┴───────────┴───────────┴───────────┘                 │
│                              │                                           │
└──────────────────────────────┼───────────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────┼───────────────────────────────────────────┐
│                              ▼                                           │
│                          BACKEND                                         │
│                    (FastAPI + Google ADK)                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      FastAPI Application                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │ REST API │  │ WebSocket│  │ Feedback │  │ Telemetry│        │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │   │
│  │       └─────────────┴─────────────┴─────────────┘               │   │
│  │                           │                                      │   │
│  │  ┌────────────────────────▼────────────────────────────────┐    │   │
│  │  │                   Google ADK Agent                       │    │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │    │   │
│  │  │  │ Gemini 3    │  │    RAG      │  │   Tools     │      │    │   │
│  │  │  │   Flash     │  │  Knowledge  │  │  Functions  │      │    │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘      │    │   │
│  │  └──────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Google Cloud │    │    Datadog      │    │   Cloud Storage │
│    Logging    │    │   APM/LLMObs    │    │   (Artifacts)   │
└───────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 20.3 | Core framework |
| TypeScript | 5.9 | Type-safe development |
| SCSS | - | Styling with USA government aesthetic |
| Lucide Angular | 0.562 | Icon library |
| ngx-charts | 23.1 | Data visualization |
| RxJS | 7.8 | Reactive programming |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11 | Runtime |
| FastAPI | 0.115 | REST API framework |
| Google ADK | 1.15+ | Agent Development Kit |
| Gemini 3 Flash | - | LLM model |
| Uvicorn | 0.34 | ASGI server |
| OpenTelemetry | - | Observability |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Google Cloud Run | Container hosting |
| Cloud Build | CI/CD |
| Artifact Registry | Container registry |
| Cloud Logging | Log aggregation |
| Cloud Trace | Distributed tracing |
| Datadog | APM & LLM Observability |
| Terraform | Infrastructure as Code |

---

## 📁 Project Structure

```
VisaShield-Angular/
├── 📁 frontend/                    # Angular frontend application
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 layout/          # Layout components
│   │   │   │   ├── header/         # Top navigation bar
│   │   │   │   ├── sidebar/        # Left navigation sidebar
│   │   │   │   └── main-layout/    # Main layout wrapper
│   │   │   ├── 📁 pages/           # Application pages
│   │   │   │   ├── login/          # Authentication page
│   │   │   │   ├── dashboard/      # Executive command center
│   │   │   │   ├── cases/          # Case management (list & detail)
│   │   │   │   ├── ai-adjudicator/ # Real-time AI processing view
│   │   │   │   ├── ask-via/        # AI assistant interface
│   │   │   │   ├── analytics/      # Datadog-powered metrics
│   │   │   │   ├── documents/      # Document management
│   │   │   │   ├── compliance-center/ # Audit & compliance
│   │   │   │   └── settings/       # User & system settings
│   │   │   ├── app.routes.ts       # Application routing
│   │   │   └── app.config.ts       # App configuration
│   │   ├── 📁 styles/              # Global SCSS styles
│   │   ├── index.html              # Entry HTML
│   │   ├── main.ts                 # Bootstrap file
│   │   └── tracer.js               # Datadog RUM tracer
│   ├── Dockerfile                  # Frontend container config
│   ├── nginx.conf                  # NGINX configuration
│   ├── angular.json                # Angular CLI config
│   └── package.json                # NPM dependencies
│
├── 📁 visashieldai/                # Python backend application
│   ├── 📁 app/
│   │   ├── agent.py                # Google ADK agent definition
│   │   ├── fast_api_app.py         # FastAPI application
│   │   ├── __init__.py
│   │   └── 📁 app_utils/           # Utilities (telemetry, typing)
│   ├── 📁 deployment/              # Terraform IaC configs
│   ├── 📁 notebooks/               # Jupyter notebooks for prototyping
│   ├── 📁 tests/                   # Unit & integration tests
│   ├── Dockerfile                  # Backend container config
│   ├── Makefile                    # Build automation
│   ├── pyproject.toml              # Python dependencies (uv)
│   ├── uv.lock                     # Dependency lock file
│   └── GEMINI.md                   # AI-assisted development guide
│
├── 📁 scripts/                     # Deployment scripts
│   ├── deploy-cloudrun.sh          # Direct Cloud Run deployment
│   └── setup-gcp-wif.sh            # GitHub Actions WIF setup
│
├── 📁 .github/                     # GitHub Actions workflows
├── agent.md                        # Feature blueprint & design spec
├── .env.local                      # Local environment variables
├── .env.datadog                    # Datadog configuration
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Node.js | 20+ | [Download](https://nodejs.org/) |
| Python | 3.10-3.13 | [Download](https://python.org/) |
| uv | Latest | `pip install uv` or [Install](https://docs.astral.sh/uv/getting-started/installation/) |
| Google Cloud SDK | Latest | [Install](https://cloud.google.com/sdk/docs/install) |
| Angular CLI | 20+ | `npm install -g @angular/cli` |

### Backend Setup

```bash
# Navigate to backend directory
cd visashieldai

# Install dependencies using uv
make install

# Set up Google Cloud authentication
gcloud auth application-default login

# Launch local development server with ADK playground
make playground
```

The backend will be available at `http://localhost:8000` with the ADK playground UI.

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
```

The frontend will be available at `http://localhost:4200`.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=global

# Backend
ALLOW_ORIGINS=http://localhost:4200
LOGS_BUCKET_NAME=your-logs-bucket

# Datadog (optional)
DD_API_KEY=your-datadog-api-key
DD_SITE=datadoghq.com
```

---

## 📦 Deployment

### Local Development

```bash
# Backend with hot-reload
cd visashieldai
make local-backend

# Frontend with hot-reload
cd frontend
ng serve
```

### Cloud Run Deployment

#### Quick Deploy (Direct from Local)

```bash
# One-command deployment for both services
./scripts/deploy-cloudrun.sh
```

This script will:
1. Enable required GCP APIs
2. Build and deploy the backend to Cloud Run
3. Build the Angular frontend
4. Deploy the frontend to Cloud Run
5. Output the service URLs

#### Manual Deployment

```bash
# Deploy backend
cd visashieldai
gcloud run deploy visashield-backend \
    --source . \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 2Gi

# Deploy frontend
cd frontend
gcloud run deploy visashield-frontend \
    --source . \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080
```

### CI/CD with GitHub Actions

#### Setup Workload Identity Federation

```bash
# Run the setup script
./scripts/setup-gcp-wif.sh
```

This configures keyless authentication between GitHub Actions and GCP.

#### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_PROJECT_NUMBER` | Your GCP project number |
| `DD_API_KEY` | Datadog API key (optional) |

---

## 📱 Application Features

### Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | Government-style authentication with SSO options |
| **Dashboard** | `/dashboard` | Executive command center with metrics and case overview |
| **Cases** | `/cases` | Filterable case list with status badges |
| **Case Detail** | `/cases/:id` | Comprehensive case view with tabs (Overview, Documents, AI Analysis, Timeline) |
| **AI Adjudicator** | `/ai-adjudicator` | Real-time AI processing with chain-of-thought visualization |
| **Ask VIA** | `/ask-via` | Interactive AI assistant for immigration queries |
| **Analytics** | `/analytics` | Datadog-powered metrics and charts |
| **Documents** | `/documents` | Document management and viewer |
| **Compliance** | `/compliance` | Audit logs and compliance reports |
| **Settings** | `/settings` | User and system configuration |

### Design System

The UI follows a USA Government aesthetic with:

| Element | Specification |
|---------|---------------|
| **Primary Navy** | `#0A2647` - Headers, primary buttons |
| **Secondary Blue** | `#1E5AA8` - Accents, links |
| **Patriot Red** | `#BF0A30` - Alerts, critical actions |
| **Typography** | Merriweather (headings), Inter (body), JetBrains Mono (data) |
| **Layout** | Fixed 280px sidebar, 64px top bar, 12-column grid |

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:8000`
- **Production**: `https://visashield-backend-xxxxx.run.app`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/run` | Execute agent with prompt |
| `POST` | `/feedback` | Submit user feedback |
| `WS` | `/ws` | WebSocket for streaming responses |

### Example Request

```bash
curl -X POST "http://localhost:8000/run" \
  -H "Content-Type: application/json" \
  -d '{
    "app_name": "app",
    "user_id": "user123",
    "session_id": "session456",
    "new_message": {
      "role": "user",
      "parts": [{"text": "What are the requirements for H-1B visa?"}]
    }
  }'
```

---

## 📊 Monitoring & Observability

### OpenTelemetry Integration

The application exports telemetry to:
- **Cloud Trace** - Distributed tracing
- **Cloud Logging** - Structured logs
- **BigQuery** - Analytics (optional)

### Datadog APM

Environment variables for Datadog:

```env
DD_ENV=production
DD_SERVICE=visashield-backend
DD_VERSION=1.0.0
DD_LOGS_INJECTION=true
DD_TRACE_SAMPLE_RATE=1
DD_LLMOBS_ENABLED=1
DD_LLMOBS_ML_APP=visaAI
DD_APPSEC_ENABLED=true
```

### Key Metrics

| Metric | Description |
|--------|-------------|
| `cases.processed` | Total cases processed |
| `ai.confidence_score` | AI confidence distribution |
| `citation.validity_rate` | Citation validation success rate |
| `processing.latency` | End-to-end processing time |

---

## 🔒 Security & Compliance

### Security Features

- ✅ **PII Detection & Redaction** - A-Numbers, SSN, Passport numbers
- ✅ **Prompt Injection Protection** - Input sanitization and monitoring
- ✅ **Role-Based Access Control** - Multi-role authentication
- ✅ **Audit Logging** - Immutable decision trails
- ✅ **TLS Encryption** - All traffic encrypted in transit

### Compliance Standards

| Standard | Status |
|----------|--------|
| WCAG 2.1 AA | ✅ Implemented |
| Privacy Act | ✅ Compliant |
| GDPR | ✅ Compliant |
| SOC 2 Type II | 🔄 In Progress |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Commands

```bash
# Backend
make install      # Install dependencies
make test         # Run tests
make lint         # Run linters (ruff, mypy, codespell)
make playground   # Launch ADK playground

# Frontend
npm install       # Install dependencies
npm test          # Run unit tests
npm run build     # Production build
ng serve          # Development server
```

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Immigration Justice**

[Report Bug](https://github.com/Yash-Kavaiya/VisaShield-Angular/issues) · [Request Feature](https://github.com/Yash-Kavaiya/VisaShield-Angular/issues)

</div>
