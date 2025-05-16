import { reduxStore } from '$lib/store/store';
import {
	addCard,
	calcBoardWidth,
	changeCardContent,
	moveCard,
	removeCard
} from '$lib/store/slices/boardSlice';
import { type StoryCard, type StoryCardPosition } from '$lib/types/storyCard';

export const addCardToBoard = (newPos: StoryCardPosition) => {
	const newCard: StoryCard = {
		id: crypto.randomUUID(),
		content: '',
		pos: newPos
	};

	reduxStore.dispatch(addCard(newCard));
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
};

export const resizeBoard = () => {
	reduxStore.dispatch(calcBoardWidth());
};
