import type { StoryCard } from '../types/storyCard';
import { AI_ACTIVE, LIMITS, MODELS, openai } from '../config.server';
import type { Message } from '$lib/types/sidebar';

const SUGGESTION_SYS = `
You are a creative helper.  Given the following beats, suggest the *next* plot point in one short sentence.
`;
const SUMMARIZE_SYS = `You are a story summarizer.  Condense the beats into one plain sentence.`;
const MESSAGE_SYS = `+You are the writer’s co-author and sounding board. Read the last few messages and reply as a partner would—warm, conversational, and focused on moving the story forward. Keep it natural (no robotic or over-the-top language), and build on what has been said.`;

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

export const generateImage = async (prompt: string): Promise<string> => {
	if (prompt.trim().length < 10) {
		console.warn('Prompt is too short');
		return 'Prompt is too short';
	}

	if (!AI_ACTIVE) {
		console.warn('OpenAI is not active');
		return 'OpenAI is not active';
	}

	const res = await openai.images.generate({
		model: MODELS.IMAGE,
		prompt,
		n: 1,
		size: '1024x1024'
	});

	if (!res || !res.data || !res.data[0].b64_json) {
		console.error('Error generating image.');
		return 'Error generating image';
	}

	return res.data[0].b64_json;
};

export const generateMessage = async (conversation: Message[]): Promise<string> => {
	if (!AI_ACTIVE) {
		console.warn('OpenAI is not active');
		return 'OpenAI is not active';
	}

	const prompt = conversation
		.slice(-5)
		.reverse()
		.map((message: Message) => {
			return `${message.role === 'user' ? 'User' : 'AI'}: ${message.content}`;
		})
		.join('\n');

	const res = await openai.chat.completions.create({
		model: MODELS.MESSAGE,
		messages: [
			{ role: 'system', content: MESSAGE_SYS },
			{ role: 'user', content: prompt }
		],
		max_tokens: LIMITS.MESSAGE + 20
	});

	if (!res || !res.choices || res.choices.length === 0) {
		console.error('Error generating message.');
		return "Sorry, I couldn't generate a message.";
	}

	return res.choices[0].message.content ?? "Sorry, I couldn't generate a message.";
};
