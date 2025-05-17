import { setBoardId } from '$lib/store/slices/boardSlice';
import { setSaveDialogOpen } from '$lib/store/slices/dialogSlice';
import { reduxStore } from '$lib/store/store';

export const toggleSaveDialog = (isOpen: boolean) => {
	reduxStore.dispatch(setSaveDialogOpen(isOpen));
};

export const changeBoardId = (id: string) => {
	reduxStore.dispatch(setBoardId(id));
};
