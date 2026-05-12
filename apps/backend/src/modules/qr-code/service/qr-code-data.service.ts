import { inject, injectable } from 'tsyringe';
import { convertQRCodeDataToStringByType, isDynamic, type TQrCodeContent } from '@shared/schemas';
import { buildShortUrl } from '@/modules/url-shortener/utils';
import ShortUrlRepository from '@/modules/url-shortener/domain/repository/short-url.repository';

/**
 * Service responsible for computing the qrCodeData string for a QR code.
 * This is the actual data that gets encoded into the QR code image.
 */
@injectable()
export class QrCodeDataService {
	constructor(
		@inject(ShortUrlRepository) private shortUrlRepository: ShortUrlRepository,
	) {}

	/**
	 * Computes the qrCodeData string for a QR code.
	 * For dynamic/editable content, this resolves the short URL.
	 * For static content, this returns the raw content string.
	 *
	 * @param qrCodeId - The QR code ID
	 * @param content - The QR code content
	 * @returns The computed qrCodeData string
	 */
	async computeQrCodeData(qrCodeId: string, content: TQrCodeContent): Promise<string> {
		// For non-dynamic content, compute directly without short URL
		if (!isDynamic(content)) {
			return convertQRCodeDataToStringByType(content);
		}

		// For dynamic content, we need to resolve the short URL
		const shortUrl = await this.shortUrlRepository.findOneByQrCodeId(qrCodeId);

		if (!shortUrl) {
			// No short URL linked yet - compute without it
			return convertQRCodeDataToStringByType(content);
		}

		// Build the full short URL
		const fullShortUrl = buildShortUrl(shortUrl.shortCode);

		// Compute the qrCodeData
		return convertQRCodeDataToStringByType(content, fullShortUrl);
	}
}
