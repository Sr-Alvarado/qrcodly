'use client';

import { useMemo } from 'react';
import { createLinkFromShortUrl } from '@/lib/utils';
import type { TShortUrl } from '@shared/schemas';

/**
 * Hook to get a short URL link.
 *
 * @param shortUrl - The short URL object
 * @param short - If true, returns URL without protocol (for display)
 * @returns Object with the link and loading state
 */
export function useShortUrlLink(
	shortUrl: TShortUrl | null | undefined,
	short = false,
): { link: string | null; isLoading: boolean } {
	const link = useMemo(() => {
		if (!shortUrl) return null;
		return createLinkFromShortUrl(shortUrl, { short });
	}, [shortUrl, short]);

	return { link, isLoading: false };
}
