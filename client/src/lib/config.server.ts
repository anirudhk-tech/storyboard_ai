import { z } from 'zod';
import { OpenAI } from 'openai';
import { OPENAI_KEY, OPENAI_ACTIVE } from '$env/static/private';

const raw = {
	OPENAI_KEY,
	OPENAI_ACTIVE
};

const env = z
	.object({
		OPENAI_KEY: z.string().nonempty(),
		OPENAI_ACTIVE: z.string().nonempty(),
		SUGGESTION_MODEL: z.string().default('gpt-3.5-turbo'),
		SUGGESTION_TOKEN_LIMIT: z.number().default(100),
		SUMMARIZATION_MODEL: z.string().default('gpt-3.5-turbo'),
		SUMMARIZATION_TOKEN_LIMIT: z.number().default(100),
		SERVER_URL: z.string().default('http://localhost:4000')
	})
	.parse(raw);

export const openai = new OpenAI({
	apiKey: env.OPENAI_KEY
});

export const MODELS = {
	SUGGESTION: env.SUGGESTION_MODEL,
	SUMMARIZATION: env.SUMMARIZATION_MODEL
};

export const LIMITS = {
	SUGGESTION: env.SUGGESTION_TOKEN_LIMIT,
	SUMMARIZATION: env.SUMMARIZATION_TOKEN_LIMIT
};

export const AI_ACTIVE = env.OPENAI_ACTIVE === 'true';

export const SERVER_URL = env.SERVER_URL;
