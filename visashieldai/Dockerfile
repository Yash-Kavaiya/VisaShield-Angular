# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM python:3.11-slim

RUN pip install --no-cache-dir uv==0.8.13 ddtrace

WORKDIR /code

COPY ./pyproject.toml ./README.md ./uv.lock* ./

COPY ./app ./app

RUN uv sync --frozen

ARG COMMIT_SHA=""
ENV COMMIT_SHA=${COMMIT_SHA}

ARG AGENT_VERSION=0.0.0
ENV AGENT_VERSION=${AGENT_VERSION}

# Datadog APM environment variables
ENV DD_ENV="production"
ENV DD_SERVICE="visashield-backend"
ENV DD_VERSION="1.0.0"
ENV DD_LOGS_INJECTION=true
ENV DD_TRACE_SAMPLE_RATE="1"
ENV DD_DATA_STREAMS_ENABLED=true
ENV DD_TRACE_REMOVE_INTEGRATION_SERVICE_NAMES_ENABLED=true
ENV DD_APPSEC_ENABLED=true
ENV DD_LLMOBS_ENABLED=1
ENV DD_LLMOBS_ML_APP=visaAI

EXPOSE 8080

CMD ["uv", "run", "ddtrace-run", "uvicorn", "app.fast_api_app:app", "--host", "0.0.0.0", "--port", "8080"]