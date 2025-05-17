import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { boardSlice } from './slices/boardSlice';
import { aiSlice } from './slices/aiSlice';
import { dialogSlice } from './slices/dialogSlice';

const rootReducer = combineSlices(boardSlice, aiSlice, dialogSlice);

export const reduxStore = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type MainState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
