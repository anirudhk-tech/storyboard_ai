import { createSlice } from '@reduxjs/toolkit';

export interface Card {
	id: string;
	content: string;
}

export interface BoardSlice {
	cards: Card[];
	demo: string;
}

const initialState: BoardSlice = {
	cards: [],
	demo: 'This is a demo string'
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

export const { clearBoard } = boardSlice.actions;
export default boardSlice.reducer;
