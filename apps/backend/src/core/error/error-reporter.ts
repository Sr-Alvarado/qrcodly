import { singleton } from 'tsyringe';
import { OnShutdown } from '../decorators/on-shutdown.decorator';

export type TErrorLevel = 'fatal' | 'error' | 'warning' | 'info';

export type TReportingOptions = {
	level?: TErrorLevel;
};

/**
 * Error reporter (Sentry disabled — no-op).
 */
@singleton()
export class ErrorReporter {
	private report(_error: Error | string, _options?: TReportingOptions) {
		// no-op
	}

	error(e: Error, options?: TReportingOptions) {
		this.report(e, options);
	}

	@OnShutdown()
	onShutdown() {
		// no-op
	}
}
