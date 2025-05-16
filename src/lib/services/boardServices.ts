import { reduxStore } from '$lib/store/store';
import {
	addCard,
	calcBoardWidth,
	changeCardContent,
	changeSuggestionToCard,
	moveCard,
	removeCard,
	resizeCardHeight
} from '$lib/store/slices/boardSlice';
import { type StoryCard, type StoryCardPosition } from '$lib/types/storyCard';
import type { SuggestionResponse } from '../../routes/api/suggest/+server';
import { setSummary } from '$lib/store/slices/aiSlice';
import { DEFAULT_CARD_HEIGHT } from '$lib';

export const addCardToBoard = (newPos: StoryCardPosition, suggestion: boolean) => {
	const newCard: StoryCard = {
		id: crypto.randomUUID(),
		content: '',
		pos: newPos,
		suggestion,
		height: DEFAULT_CARD_HEIGHT
	};

	reduxStore.dispatch(addCard(newCard));
	resizeBoard();
};

export const moveCardOnBoard = (cardId: string, newPos: StoryCardPosition) => {
	reduxStore.dispatch(
		moveCard({
			cardId,
			pos: newPos
		})
	);
	resizeBoard();
};

export const writeInCard = (cardId: string, content: string) => {
	reduxStore.dispatch(changeCardContent({ cardId, content }));
};

export const removeCardFromBoard = (cardId: string) => {
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
		writeInCard(suggestionCard!.id, data.suggestion);
	} else {
		const newCard: StoryCard = {
			id: crypto.randomUUID(),
			content: data.suggestion,
			pos: {
				x: prevCard.pos.x + 300,
				y: prevCard.pos.y
			},
			suggestion: true,
			height: DEFAULT_CARD_HEIGHT
		};

		reduxStore.dispatch(addCard(newCard));
	}

	reduxStore.dispatch(setSummary(data.summary));
};

export const commitSuggestionToBoard = (cardId: string) => {
	reduxStore.dispatch(changeSuggestionToCard({ cardId }));
};

export const isSuggestionOnBoard = () => {
	return reduxStore.getState().board.cards.some((card) => card.suggestion);
};

export const changeCardHeight = (cardId: string, height: number) => {
	reduxStore.dispatch(resizeCardHeight({ cardId, height }));
};
