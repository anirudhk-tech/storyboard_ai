<script lang="ts">
	import StoryCard from '$lib/components/StoryCard.svelte';
	import StoryCardConnector from '$lib/components/StoryCardConnector.svelte';
	import { addCardToBoard, resizeBoard } from '$lib/services/boardServices';
	import { type StoryCardPosition } from '$lib/types/storyCard';
	import { boardStore } from '../svelteBridge';
	$: cards = $boardStore.cards;
	$: boardWidth = $boardStore.boardSize?.width;
	$: boardHeight = $boardStore.boardSize?.height;

	const handleDoubleClick = (event: MouseEvent) => {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left - 160;
		const y = event.clientY - rect.top - 50;
		const pos: StoryCardPosition = { x, y };
		addCardToBoard(pos, false);
	};

	let prevCardCount = 0;
	$: if (cards.length !== prevCardCount) {
		prevCardCount = cards.length;
		resizeBoard();
	}
</script>

<div
	class="relative flex min-h-screen items-center justify-center
	       overflow-hidden bg-gradient-to-b from-[#0d1b2a] via-[#1b263b]
	       to-[#000]"
	style="width: {boardWidth}px; height: {boardHeight}px; min-width:100vw; min-height:100vh"
	tabindex="0"
	on:dblclick={handleDoubleClick}
	role="button"
	aria-label="Add new card on double click"
>
	<StoryCardConnector />
	{#each cards as card (card.id)}
		<StoryCard {card} />
	{/each}
</div>
