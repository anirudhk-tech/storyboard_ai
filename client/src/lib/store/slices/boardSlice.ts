import { createSlice } from '@reduxjs/toolkit';
import { type StoryCard } from '../../types/storyCard';

export interface BoardSize {
	width: number;
	height: number;
}

export interface BoardSlice {
	boardId: string | null;
	cards: StoryCard[];
	boardSize: BoardSize;
	addedIdsStack: string[];
}

const initialState: BoardSlice = {
	boardId: null,
	cards: [],
	boardSize: {
		width: 0,
		height: 0
	},
	addedIdsStack: []
};

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		setBoardId: (state, action) => {
			state.boardId = action.payload;
		},
		setCards: (state, action) => {
			state.cards = action.payload;
			state.addedIdsStack = action.payload.map((card: StoryCard) => card.id);
		},
		addCard: (state, action) => {
			state.cards.push(action.payload);
			if (!action.payload.suggestion) state.addedIdsStack.push(action.payload.id);
		},
		removeCard: (state, action) => {
			const { cardId } = action.payload;
			state.cards = state.cards.filter((card) => card.id !== cardId);
			state.addedIdsStack = state.addedIdsStack.filter((id) => id !== cardId);
		},
		moveCard: (state, action) => {
			const { cardId, pos } = action.payload;
			const card = state.cards.find((card) => card.id === cardId);
			if (card) {
				card.pos = pos;
			}
		},
		resizeCardHeight: (state, action) => {
			const { cardId, height } = action.payload;
			const card = state.cards.find((card) => card.id === cardId);
			if (card) {
				card.height = height;
			}
		},
		changeCardContent: (state, action) => {
			const { cardId, content } = action.payload;
			const card = state.cards.find((card) => card.id === cardId);
			if (card) {
				card.content = content;
			}
		},
		clearBoard: (state) => {
			state.cards = [];
			state.addedIdsStack = [];
		},
		calcBoardWidth: (state) => {
			const rightMostCard = state.cards.reduce((prev, current) => {
				return prev.pos.x > current.pos.x ? prev : current;
			}, state.cards[0]);
			if (rightMostCard && state.boardSize) {
				state.boardSize.width = rightMostCard.pos.x + 1000;
			}

			const bottomMostCard = state.cards.reduce((prev, current) => {
				return prev.pos.y > current.pos.y ? prev : current;
			}, state.cards[0]);

			if (bottomMostCard && state.boardSize) {
				state.boardSize.height = bottomMostCard.pos.y + 1000;
			}
		},
		changeSuggestionToCard: (state, action) => {
			const { cardId } = action.payload;
			const card = state.cards.find((card) => card.id === cardId);
			if (card) {
				card.suggestion = false;
				state.addedIdsStack.push(card.id);
			}
		}
	}
});

export const {
	clearBoard,
	addCard,
	changeCardContent,
	removeCard,
	calcBoardWidth,
	moveCard,
	changeSuggestionToCard,
	resizeCardHeight,
	setCards,
	setBoardId
} = boardSlice.actions;
export default boardSlice.reducer;
