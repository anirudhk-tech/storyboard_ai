<script lang="ts">
	import { boardStore } from '../../svelteBridge';
	import { line, curveCatmullRom } from 'd3-shape';
	import { type StoryCard } from '../types/storyCard'
	import { DEFAULT_CARD_WIDTH } from '$lib';

	$: boardWidth = $boardStore.boardSize?.width;
	$: boardHeight = $boardStore.boardSize?.height;
	$: cards = $boardStore.cards;
	$: stack = $boardStore.addedIdsStack;
	$: orderedCards = stack
		.map((id) => cards.find((card) => card.id === id))
		.filter((c): c is StoryCard => !!c);

	const makeConnector = line<StoryCard>()
		.x((d) => d.pos.x + DEFAULT_CARD_WIDTH / 2)
		.y((d) => d.pos.y + d.height / 2)
		.curve(curveCatmullRom.alpha(0.5));

	$: connectorPath = orderedCards.length > 1 ? makeConnector(orderedCards) : '';
</script>

{#if cards.length > 1}
	<svg class="pointer-events-none absolute inset-0" viewBox={`0 0 ${boardWidth} ${boardHeight}`}>
		<defs>
			<!-- a stark two‐tone gradient -->
			<linearGradient id="techGradient" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stop-color="#1e293b" />
				<stop offset="100%" stop-color="#0ea5e9" />
			</linearGradient>

			<!-- pattern of tiny rectangles for a circuit‐trace feel -->
			<pattern
				id="techPattern"
				patternUnits="userSpaceOnUse"
				width="8"
				height="8"
				patternTransform="rotate(45)"
			>
				<rect width="6" height="2" fill="#0ea5e9" />
			</pattern>
		</defs>

		<!-- the main path: gradient stroke + patterned overlay via stroke‐dasharray -->
		<path
			d={connectorPath}
			fill="none"
			stroke="white"
			stroke-width="3"
			stroke-linecap="square"
			stroke-linejoin="miter"
			stroke-dasharray="4 4 1 4"
			class="tech-flow"
		/>
	</svg>
{/if}

<style>
	.tech-flow {
		stroke-dashoffset: 0;
		animation: flow 1s linear infinite;
	}

	@keyframes flow {
		to {
			stroke-dashoffset: -14;
		}
	}
</style>
