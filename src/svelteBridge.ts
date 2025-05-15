import { derived, readable } from 'svelte/store';
import { reduxStore, type MainState } from '$lib/store/store';

export const reduxState = readable<MainState>(reduxStore.getState(), (set) => {
	const unsubscribe = reduxStore.subscribe(() => {
		set(reduxStore.getState());
	});
	return unsubscribe;
});

export const boardStore = derived(reduxState, (state) => state.board);
