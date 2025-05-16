<script lang="ts">
	import StoryCard from '$lib/components/StoryCard.svelte';
	import { addCardToBoard, resizeBoard } from '$lib/services/boardServices';
	import { type StoryCardPosition } from '$lib/types/storyCard';
	import { boardStore } from '../svelteBridge';
	$: cards = $boardStore.cards;
	$: boardWidth = $boardStore.boardSize?.width;
	$: boardHeight = $boardStore.boardSize?.height;

	const handleDoubleClick = (event: MouseEvent) => {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left - 160; // CARD WIDTH is 80px (centers)
		const y = event.clientY - rect.top - 50; // CARD HEIGHT is about 40px initially (centers)
		const pos: StoryCardPosition = { x, y };
		addCardToBoard(pos);
	};

	let prevCardCount = 0;
	$: if (cards.length !== prevCardCount) {
		prevCardCount = cards.length;
		resizeBoard();
	}
</script>

<div
	class="relative flex min-h-screen
        	items-center justify-center
            bg-gradient-to-b from-sky-200 via-blue-100 to-white"
	style="width: {boardWidth}px; height: {boardHeight}px; min-height: 100vh; min-width: 100vw"
	tabindex="0"
	on:dblclick={handleDoubleClick}
	role="button"
	aria-label="Add new card on double click"
>
	{#each cards as card (card.id)}
		<StoryCard {card} />
	{/each}
</div>
