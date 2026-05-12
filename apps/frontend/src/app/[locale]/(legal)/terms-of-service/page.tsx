import type { DefaultPageParams } from '@/types/page';
import type { Metadata } from 'next';
import AgbContentEn from './content-en';

export async function generateMetadata({}: DefaultPageParams): Promise<Metadata> {
	return {
		title: 'Terms of Service | QRcodly',
		description: 'Terms of Service for using the QRcodly platform.',
	};
}

export default async function Page({}: DefaultPageParams) {
	return <AgbContentEn />;
}
