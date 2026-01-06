import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export interface SentryConfig {
  serviceName: string;
  dsn?: string;
  environment?: string;
  tracesSampleRate?: number;
  profileLifecycle?: 'trace' | 'manual';
  tracePropagationTargets?: (string | RegExp)[];
}

export function initializeSentry(config: SentryConfig): void {
  const {
    serviceName,
    dsn = process.env['SENTRY_DSN'],
    environment = process.env['NODE_ENV'] || 'development',
    tracesSampleRate = 1.0,
    profileLifecycle = 'trace',
    tracePropagationTargets = ['localhost', /^https?:\/\/.*\.dexo\.internal/],
  } = config;

  if (!dsn) {
    console.warn(`[${serviceName}] Sentry DSN not provided. Monitoring disabled.`);
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration(),
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],
    // Enable logs to be sent to Sentry
    enableLogs: true,
    tracesSampleRate,
    profileLifecycle,
    tracePropagationTargets,
    // Agregar tags globales del servicio
    initialScope: {
      tags: {
        service: serviceName,
      },
    },
  });

  console.log(`[${serviceName}] Sentry initialized successfully`);
}
