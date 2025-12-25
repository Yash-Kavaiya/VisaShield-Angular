# VisaShield Deployment Guide

This guide provides instructions for deploying the VisaShield application, which consists of an Angular frontend and a Python FastAPI backend, to Google Cloud Run.

## Prerequisites

Before deploying, ensure you have the following:

- **Google Cloud SDK (gcloud CLI)**: [Install Guide](https://cloud.google.com/sdk/docs/install)
- **Node.js and npm**: For building the frontend
- **Python and uv**: For backend dependencies
- **A Google Cloud Project**: With billing enabled
- **Authenticated gcloud**: Run `gcloud auth login`

## Quick Deployment (Recommended)

The easiest way to deploy both frontend and backend is using the provided deployment script.

### Step 1: Authenticate and Set Project

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Run the Deployment Script

```bash
chmod +x scripts/deploy-cloudrun.sh
./scripts/deploy-cloudrun.sh
```

This script will:
- Enable required Google Cloud APIs
- Build and deploy the backend to Cloud Run
- Build and deploy the frontend to Cloud Run
- Configure environment variables for communication between services

### Step 3: Access Your Application

After successful deployment, the script will output the URLs for both frontend and backend services.

## Manual Deployment

If you prefer more control over the deployment process:

### Backend Deployment

```bash
cd visashieldai
make deploy
```

Or manually:

```bash
cd visashieldai
gcloud run deploy visashield-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars "DD_ENV=production,DD_SERVICE=visashield-backend,DD_LLMOBS_ENABLED=1,DD_LLMOBS_ML_APP=visaAI"
```

### Frontend Deployment

```bash
cd frontend
npm ci
npm run build -- --configuration=production
gcloud run deploy visashield-frontend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars "BACKEND_URL=YOUR_BACKEND_URL"
```

## Infrastructure Setup (Advanced)

For production deployments with proper infrastructure:

### Using Terraform

1. Navigate to the deployment directory:
   ```bash
   cd visashieldai/deployment/terraform
   ```

2. Initialize and apply Terraform:
   ```bash
   terraform init
   terraform apply
   ```

### CI/CD Setup

For automated deployments:

1. Set up Workload Identity Federation:
   ```bash
   chmod +x scripts/setup-gcp-wif.sh
   ./scripts/setup-gcp-wif.sh
   ```

2. Configure GitHub Actions or Cloud Build for CI/CD pipelines.

## Environment Variables

### Backend Environment Variables

- `DD_ENV`: Environment (production/development)
- `DD_SERVICE`: Service name (visashield-backend)
- `DD_LLMOBS_ENABLED`: Enable LLM observability (1)
- `DD_LLMOBS_ML_APP`: ML app name (visaAI)

### Frontend Environment Variables

- `BACKEND_URL`: URL of the deployed backend service

## Monitoring and Observability

The application includes built-in monitoring:

- **Cloud Trace**: For performance monitoring
- **Cloud Logging**: For application logs
- **Datadog APM**: For application performance monitoring (configure with provided .env.datadog)

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure you're logged in with `gcloud auth login`
2. **Project Not Set**: Set project with `gcloud config set project YOUR_PROJECT_ID`
3. **APIs Not Enabled**: The script enables required APIs automatically
4. **Build Failures**: Ensure all dependencies are installed locally before deploying

### Checking Deployment Status

```bash
# List Cloud Run services
gcloud run services list

# Check service logs
gcloud run services logs read SERVICE_NAME
```

### Rolling Back

```bash
gcloud run services update-traffic SERVICE_NAME --to-revisions REVISION_ID=100
```

## Local Development

For local testing before deployment:

```bash
# Backend
cd visashieldai
make install
make local-backend

# Frontend
cd frontend
npm install
ng serve
```

## Support

For issues with deployment, check:
- Google Cloud Console for service status
- Cloud Logging for error details
- The provided scripts and Terraform configurations</content>
<parameter name="filePath">/workspaces/VisaShield-Angular/DEPLOY.md