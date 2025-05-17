import type { StoryCard } from '../types/storyCard';
import { AI_ACTIVE, LIMITS, MODELS, openai } from '../config.server';

const SUGGESTION_SYS = `
You are a creative helper.  Given the following beats, suggest the *next* plot point in one short sentence.
`;
const SUMMARIZE_SYS = `You are a story summarizer.  Condense the beats into one plain sentence.`;

export const suggestNextCard = async (
	prevSummary: string,
	cardStack: string[],
	cards: StoryCard[]
): Promise<{ suggestion: string; summary: string }> => {
	const summary = await summarizeCards(prevSummary, cardStack, cards);
	const allOrdered = cardStack.map((id) => cards.find((c) => c.id === id)!);
	const alreadySummarizedCount = Math.floor(cardStack.length / 5) * 5;
	const newPoints = allOrdered.slice(alreadySummarizedCount);

	const lines = [];

	lines.push('Here is the summary of the story so far:');
	lines.push(summary);
	if (newPoints.length > 0) {
		// If there are 5 cards, then it is summarized
		lines.push('Here are the last few plot points:', newPoints.map((c) => c!.content).join(', '));
	}
	lines.push('Please suggest the next plot point in one short sentence.');

	const PROMPT = lines.join('\n');

	console.log('[SUGGESTION IN PROCESS] ', PROMPT);

	if (!AI_ACTIVE) {
		console.warn('OpenAI is not active');
		return {
			suggestion: 'OpenAI is not active',
			summary: summary
		};
	}

	const res = await openai.chat.completions.create({
		model: MODELS.SUGGESTION,
		stop: ['\n'],
		messages: [
			{ role: 'system', content: SUGGESTION_SYS },
			{ role: 'user', content: PROMPT }
		],
		temperature: 0.7,
		max_tokens: LIMITS.SUGGESTION + 20
	});

	console.log('[SUGGESTION RESULT] ', res.choices[0].message.content);

	return {
		suggestion: res.choices[0].message.content?.trim() || 'Failed to generate a suggestion',
		summary
	};
};

export const summarizeCards = async (
	prevSummary: string,
	cardStack: string[],
	cards: StoryCard[]
): Promise<string> => {
	const orderedCards = cardStack.map((id) => cards.find((card) => card.id === id));

	if (orderedCards.length % 5 === 0 || (orderedCards.length < 5 && prevSummary === '')) {
		const lastFiveCards = orderedCards.slice(-5);
		const PROMPT = [
			'Here is a summary of the story so far:',
			prevSummary,
			'Here are the new plot points:',
			lastFiveCards.map((card) => card!.content).join(', '),
			'Please resummarize the story. Return a plain sentence only.'
		].join('\n');

		console.log('[SUMMARIZATION IN PROCESS] ', PROMPT);

		if (!AI_ACTIVE) {
			console.warn('OpenAI is not active');
			return 'OpenAI is not active';
		}

		const res = await openai.chat.completions.create({
			model: MODELS.SUMMARIZATION,
			stop: ['\n'],
			messages: [
				{ role: 'system', content: SUMMARIZE_SYS },
				{ role: 'user', content: PROMPT }
			],
			temperature: 0.7,
			max_tokens: LIMITS.SUMMARIZATION + 20
		});

		console.log('[SUMMARIZATION RESULT] ', res.choices[0].message.content);

		return res.choices[0].message.content?.trim() || prevSummary;
	} else {
		return prevSummary;
	}
};
