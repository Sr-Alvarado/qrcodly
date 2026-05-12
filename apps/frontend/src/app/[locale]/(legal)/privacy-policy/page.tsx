import type { DefaultPageParams } from '@/types/page';
import type { Metadata } from 'next';
import PrivacyPolicyContentEn from './content-en';

export async function generateMetadata({}: DefaultPageParams): Promise<Metadata> {
	return {
		title: 'Privacy Policy | QRcodly',
		description:
			'Privacy Policy for QRcodly. Learn how we collect, process, and protect your data.',
	};
}

export default async function Page({}: DefaultPageParams) {
	return <PrivacyPolicyContentEn />;
}
