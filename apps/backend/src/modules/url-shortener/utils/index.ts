import { SHORT_BASE_URL } from '../config/constants';

/**
 * Build the full short URL with the given code.
 * @param code - The short code
 * @returns The full short URL (e.g., "https://qrcodly.de/abc12")
 */
export function buildShortUrl(code: string): string {
	return `${SHORT_BASE_URL}${code}`;
}
