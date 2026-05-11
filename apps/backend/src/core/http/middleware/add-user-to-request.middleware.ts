import { PlanName } from '@/core/config/plan.config';
import { type TTokenType } from '@/core/domain/schema/UserSchema';
import { Logger } from '@/core/logging';
import { KeyCache } from '@/core/cache';
import { createRequestLogObject } from '@/libs/fastify/helpers';
import { getAuth } from '@clerk/fastify';
import { type FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { trackActiveSession } from '@/core/metrics';

async function resolveUserPlan(_userId: string): Promise<PlanName> {
	return PlanName.PRO;
}

export async function addUserToRequestMiddleware(request: FastifyRequest, _reply: unknown) {
	const auth = getAuth(request, {
		acceptsToken: ['session_token', 'api_key'],
	}) as {
		userId: string | null;
		tokenType: TTokenType;
		scopes?: string[];
	};

	const { userId, tokenType } = auth;

	if (userId) {
		const plan = await resolveUserPlan(userId);
		const scopes = tokenType === 'api_key' ? (auth.scopes ?? []) : undefined;
		request.user = { id: userId, tokenType, plan, scopes };
		void trackActiveSession(container.resolve(KeyCache).getClient(), userId);
	} else {
		request.user = undefined;
	}

	// don't log health check & uptime kuma
	if (request.clientIp !== '127.0.0.1' && request.clientIp !== '152.53.13.36') {
		container.resolve(Logger).info('api.request', {
			request: createRequestLogObject(request, { accessType: tokenType }),
		});
	}
}
