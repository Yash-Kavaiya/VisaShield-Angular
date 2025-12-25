# Cloud Run Deployment Setup

This document explains how to configure GitHub Actions for automatic deployment to Google Cloud Run.

## Required GitHub Secrets

Go to **Repository Settings → Secrets and variables → Actions** and add:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID | GCP Console → Project Settings |
| `GCP_SA_KEY` | Service Account JSON key | See instructions below |

## Google Cloud Setup

### 1. Create a Service Account

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --project=$PROJECT_ID

# Get the service account email
export SA_EMAIL="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"
```

### 2. Grant Required Permissions

```bash
# Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/run.admin"

# Artifact Registry Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/artifactregistry.admin"

# Service Account User (for deploying)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/iam.serviceAccountUser"

# Storage Admin (for container images)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.admin"

# Secret Manager Accessor (for secrets)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor"
```

### 3. Create and Download Service Account Key

```bash
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=$SA_EMAIL

# Copy the contents of github-actions-key.json to GitHub secret GCP_SA_KEY
cat github-actions-key.json
```

### 4. Create Required Secrets in Secret Manager

```bash
# Create Datadog API key secret
echo -n "your-datadog-api-key" | gcloud secrets create datadog-api-key \
    --data-file=- \
    --replication-policy="automatic"

# Create Google API key secret (for Gemini/Vertex AI)
echo -n "your-google-api-key" | gcloud secrets create google-api-key \
    --data-file=- \
    --replication-policy="automatic"
```

### 5. Enable Required APIs

```bash
gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    cloudbuild.googleapis.com \
    --project=$PROJECT_ID
```

## Workflow Triggers

The deployment workflow triggers on:

1. **Push to `main` branch** - Deploys to production
2. **Push to `codespace-special-eureka-5g4r69vvvjh46p9` branch** - Deploys for testing
3. **Manual trigger** - Go to Actions → Deploy to Cloud Run → Run workflow

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Run                          │
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────────┐   │
│  │   visashield-frontend │    │   visashield-backend     │   │
│  │   (Angular + Nginx)   │───▶│   (Python + FastAPI)     │   │
│  │   Port: 8080          │    │   Port: 8080             │   │
│  └──────────────────────┘    └──────────────────────────┘   │
│           │                            │                     │
│           └────────────┬───────────────┘                     │
│                        ▼                                     │
│              ┌─────────────────┐                            │
│              │  Secret Manager  │                            │
│              │  - DD_API_KEY    │                            │
│              │  - GOOGLE_API_KEY│                            │
│              └─────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │    Datadog      │
              │  (Monitoring)   │
              └─────────────────┘
```

## Services Deployed

| Service | Description | Memory | CPU |
|---------|-------------|--------|-----|
| `visashield-frontend` | Angular SPA served by Nginx | 512Mi | 1 |
| `visashield-backend` | Python FastAPI with AI agent | 2Gi | 2 |

## Environment Variables

### Backend (`visashield-backend`)
- `DD_ENV` - Datadog environment (development/staging/production)
- `DD_SERVICE` - Service name for Datadog
- `DD_VERSION` - Git commit SHA
- `DD_LOGS_INJECTION` - Enable log injection
- `DD_TRACE_SAMPLE_RATE` - APM sampling rate
- `DD_APPSEC_ENABLED` - Enable AppSec
- `DD_LLMOBS_ENABLED` - Enable LLM Observability
- `DD_LLMOBS_ML_APP` - LLM app name

### Frontend (`visashield-frontend`)
- `BACKEND_URL` - URL of the backend service

## Troubleshooting

### Check deployment logs
```bash
gcloud run services logs read visashield-backend --region=us-central1
gcloud run services logs read visashield-frontend --region=us-central1
```

### Check service status
```bash
gcloud run services describe visashield-backend --region=us-central1
gcloud run services describe visashield-frontend --region=us-central1
```

### View in console
- [Cloud Run Console](https://console.cloud.google.com/run)
- [Artifact Registry](https://console.cloud.google.com/artifacts)
