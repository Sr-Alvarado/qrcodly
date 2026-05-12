import { relations } from 'drizzle-orm';
import { boolean, datetime, index, text, varchar } from 'drizzle-orm/mysql-core';
import { createTable } from '../utils';
import qrCode from './qr-code';
import { type TTag } from './tag';
import shortUrlTag from './short-url-tag';

const shortUrl = createTable(
	'short_url',
	{
		id: varchar('id', {
			length: 36,
		}).primaryKey(),
		shortCode: varchar({ length: 5 }).notNull().unique(),
		name: varchar({ length: 50 }),
		destinationUrl: text(),
		qrCodeId: varchar({
			length: 36,
		})
			.references(() => qrCode.id, { onDelete: 'set null' })
			.unique(),
		customDomainId: varchar({
			length: 36,
		}),
		isActive: boolean().notNull(),
		createdBy: varchar({ length: 255 }).notNull(),
		createdAt: datetime().notNull(),
		updatedAt: datetime(),
		deletedAt: datetime(),
	},
	(t) => [
		// Composite index for list queries with sorting (ORDER BY createdAt DESC WHERE createdBy=?)
		index('i_short_url_created_by_created_at').on(t.createdBy, t.createdAt),
		index('i_short_url_qr_code_id').on(t.qrCodeId),
		// Composite index for reserved URL lookups (WHERE createdBy=? AND qrCodeId IS NULL AND destinationUrl IS NULL)
		index('i_short_url_reserved').on(t.createdBy, t.qrCodeId),
	],
);

export type TShortUrl = typeof shortUrl.$inferSelect;
// Extended type that includes tags
export type TShortUrlWithDomain = TShortUrl;
// Extended type that includes tags
export type TShortUrlWithDomainAndTags = TShortUrl & {
	tags: TTag[];
};
export default shortUrl;

// Relation Definition for shortUrl
export const shortUrlRelations = relations(shortUrl, ({ one, many }) => ({
	qrCode: one(qrCode, {
		fields: [shortUrl.qrCodeId],
		references: [qrCode.id],
	}),
	shortUrlTags: many(shortUrlTag),
}));
