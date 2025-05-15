import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { boardSlice } from './slices/boardSlice';

const rootReducer = combineSlices(boardSlice);

export const reduxStore = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type MainState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
