// This line must come before importing any instrumented module.
const tracer = require('dd-trace').init({
  env: process.env.DD_ENV || 'development',
  service: 'visashield-frontend',
  version: '1.0.0',
  logInjection: true,
  runtimeMetrics: true,
  profiling: true,
  appsec: true
});

module.exports = tracer;
