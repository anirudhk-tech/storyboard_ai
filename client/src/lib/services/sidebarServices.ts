import { setCardSidebarWithId } from '$lib/store/slices/dialogSlice';
import { reduxStore } from '$lib/store/store';
import type { Message } from '$lib/types/sidebar';

export const openCardSidebar = (cardId: string) => {
	reduxStore.dispatch(setCardSidebarWithId(cardId));
};

export const closeCardSidebar = () => {
	reduxStore.dispatch(setCardSidebarWithId(null));
};

export const generateSidebarImage = async (cardId: string) => {
	const card = reduxStore.getState().board.cards.find((card) => card.id === cardId);
	if (!card) {
		throw new Error('Card not found');
	}

	// TOO EXPENSIVE, HAVE TO DISABLE FOR NOW
	// const prompt = card.content;
	// const res = await fetch(`/api/sidebar/image`, {
	// 	method: 'POST',
	// 	body: JSON.stringify({ prompt }),
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });

	// if (!res.ok) {
	// 	throw new Error('Failed to generate image');
	// }

	// const data = await res.json();
	// return data.image;

	return 'https://img.freepik.com/premium-photo/fantasy-world-with-medieval-buildings-around-lake_839169-27003.jpg';
};

export const replyToSidebarMessage = async (conversation: Message[]) => {
	const res = await fetch(`/api/sidebar/message`, {
		method: 'POST',
		body: JSON.stringify({ conversation }),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error('Failed to generate message');
	}

	const data = await res.json();
	return data.message;
};
