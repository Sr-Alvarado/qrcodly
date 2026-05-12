import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import { processAnalyticsAndRedirect } from './middlewares/process-analytics-and-redirect.middleware';
import createMiddleware from 'next-intl/middleware';
import { routing, SUPPORTED_LANGUAGES } from './i18n/routing';

const isProtectedRoute = createRouteMatcher([
	'(.*)/dashboard(.*)',
	'(.*)/collection(.*)',
	'(.*)/settings(.*)',
]);

const intlMiddleware = createMiddleware(routing);

const localePrefix = SUPPORTED_LANGUAGES.filter((l) => l !== 'en').join('|');
const localePrefixedNonTranslatedRoute = new RegExp(`^/(${localePrefix})/(docs)(/.*)?$`);

const scanPattern = /^\/u\/[a-z0-9]{5}$/;

const clerkHandler = clerkMiddleware(async (auth, req) => {
	const pathname = new URL(req.url).pathname;

	if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
		return NextResponse.next();
	}

	const localeMatch = pathname.match(localePrefixedNonTranslatedRoute);
	if (localeMatch) {
		const pathWithoutLocale = pathname.replace(`/${localeMatch[1]}`, '');
		const url = new URL(pathWithoutLocale, req.url);
		return NextResponse.redirect(url, 301);
	}

	if (isProtectedRoute(req)) await auth.protect();

	if (
		!pathname.startsWith('/api') &&
		!pathname.startsWith('/monitoring') &&
		!pathname.startsWith('/docs') &&
		!pathname.startsWith('/ingest') &&
		!pathname.startsWith('/qr/')
	) {
		const intlResponse = intlMiddleware(req);
		if (intlResponse) {
			return intlResponse;
		}
	}

	return NextResponse.next();
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
	const pathname = new URL(req.url).pathname;

	if (pathname.startsWith('/.well-known/')) {
		return NextResponse.next();
	}

	if (scanPattern.test(pathname)) {
		return processAnalyticsAndRedirect(req);
	}

	return clerkHandler(req, event);
}

export const config = {
	matcher: [
		'/((?!_next|_vercel|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/',
		'/(api|trpc)(.*)',
	],
};
