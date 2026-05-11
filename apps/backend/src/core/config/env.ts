// import env
import 'dotenv/config';
import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
	BASE_URL: z.url().default('http://localhost:5001'),
	FRONTEND_URL: z.url().default('http://localhost:3000'),
	BACKEND_URL: z.url(),
	DB_HOST: z.string(),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	TEST_DB_NAME: z.string().default('qrcodly_test'),
	DB_PORT: z.string(),
	DB_MIGRATING: z
		.union([z.boolean(), z.string().transform((val) => val === 'true')])
		.default(false),
	DB_SEEDING: z.union([z.boolean(), z.string().transform((val) => val === 'true')]).default(false),
	NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
	API_PORT: z.string().default('5001'),
	API_HOST: z.string().default('127.0.0.1'),
	LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
	REDIS_URL: z.url(),
	JWT_SECRET: z.string().min(32),
	COOKIE_SECRET: z.string().min(32),
	SMTP_HOST: z.string(),
	SMTP_PORT: z.string(),
	SMTP_USER: z.string(),
	SMTP_PASS: z.string(),
	S3_ENDPOINT: z.string(),
	S3_REGION: z.string(),
	S3_UPLOAD_KEY: z.string(),
	S3_UPLOAD_SECRET: z.string(),
	S3_BUCKET_NAME: z.string(),
	S3_PUBLIC_URL: z.url(),
	SENTRY_DSN: z.string().optional().default(''),
	SENTRY_ENVIRONMENT: z.enum(['development', 'production']).default('production'),
	AXIOM_DATASET: z.string().optional(),
	AXIOM_TOKEN: z.string().optional(),
	CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
	CLERK_WEBHOOK_SECRET_KEY: z.string(),
	UMAMI_HOST: z.string().optional().default(''),
	UMAMI_WEBSITE: z.string().optional().default(''),
	UMAMI_USERNAME: z.string().optional().default(''),
	UMAMI_PASSWORD: z.string().optional().default(''),
	CUSTOM_DOMAIN_CNAME_TARGET: z.string().default('customers.qrcodly.de'),
	CLOUDFLARE_API_TOKEN: z.string().optional().default(''),
	CLOUDFLARE_ZONE_ID: z.string().optional().default(''),
	CLOUDFLARE_DCV_DELEGATION_TARGET: z.string().optional().default(''),
	INTERNAL_API_SECRET: z.string().min(32),
	STRIPE_SECRET_KEY: z.string().optional().default(''),
	STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
	STRIPE_PRO_PRICE_ID_MONTHLY: z.string().optional().default(''),
	STRIPE_PRO_PRICE_ID_ANNUAL: z.string().optional().default(''),
	ANALYTICS_ENCRYPTION_KEY: z
		.string()
		.optional()
		.default('0000000000000000000000000000000000000000000000000000000000000000'),
	DISABLE_RATE_LIMITING: z
		.union([z.boolean(), z.string().transform((val) => val === 'true')])
		.default(false),

	// OpenTelemetry — set the dataset name to enable, leave empty to disable
	OTEL_METRICS_DATASET: z.string().optional(),
	OTEL_METRICS_INTERVAL_MS: z.coerce.number().default(60000),
	OTEL_TRACES_DATASET: z.string().optional(),
});

// Don't touch the part below
// --------------------------

const merged = server;
type MergedOutput = z.infer<typeof merged>;
let env: MergedOutput = process.env as unknown as MergedOutput;

const skip =
	!!process.env.SKIP_ENV_VALIDATION &&
	process.env.SKIP_ENV_VALIDATION !== 'false' &&
	process.env.SKIP_ENV_VALIDATION !== '0';
if (!skip) {
	const parsed = merged.safeParse(process.env);

	if (parsed.success === false) {
		console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
		throw new Error('Invalid environment variables');
	}

	env = new Proxy(parsed.data, {
		get(target, prop) {
			if (typeof prop !== 'string') return undefined;
			return target[prop as keyof typeof target];
		},
	});
}

export { env };
