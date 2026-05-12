import { inject, injectable } from 'tsyringe';
import { CreateShortUrlUseCase } from './create-short-url.use-case';
import ShortUrlRepository from '../domain/repository/short-url.repository';
import { TShortUrlWithDomain } from '../domain/entities/short-url.entity';
import { Logger } from '@/core/logging';

@injectable()
export class GetReservedShortCodeUseCase {
	constructor(
		@inject(ShortUrlRepository) private shortUrlRepository: ShortUrlRepository,
		@inject(CreateShortUrlUseCase) private createShortUrlUseCase: CreateShortUrlUseCase,
		@inject(Logger) private logger: Logger,
	) {}

	async execute(userId: string): Promise<TShortUrlWithDomain> {
		const reservedShortUrls = await this.shortUrlRepository.findAll({
			limit: 1,
			page: 0,
			where: {
				createdBy: {
					eq: userId,
				},
				destinationUrl: {
					eq: null,
				},
				qrCodeId: {
					eq: null,
				},
				deletedAt: {
					eq: null,
				},
			},
		});

		if (reservedShortUrls.length > 0) {
			const existingUrl = reservedShortUrls[0];
			// Fetch with domain info and return
			const urlWithDomain = await this.shortUrlRepository.findOneById(existingUrl.id);
			return urlWithDomain!;
		}

		const shortUrl = await this.createShortUrlUseCase.execute(
			{
				destinationUrl: null,
				isActive: false,
			},
			userId,
		);

		return shortUrl;
	}
}
