import { derived, readable } from 'svelte/store';
import { reduxStore } from './store';
import type { MainState } from './store';

export const reduxState = readable<MainState>(reduxStore.getState(), (set) => {
	const unsubscribe = reduxStore.subscribe(() => {
		set(reduxStore.getState());
	});
	return unsubscribe;
});

export const boardStore = derived(reduxState, (state) => state.board);
