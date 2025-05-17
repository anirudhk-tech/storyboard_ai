<script lang="ts">
	import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onMount } from 'svelte';
	import { boardStore } from '../svelteBridge';
	import StoryCard from '$lib/components/StoryCard.svelte';
	import StoryCardConnector from '$lib/components/StoryCardConnector.svelte';
	import { addCardToBoard, loadCards } from '$lib/services/boardServices';
	import type { StoryCardPosition } from '../lib/types/storyCard'
	import SaveIcon from '~icons/mdi/content-save-outline';
	import { toggleSaveDialog } from '$lib/services/dialogServices';
	import SaveDialog from '$lib/components/SaveDialog.svelte';

	$: cards = $boardStore.cards;
	$: boardSize = $boardStore.boardSize ?? { width: 1000, height: 1000 };
	
	let container: HTMLDivElement;
	let viewport: HTMLDivElement;

	onMount(() => {
		loadCards();
		const z: ZoomBehavior<HTMLDivElement, unknown> = zoom<HTMLDivElement, unknown>()
			.filter((e) => {
				if (e.type === 'dblclick' || (e.target as HTMLElement).closest('.drag-root')) return false;
				return e.type === 'wheel' || e.type === 'touchmove' || e.type === 'mousedown';
			})
			.scaleExtent([0.2, 3])
			.translateExtent([
				[-Infinity, -Infinity],
				[Infinity, Infinity]
			])
			.on('zoom', ({ transform }) => {
				viewport.style.transform = `translate(${transform.x}px,${transform.y}px) scale(${transform.k})`;
			});

		select(container).style('touch-action', 'none').call(z);
		select(container).call(z.transform, zoomIdentity);
	});

	const handleDoubleClick = (e: MouseEvent) => {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		addCardToBoard(
			{ x: e.clientX - rect.left - 160, y: e.clientY - rect.top - 50 } satisfies StoryCardPosition,
			false
		);
	};

	const handleSaveButtonClick = () => toggleSaveDialog(true);
</script>

<div
	bind:this={container}
	class="board-container"
	on:dblclick={handleDoubleClick}
	role="button"
	tabindex="0"
	aria-label="Double click to add a card"
>
	<div
		bind:this={viewport}
		class="board-viewport"
		style:width={boardSize.width + 'px'}
		style:height={boardSize.height + 'px'}
	>
		<StoryCardConnector />
		{#each cards as card (card.id)}
			<StoryCard {card} />
		{/each}
	</div>
</div>
<SaveDialog/>
<button
class="absolute top-4 right-4 z-50 p-2 bg-white rounded-md hover:opacity-70"
on:click={handleSaveButtonClick}
>
	<SaveIcon class="w-6 h-6" />
</button>

<style>
	.board-container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #0d1b2a;
		cursor: grab;
	}

	.board-viewport {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
		will-change: transform;
	}
</style>
