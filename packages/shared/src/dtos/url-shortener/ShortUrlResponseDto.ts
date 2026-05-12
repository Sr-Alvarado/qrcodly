import { type z } from 'zod';
import { ShortUrlSchema } from '../../schemas/ShortUrl';
import { TagResponseDto } from '../tag/TagResponseDto';

/**
 * Schema for the Short URL Response DTO.
 */
export const ShortUrlResponseDto = ShortUrlSchema.extend({
	tags: TagResponseDto.array().default([]).describe('Tags assigned to this short URL'),
});
export type TShortUrlResponseDto = z.infer<typeof ShortUrlResponseDto>;
