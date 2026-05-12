import { type FastifyInstance, type FastifyPluginCallback } from 'fastify';

// modules
import qrCode from './qr-code/setup';
import configTemplate from './config-template/setup';
import urlShortener from './url-shortener/setup';
import tag from './tag/setup';
import analyticsIntegration from './analytics-integration/setup';
import userSurvey from './user-survey/setup';
import apiKey from './api-key/setup';

const modules: FastifyPluginCallback = (fastify: FastifyInstance, _options, done) => {
	fastify.register(qrCode);
	fastify.register(configTemplate);
	fastify.register(urlShortener);
	fastify.register(tag);
	fastify.register(analyticsIntegration);
	fastify.register(userSurvey);
	fastify.register(apiKey);
	done();
};

export default modules;
