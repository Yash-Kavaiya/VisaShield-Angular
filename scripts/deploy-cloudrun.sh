#!/bin/bash
# VisaShield - Direct Deploy to Cloud Run from Codespace
# This script deploys both frontend and backend to Cloud Run

set -e

echo "🚀 VisaShield - Deploy to Cloud Run"
echo "===================================="

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1 > /dev/null 2>&1; then
    echo "⚠️  Not logged in to GCP. Starting authentication..."
    gcloud auth login --no-launch-browser
fi

# Get/Set project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "Enter your GCP Project ID:"
    read PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

REGION="us-central1"
BACKEND_SERVICE="visashield-backend"
FRONTEND_SERVICE="visashield-frontend"

echo ""
echo "📋 Deployment Configuration:"
echo "   Project:  $PROJECT_ID"
echo "   Region:   $REGION"
echo ""

# Enable APIs
echo "Step 1/6: Enabling required APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --quiet

# Deploy Backend
echo ""
echo "Step 2/6: Building and deploying backend..."
cd /workspaces/VisaShield-Angular/visashieldai

gcloud run deploy $BACKEND_SERVICE \
    --source . \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "DD_ENV=production,DD_SERVICE=$BACKEND_SERVICE,DD_LLMOBS_ENABLED=1,DD_LLMOBS_ML_APP=visaAI" \
    --timeout 300 \
    --quiet

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $REGION --format='value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# Build Frontend
echo ""
echo "Step 3/6: Building frontend..."
cd /workspaces/VisaShield-Angular/frontend
npm ci
npm run build -- --configuration=production

# Deploy Frontend
echo ""
echo "Step 4/6: Deploying frontend..."
gcloud run deploy $FRONTEND_SERVICE \
    --source . \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "BACKEND_URL=$BACKEND_URL" \
    --timeout 60 \
    --quiet

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region $REGION --format='value(status.url)')

echo ""
echo "=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo ""
