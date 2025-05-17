import { reduxStore } from '$lib/store/store';
import {
	addCard,
	calcBoardWidth,
	changeCardContent,
	changeSuggestionToCard,
	moveCard,
	removeCard,
	resizeCardHeight,
	setCards
} from '$lib/store/slices/boardSlice';
import { type StoryCard, type StoryCardPosition } from '../types/storyCard';
import type { SuggestionResponse } from '../../routes/api/suggest/+server';
import { setSummary } from '$lib/store/slices/aiSlice';
import { DEFAULT_CARD_HEIGHT } from '$lib';

export const loadCards = async () => {
	const res = await fetch('/api/cards');
	if (!res.ok) {
		throw new Error('Failed to fetch cards');
	}
	const data: StoryCard[] = await res.json();
	reduxStore.dispatch(setCards(data));
	reduxStore.dispatch(calcBoardWidth());
};

export const addCardToBoard = async (newPos: StoryCardPosition, suggestion: boolean) => {
	const res = await fetch('/api/cards', {
		method: 'POST',
		body: JSON.stringify({
			content: '',
			height: DEFAULT_CARD_HEIGHT,
			pos: newPos
		})
	});

	if (!res.ok) {
		throw new Error('Failed to create card');
	}

	const newCard: StoryCard = await res.json();
	reduxStore.dispatch(addCard({ suggestion, ...newCard }));
	resizeBoard();
};

export const moveCardOnBoardState = (cardId: string, newPos: StoryCardPosition) => {
	reduxStore.dispatch(
		moveCard({
			cardId,
			pos: newPos
		})
	);
	resizeBoard();
};

export const moveCardOnBoardFinal = async (card: StoryCard, newPos: StoryCardPosition) => {
	const res = await fetch(`/api/cards/${card.id}`, {
		method: 'PUT',
		body: JSON.stringify({
			height: card!.height,
			pos: newPos,
			content: card!.content
		})
	});

	if (!res.ok) {
		throw new Error('Failed to move card');
	}

	reduxStore.dispatch(
		moveCard({
			cardId: card.id,
			pos: newPos
		})
	);
	resizeBoard();
};

export const writeInCard = async (card: StoryCard, content: string) => {
	const res = await fetch(`/api/cards/${card.id}`, {
		method: 'PUT',
		body: JSON.stringify({
			height: card.height,
			pos: card.pos,
			content
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error('Failed to move card');
	}

	reduxStore.dispatch(changeCardContent({ cardId: card.id, content }));
};

export const removeCardFromBoard = (cardId: string) => {
	const res = fetch(`/api/cards/${cardId}`, {
		method: 'DELETE'
	});

	if (!res) {
		throw new Error('Failed to delete card');
	}

	reduxStore.dispatch(removeCard({ cardId }));
	resizeBoard();
};

export const resizeBoard = () => {
	reduxStore.dispatch(calcBoardWidth());
};

export const addSuggestionToBoard = async (prevCard: StoryCard) => {
	const res = await fetch('/api/suggest', {
		method: 'POST',
		body: JSON.stringify({
			prevSummary: reduxStore.getState().ai.summary,
			cardStack: reduxStore.getState().board.addedIdsStack,
			cards: reduxStore.getState().board.cards
		})
	});
	const data: SuggestionResponse = await res.json();

	if (isSuggestionOnBoard()) {
		const suggestionCard = reduxStore.getState().board.cards.find((card) => card.suggestion);
		writeInCard(suggestionCard!, data.suggestion);
	} else {
		const newCard: StoryCard = {
			content: data.suggestion,
			height: DEFAULT_CARD_HEIGHT,
			pos: {
				x: prevCard.pos.x + 300,
				y: prevCard.pos.y
			},
			suggestion: true,
			id: crypto.randomUUID(), // temporary id
			createdAt: new Date().toISOString()
		};

		reduxStore.dispatch(addCard(newCard));
	}

	reduxStore.dispatch(setSummary(data.summary));
};

export const commitSuggestionToBoard = async (card: StoryCard) => {
	const res = await fetch('/api/cards', {
		method: 'POST',
		body: JSON.stringify({
			content: card.content,
			height: card.height,
			pos: card.pos
		})
	});

	if (!res.ok) {
		throw new Error('Failed to create card');
	}
	reduxStore.dispatch(changeSuggestionToCard({ cardId: card.id }));
};

export const isSuggestionOnBoard = () => {
	return reduxStore.getState().board.cards.some((card) => card.suggestion);
};

export const changeCardHeight = async (card: StoryCard, height: number) => {
	const res = await fetch(`/api/cards/${card.id}`, {
		method: 'PUT',
		body: JSON.stringify({
			height: height,
			pos: card.pos,
			content: card.content
		})
	});

	if (!res.ok) {
		throw new Error('Failed to move card');
	}

	reduxStore.dispatch(resizeCardHeight({ cardId: card.id, height }));
};
