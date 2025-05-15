<script lang="ts">
	import StoryCard from '$lib/components/StoryCard.svelte';
	import { addCardToBoard } from '$lib/services/boardServices';
	import { type StoryCardPosition } from '$lib/types/storyCard';
	import { boardStore } from '../svelteBridge';
	$: cards = $boardStore.cards;

	const handleDoubleClick = (event: MouseEvent) => {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const pos: StoryCardPosition = { x, y };
		addCardToBoard(pos);
	};
</script>

<div
	class="h-screen w-screen bg-gray-100"
	tabindex="0"
	on:dblclick={handleDoubleClick}
	role="button"
	aria-label="Add new card on double click"
>
	{#each cards as card (card)}
		<StoryCard {card} />
	{/each}
</div>
