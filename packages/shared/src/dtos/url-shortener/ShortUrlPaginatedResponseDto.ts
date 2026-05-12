import { type z } from 'zod';
import { ShortUrlResponseDto } from './ShortUrlResponseDto';
import { PaginationResponseDtoSchema } from '../PaginationDto';

export const ShortUrlPaginatedResponseDto = PaginationResponseDtoSchema(
	ShortUrlResponseDto,
).describe('Short URL Paginated Response');

export type TShortUrlPaginatedResponseDto = z.infer<
	typeof ShortUrlPaginatedResponseDto
>;
