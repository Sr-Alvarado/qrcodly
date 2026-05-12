import type { DefaultPageParams } from '@/types/page';
import type { Metadata } from 'next';
import ImprintContentEn from './content-en';

export async function generateMetadata({}: DefaultPageParams): Promise<Metadata> {
	return {
		title: 'Imprint – Legal Notice | QRcodly',
		description: 'Legal notice and imprint for QRcodly.',
	};
}

export default async function Page({}: DefaultPageParams) {
	return <ImprintContentEn />;
}
