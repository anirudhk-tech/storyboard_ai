<script lang="ts">
	import * as Card from './ui/card/index';
	import { type StoryCard } from '$lib/types/storyCard';
	import { onMount } from 'svelte';
	import {
		addSuggestionToBoard,
		changeCardHeight,
		commitSuggestionToBoard,
		isSuggestionOnBoard,
		moveCardOnBoard,
		removeCardFromBoard,
		writeInCard
	} from '$lib/services/boardServices';
	import { draggable } from '$lib/actions/draggable';
	import interact from 'interactjs';
	import Pencil from '~icons/lucide/pencil';
	import Check from '~icons/lucide/check';
	import Delete from '~icons/lucide/trash-2';
	import IconRefreshCwSolid from '~icons/heroicons-outline/refresh';
	import { boardStore } from '../../svelteBridge';
	import { DEFAULT_CARD_WIDTH } from '$lib';
	export let card: StoryCard;

	let inputEl: HTMLTextAreaElement;

	$: mostRecentCardId = $boardStore.addedIdsStack[$boardStore.addedIdsStack.length - 1];

	onMount(() => {
		requestAnimationFrame(() => {
			inputEl && inputEl.focus();
		});
	});

	const handleBlur = () => {
		if (inputEl.value.trim() === '') {
			removeCardFromBoard(card.id);
		} else {
			writeInCard(card.id, inputEl.value);
		}
		changeCardHeight(card.id, inputEl.scrollHeight);
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			inputEl.blur();
		}
	};

	const handleSuggestClick = () => {
		addSuggestionToBoard(card);
	};

	const handleCommitClick = () => {
		commitSuggestionToBoard(card.id);
	};

	const handleDeleteClick = () => {
		removeCardFromBoard(card.id);
	};

	const autoResize = () => {
		inputEl.style.height = 'auto';
		inputEl.style.height = inputEl.scrollHeight + 'px';
	};
</script>

<div
	use:draggable={{
		inertia: { enabled: true },
		ignoreFrom: '.no-drag',
		modifiers: [interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })],
		listeners: {
			start(event) {
				const el = event.target as HTMLElement;
				el.style.animation = 'none';

				el.dataset.startX = card.pos.x.toString();
				el.dataset.startY = card.pos.y.toString();
				el.dataset.x = '0';
				el.dataset.y = '0';
			},
			move(event) {
				const el = event.target as HTMLElement;
				const startX = parseFloat(el.dataset.startX!) || 0;
				const startY = parseFloat(el.dataset.startY!) || 0;
				const x = (parseFloat(el.getAttribute('data-x')!) || 0) + event.dx;
				const y = (parseFloat(el.getAttribute('data-y')!) || 0) + event.dy;

				el.style.transform = `translate(${x}px, ${y}px)`;
				el.setAttribute('data-x', x);
				el.setAttribute('data-y', y);

				moveCardOnBoard(card.id, { x: startX + x, y: startY + y });
			},
			end(event) {
				const el = event.target as HTMLElement;
				el.style.transform = '';
				el.removeAttribute('data-x');
				el.removeAttribute('data-y');
				el.removeAttribute('data-start-x');
				el.removeAttribute('data-start-y');
			}
		}
	}}
	class={`drag-root animate-float animate-fade-in absolute z-500 rounded-2xl bg-white/70 shadow-2xl drop-shadow-xl backdrop-blur-md`}
	style="top: {card.pos.y}px; left: {card.pos.x}px; border: {card.suggestion
		? '2px dashed red'
		: 'none'}; border-radius: 12px"
>
	{#if card.suggestion}
		<div
			class="pointer-events-none absolute -inset-[3px]
			       rounded-[16px]
			       bg-[conic-gradient(from_180deg_at_50%_50%,#0ea5e9_0deg,#a855f7_120deg,#60a5fa_240deg,#0ea5e9_360deg)] opacity-80 blur-sm transition-opacity
			       duration-500 group-hover:opacity-100"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute -inset-[1px] rounded-[15px] bg-black/40 blur-lg"
			aria-hidden="true"
		></div>
	{/if}
	<Card.Root class="relative" style="width: {DEFAULT_CARD_WIDTH}px">
		{#if card.suggestion}
			<div
				class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:8px_8px]"
			></div>
		{/if}
		<div class="no-drag absolute -top-7 right-0 flex flex-row gap-2">
			{#if !card.suggestion}
				<button
					on:mousedown|stopPropagation
					on:mouseup|stopPropagation
					on:click|stopPropagation={handleDeleteClick}
				>
					<Delete class="pointer-events-auto cursor-pointer text-white hover:opacity-70" />
				</button>
			{/if}
			{#if card.id === mostRecentCardId}
				<button
					on:mousedown|stopPropagation
					on:mouseup|stopPropagation
					on:click|stopPropagation={handleSuggestClick}
				>
					<Pencil class="pointer-events-auto cursor-pointer text-white hover:opacity-70" />
				</button>
			{/if}
			{#if card.suggestion}
				<button
					on:mousedown|stopPropagation
					on:mouseup|stopPropagation
					on:click|stopPropagation={handleSuggestClick}
				>
					<IconRefreshCwSolid
						class="pointer-events-auto cursor-pointer text-white hover:opacity-70"
					/>
				</button>
				<button
					on:mousedown|stopPropagation
					on:mouseup|stopPropagation
					on:click|stopPropagation={handleCommitClick}
				>
					<Check class="pointer-events-auto cursor-pointer text-white hover:opacity-70" />
				</button>
			{/if}
		</div>
		<Card.Content>
			<textarea
				bind:this={inputEl}
				bind:value={card.content}
				class="w-full resize-none outline-none focus:outline-none"
				placeholder="Type your story point..."
				rows="5"
				on:blur={handleBlur}
				on:keydown={handleKeyDown}
				on:dblclick|stopPropagation
				on:input={autoResize}
			>
			</textarea>
		</Card.Content>
	</Card.Root>
</div>
