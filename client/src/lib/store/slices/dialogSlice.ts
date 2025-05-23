import { createSlice } from '@reduxjs/toolkit';

export interface BoardSlice {
	saveDialogOpen: boolean;
	cardSidebarOpen: string | null; // id of the card
}

const initialState: BoardSlice = {
	saveDialogOpen: false,
	cardSidebarOpen: null
};

export const dialogSlice = createSlice({
	name: 'dialog',
	initialState,
	reducers: {
		setSaveDialogOpen: (state, action) => {
			state.saveDialogOpen = action.payload;
		},
		setCardSidebarWithId: (state, action) => {
			state.cardSidebarOpen = action.payload;
		}
	}
});

export const { setSaveDialogOpen, setCardSidebarWithId } = dialogSlice.actions;
export default dialogSlice.reducer;
