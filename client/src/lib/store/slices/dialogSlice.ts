import { createSlice } from '@reduxjs/toolkit';

export interface BoardSlice {
	saveDialogOpen: boolean;
}

const initialState: BoardSlice = {
	saveDialogOpen: false
};

export const dialogSlice = createSlice({
	name: 'dialog',
	initialState,
	reducers: {
		setSaveDialogOpen: (state, action) => {
			state.saveDialogOpen = action.payload;
		}
	}
});

export const { setSaveDialogOpen } = dialogSlice.actions;
export default dialogSlice.reducer;
