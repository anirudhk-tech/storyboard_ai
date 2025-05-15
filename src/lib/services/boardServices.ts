import { reduxStore } from '$lib/store/store';
import { addCard } from '$lib/store/slices/boardSlice';
import { type StoryCard, type StoryCardPosition } from '$lib/types/storyCard';

export const addCardToBoard = (newPos: StoryCardPosition) => {
	const newCard: StoryCard = {
		id: crypto.randomUUID(),
		content: '',
		pos: newPos
	};

	reduxStore.dispatch(addCard(newCard));
};
