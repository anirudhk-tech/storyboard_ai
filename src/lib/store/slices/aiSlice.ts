import { createSlice } from '@reduxjs/toolkit';

export interface AiSlice {
	summary: string;
}

const initialState: AiSlice = {
	summary: ''
};

export const aiSlice = createSlice({
	name: 'ai',
	initialState,
	reducers: {
		setSummary: (state, action) => {
			state.summary = action.payload;
		}
	}
});

export const { setSummary } = aiSlice.actions;

export default aiSlice.reducer;
