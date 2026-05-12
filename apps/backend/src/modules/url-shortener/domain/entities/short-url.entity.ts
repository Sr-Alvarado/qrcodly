import {
	shortUrl,
	shortUrlRelations,
	type TShortUrl as TDbShortUrl,
	type TShortUrlWithDomain as TDbShortUrlWithDomain,
	type TShortUrlWithDomainAndTags as TDbShortUrlWithDomainAndTags,
} from '@qrcodly/db';

export type TShortUrl = Omit<TDbShortUrl, 'customDomainId'>;
export type TShortUrlWithDomain = Omit<TDbShortUrlWithDomain, 'customDomainId'>;
export type TShortUrlWithDomainAndTags = Omit<TDbShortUrlWithDomainAndTags, 'customDomainId'>;

export { shortUrlRelations };
export default shortUrl;
