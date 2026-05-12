'use client';
import { getQueryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';
import { TooltipProvider } from '../ui/tooltip';
import { ClerkProvider } from '@clerk/nextjs';
import type { SupportedLanguages } from '@/i18n/routing';
import { enUS, esES } from '@clerk/localizations';
import { shadcn } from '@clerk/themes';

export default function Providers({
	locale,
	children,
}: {
	locale?: SupportedLanguages;
	children: React.ReactNode;
}) {
	const queryClient = getQueryClient();

	const localeMap: Record<string, typeof enUS> = {
		en: enUS,
		es: esES,
	};

	const clerkLocale = locale ? localeMap[locale] || enUS : enUS;

	return (
		<ClerkProvider
			localization={clerkLocale}
			appearance={{
				theme: shadcn,
			}}
			clerkJSUrl="/__clerk-js/dist/clerk.browser.js"
		>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>{children}</TooltipProvider>
			</QueryClientProvider>
		</ClerkProvider>
	);
}
