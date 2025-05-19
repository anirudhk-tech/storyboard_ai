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
import { toast } from 'svelte-sonner';

export const checkBoardExists = async (boardId: string | null) => {
	if (!boardId) return false;
	const res = await fetch(`/api/cards/${boardId}`, {
		method: 'HEAD'
	});

	if (res.status === 404) {
		return false;
	}

	return true;
};

export const loadCards = async (boardId: string | null) => {
	if (!boardId) return;

	const res = await fetch(`/api/cards/${boardId}`);
	if (!res.ok) {
		throw new Error('Failed to fetch cards');
	}
	const data: StoryCard[] = await res.json();

	reduxStore.dispatch(setCards(data));
	reduxStore.dispatch(calcBoardWidth());
	toast.success('Cards loaded', {
		description: 'For board ' + boardId,
		duration: 2000
	});
};

export const saveCards = async (boardId: string | null) => {
	if (!boardId) return;

	const cards = reduxStore.getState().board.cards;
	const savePromises = cards.map(async (card) => {
		return fetch(`/api/cards/${boardId}`, {
			method: 'POST',
			body: JSON.stringify({
				content: card.content,
				height: card.height,
				pos: card.pos
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			if (!res.ok) {
				throw new Error('Failed to save cards');
			}
			return res.json();
		});
	});

	try {
		await Promise.all(savePromises);
		toast.success('Cards saved', {
			description: 'For board ' + boardId,
			duration: 4000
		});
	} catch (error) {
		console.error('Failed to save cards', error);
		toast.error('Failed to save cards', {
			description: 'For board ' + boardId,
			duration: 4000
		});
	}
};

export const addCardToBoard = async (newPos: StoryCardPosition, suggestion: boolean) => {
	const boardId = reduxStore.getState().board.boardId;
	if (boardId) {
		const res = await fetch(`/api/cards/${boardId}`, {
			method: 'POST',
			body: JSON.stringify({
				content: '',
				height: DEFAULT_CARD_HEIGHT,
				pos: newPos
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			throw new Error('Failed to create card');
		}

		const newCard: StoryCard = await res.json();
		reduxStore.dispatch(addCard({ suggestion, ...newCard }));
	} else {
		const newCard: StoryCard = {
			content: '',
			height: DEFAULT_CARD_HEIGHT,
			pos: newPos,
			suggestion,
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString()
		};

		reduxStore.dispatch(addCard(newCard));
	}

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
	const boardId = reduxStore.getState().board.boardId;
	if (boardId) {
		const res = await fetch(`/api/cards/${boardId}/${card.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				height: card!.height,
				pos: newPos,
				content: card!.content
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			throw new Error('Failed to move card');
		}
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
	const boardId = reduxStore.getState().board.boardId;
	if (boardId) {
		const res = await fetch(`/api/cards/${boardId}/${card.id}`, {
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
	}

	reduxStore.dispatch(changeCardContent({ cardId: card.id, content }));
};

export const removeCardFromBoard = (cardId: string) => {
	const boardId = reduxStore.getState().board.boardId;
	if (boardId) {
		const res = fetch(`/api/cards/${boardId}/${cardId}`, {
			method: 'DELETE'
		});

		if (!res) {
			throw new Error('Failed to delete card');
		}
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
		}),
		headers: {
			'Content-Type': 'application/json'
		}
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
	const boardId = reduxStore.getState().board.boardId;
	if (!boardId) {
		reduxStore.dispatch(changeSuggestionToCard({ cardId: card.id }));
		return;
	}

	const res = await fetch('/api/cards', {
		method: 'POST',
		body: JSON.stringify({
			content: card.content,
			height: card.height,
			pos: card.pos
		}),
		headers: {
			'Content-Type': 'application/json'
		}
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
	const boardId = reduxStore.getState().board.boardId;
	if (boardId) {
		const res = await fetch(`/api/cards/${boardId}/${card.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				height: height,
				pos: card.pos,
				content: card.content
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			throw new Error('Failed to move card');
		}
	}

	reduxStore.dispatch(resizeCardHeight({ cardId: card.id, height }));
};
