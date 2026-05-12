'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { isDynamic, objDiff, type TQrCodeWithRelationsResponseDto } from '@shared/schemas';
import { toast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { qrCodeQueryKeys, useUpdateQrCodeMutation } from '@/lib/api/qr-code';
import { QrCodeUpdateDialog, UPDATE_DIALOG_DO_NOT_SHOW_AGAIN_KEY } from './QrCodeUpdateDialog';
import { useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '@/lib/api/ApiError';
import { useQrCodeGeneratorStore } from '../provider/QrCodeConfigStoreProvider';
import { safeLocalStorage } from '@/lib/utils';

type UpdateBtnDto = Pick<
	TQrCodeWithRelationsResponseDto,
	'id' | 'name' | 'config' | 'content' | 'shortUrl'
>;
const UpdateQrCodeBtn = ({ qrCode }: { qrCode: UpdateBtnDto }) => {
	const t = useTranslations('qrCode');
	const [hasMounted, setHasMounted] = useState(false);
	const [showInfoDialog, setShowInfoDialog] = useState(false);
	const [infoDialogIsOpen, setInfoDialogIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const updateQrCodeMutation = useUpdateQrCodeMutation();
	const { latestQrCode, updateLatestQrCode } = useQrCodeGeneratorStore((state) => state);
	const IS_DYNAMIC = !!qrCode.shortUrl && isDynamic(qrCode.content);

	const hasValidChanges =
		Object.keys(objDiff(qrCode.content, latestQrCode?.content)).length > 0 ||
		Object.keys(objDiff(qrCode.config, latestQrCode?.config)).length > 0 ||
		(qrCode.name || null) !== (latestQrCode?.name || null);

	useEffect(() => {
		setHasMounted(true);
		const saved = safeLocalStorage.getItem(UPDATE_DIALOG_DO_NOT_SHOW_AGAIN_KEY);
		setShowInfoDialog(saved !== 'true' && !IS_DYNAMIC);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleUpdate = async () => {
		try {
			await updateQrCodeMutation.mutateAsync(
				{
					qrCodeId: qrCode.id,
					data: {
						config: qrCode.config,
						content: qrCode.content,
						name: qrCode.name,
					},
				},
				{
					onSuccess: () => {
						toast({
							title: t('update.successTitle'),
							description: t('update.successDescription'),
							duration: 5000,
						});

						updateLatestQrCode({
							name: qrCode.name,
							config: qrCode.config,
							content: qrCode.content,
						});

						void queryClient.refetchQueries({ queryKey: qrCodeQueryKeys.listQrCodes });
						
					},
					onError: (err: Error) => {
						const error = err as ApiError;

						if (error.code === 0 || error.code >= 500) {
							
						}

						

						toast({
							variant: 'destructive',
							title: t('update.errorTitle'),
							description: error.message,
							duration: 5000,
						});
					},
				},
			);
		} catch {}
	};

	return (
		<>
			<Button
				className="cursor-pointer"
				isLoading={updateQrCodeMutation.isPending}
				onClick={() => {
					if (showInfoDialog) {
						setInfoDialogIsOpen(true);
					} else {
						void handleUpdate();
					}
				}}
				disabled={!hasMounted || !hasValidChanges || updateQrCodeMutation.isPending}
			>
				{t('updateBtn')}
			</Button>
			<QrCodeUpdateDialog
				isOpen={infoDialogIsOpen}
				setIsOpen={setInfoDialogIsOpen}
				onSubmit={handleUpdate}
			/>
		</>
	);
};

export default UpdateQrCodeBtn;
