import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { boardSlice } from './slices/boardSlice';
import { aiSlice } from './slices/aiSlice';

const rootReducer = combineSlices(boardSlice, aiSlice);

export const reduxStore = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type MainState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
