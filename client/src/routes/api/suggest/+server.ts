import { json, type RequestHandler } from '@sveltejs/kit';
import { suggestNextCard } from '$lib/services/aiServices';
import type { StoryCard } from '../../../lib/types/storyCard';

export interface SuggestionResponse {
	suggestion: string;
	summary: string;
}

export interface SuggestionRequest {
	prevSummary: string;
	cardStack: string[];
	cards: StoryCard[];
}

export const POST: RequestHandler = (async ({ request }) => {
	const { prevSummary, cardStack, cards } = (await request.json()) as SuggestionRequest;

	const { suggestion, summary } = await suggestNextCard(prevSummary, cardStack, cards);
	return json({ suggestion, summary } satisfies SuggestionResponse);
}) satisfies RequestHandler;
