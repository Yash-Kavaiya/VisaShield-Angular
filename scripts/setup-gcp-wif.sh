#!/bin/bash
# VisaShield - GCP Workload Identity Federation Setup Script
# This script sets up keyless authentication between GitHub Actions and GCP

set -e

echo "🔧 VisaShield GCP Setup for GitHub Actions (Workload Identity Federation)"
echo "=========================================================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project info
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
REPO="Yash-Kavaiya/VisaShield-Angular"
SA_NAME="github-actions"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
POOL_NAME="github-pool"
PROVIDER_NAME="github-provider"

echo "📋 Configuration:"
echo "   Project ID:     $PROJECT_ID"
echo "   Project Number: $PROJECT_NUMBER"
echo "   Repository:     $REPO"
echo "   Service Account: $SA_EMAIL"
echo ""

read -p "Continue with this configuration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Step 1/6: Enabling required APIs..."
gcloud services enable \
    iamcredentials.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    --project=$PROJECT_ID

echo ""
echo "Step 2/6: Creating Workload Identity Pool..."
gcloud iam workload-identity-pools create $POOL_NAME \
    --location="global" \
    --display-name="GitHub Actions Pool" \
    --project=$PROJECT_ID 2>/dev/null || echo "   Pool already exists, continuing..."

echo ""
echo "Step 3/6: Creating Workload Identity Provider..."
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
    --location="global" \
    --workload-identity-pool=$POOL_NAME \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor" \
    --attribute-condition="assertion.repository=='$REPO'" \
    --project=$PROJECT_ID 2>/dev/null || echo "   Provider already exists, continuing..."

echo ""
echo "Step 4/6: Creating Service Account..."
gcloud iam service-accounts create $SA_NAME \
    --display-name="GitHub Actions" \
    --project=$PROJECT_ID 2>/dev/null || echo "   Service account already exists, continuing..."

echo ""
echo "Step 5/6: Granting IAM permissions to Service Account..."
ROLES=(
    "roles/run.admin"
    "roles/artifactregistry.admin"
    "roles/iam.serviceAccountUser"
    "roles/storage.admin"
)

for role in "${ROLES[@]}"; do
    echo "   Adding $role..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SA_EMAIL" \
        --role="$role" \
        --quiet
done

echo ""
echo "Step 6/6: Allowing GitHub to impersonate Service Account..."
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/attribute.repository/${REPO}" \
    --project=$PROJECT_ID

echo ""
echo "✅ Setup Complete!"
echo ""
echo "=========================================================================="
echo "📝 NOW ADD THESE SECRETS TO YOUR GITHUB REPOSITORY:"
echo "=========================================================================="
echo ""
echo "Go to: https://github.com/$REPO/settings/secrets/actions/new"
echo ""
echo "┌─────────────────────┬────────────────────────────────────────────────┐"
echo "│ Secret Name         │ Value                                          │"
echo "├─────────────────────┼────────────────────────────────────────────────┤"
printf "│ GCP_PROJECT_ID      │ %-46s │\n" "$PROJECT_ID"
printf "│ GCP_PROJECT_NUMBER  │ %-46s │\n" "$PROJECT_NUMBER"
echo "└─────────────────────┴────────────────────────────────────────────────┘"
echo ""
echo "After adding the secrets, push any commit to trigger the deployment!"
