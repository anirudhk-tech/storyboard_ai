<script lang="ts">
	import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
	import { select } from 'd3-selection';
	import { onMount } from 'svelte';
	import { boardStore, dialogStore } from '../svelteBridge';
	import StoryCard from '$lib/components/StoryCard.svelte';
	import StoryCardConnector from '$lib/components/StoryCardConnector.svelte';
	import { addCardToBoard } from '$lib/services/boardServices';
	import type { StoryCardPosition } from '../lib/types/storyCard'
	import SaveIcon from '~icons/mdi/content-save-outline';
	import { toggleSaveDialog } from '$lib/services/dialogServices';
	import SaveDialog from '$lib/components/SaveDialog.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import SideBar from '$lib/components/SideBar.svelte';

	let currentT = zoomIdentity; 

	$: cards = $boardStore.cards;
	$: boardSize = $boardStore.boardSize ?? { width: 1000, height: 1000 };
	$: sidebarOpen = $dialogStore.cardSidebarOpen;

	let container: HTMLDivElement;
	let viewport: HTMLDivElement;

	onMount(() => {
		const z: ZoomBehavior<HTMLDivElement, unknown> = zoom<HTMLDivElement, unknown>()
			.filter((e) => {
				if (e.type === 'dblclick' || (e.target as HTMLElement).closest('.drag-root') || (e.target as HTMLElement).closest('.drag-sidebar')) return false;
				return e.type === 'wheel' || e.type === 'touchmove' || e.type === 'mousedown';
			})
			.scaleExtent([0.2, 3])
			.translateExtent([
				[-Infinity, -Infinity],
				[Infinity, Infinity]
			])
			.on('zoom', ({ transform }) => {
				currentT = transform;
				viewport.style.transform = `translate(${transform.x}px,${transform.y}px) scale(${transform.k})`;
			});

		select(container).style('touch-action', 'none').call(z);
		select(container).call(z.transform, zoomIdentity);
	});

	const handleDoubleClick = (e: MouseEvent) => {
		const rect = container.getBoundingClientRect();
  		const screen = [e.clientX - rect.left, e.clientY - rect.top] as [number, number];
		const [x, y] = currentT.invert(screen);

		addCardToBoard(
			{ x: x - 160, y: y - 50 } satisfies StoryCardPosition,
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
	{#if sidebarOpen !== null}
		<SideBar />
	{/if}
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
<Toaster/>
<button
class="absolute top-4 right-4 z-50 p-2 bg-white rounded-md hover:opacity-70 z-10"
on:click={handleSaveButtonClick}
>
	<SaveIcon class="w-6 h-6" />
</button>

<style>
	.board-container {
		position: relative;
		width: 100vw;
		height: 100vh;
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
