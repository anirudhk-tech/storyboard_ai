import { createSlice } from '@reduxjs/toolkit';
import { type StoryCard } from '$lib/types/storyCard';

export interface BoardSlice {
	cards: StoryCard[];
}

const initialState: BoardSlice = {
	cards: []
};

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		addCard: (state, action) => {
			state.cards.push(action.payload);
		},
		clearBoard: (state) => {
			state.cards = [];
		}
	}
});

export const { clearBoard, addCard } = boardSlice.actions;
export default boardSlice.reducer;
