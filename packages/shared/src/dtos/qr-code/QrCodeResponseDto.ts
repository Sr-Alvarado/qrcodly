import { z } from 'zod';
import { QrCodeSchema } from '../../schemas/QrCode';
import { ShortUrlSchema } from '../../schemas/ShortUrl';
import { TagResponseDto } from '../tag/TagResponseDto';

export const QrCodeResponseDto = QrCodeSchema;
export type TQrCodeResponseDto = z.infer<typeof QrCodeResponseDto>;

export const QrCodeWithRelationsResponseDto = QrCodeSchema.extend({
	shortUrl: ShortUrlSchema.nullable().describe(
		'Linked short URL for dynamic QR codes, or null for static QR codes',
	),
	tags: z.array(TagResponseDto).default([]).describe('Tags assigned to this QR code'),
});
export type TQrCodeWithRelationsResponseDto = z.infer<typeof QrCodeWithRelationsResponseDto>;
