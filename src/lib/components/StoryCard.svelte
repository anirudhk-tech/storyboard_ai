<script lang="ts">
	import * as Card from './ui/card/index';
	import { type StoryCard } from '$lib/types/storyCard';
	import { onMount } from 'svelte';
	import { moveCardOnBoard, removeCardFromBoard, writeInCard } from '$lib/services/boardServices';
	import { draggable } from '$lib/actions/draggable';
	import interact from 'interactjs';
	export let card: StoryCard;

	let inputEl: HTMLTextAreaElement;

	onMount(() => {
		requestAnimationFrame(() => {
			inputEl && inputEl.focus();
		});
	});

	const autoResize = () => {
		inputEl.style.height = 'auto';
		inputEl.style.height = inputEl.scrollHeight + 'px';
	};

	const handleBlur = () => {
		if (inputEl.value.trim() === '') {
			removeCardFromBoard(card.id);
		} else {
			writeInCard(card.id, inputEl.value);
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			inputEl.blur();
		}
	};
</script>

<div
	use:draggable={{
		inertia: { enabled: true },
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
				const x = (parseFloat(el.getAttribute('data-x')!) || 0) + event.dx;
				const y = (parseFloat(el.getAttribute('data-y')!) || 0) + event.dy;

				el.style.transform = `translate(${x}px, ${y}px)`;
				el.setAttribute('data-x', x);
				el.setAttribute('data-y', y);
			},
			end(event) {
				const el = event.target as HTMLElement;

				const startX = parseFloat(el.dataset.startX!) || 0;
				const startY = parseFloat(el.dataset.startY!) || 0;
				const deltaX = parseFloat(el.dataset.x!) || 0;
				const deltaY = parseFloat(el.dataset.y!) || 0;

				moveCardOnBoard(card.id, { x: startX + deltaX, y: startY + deltaY });

				el.style.transform = '';
				el.removeAttribute('data-x');
				el.removeAttribute('data-y');
				el.removeAttribute('data-start-x');
				el.removeAttribute('data-start-y');
			}
		}
	}}
	class={`animate-float animate-fade-in absolute z-500 rounded-2xl bg-white/70 shadow-2xl drop-shadow-xl backdrop-blur-md`}
	style="top: {card.pos.y}px; left: {card.pos.x}px;"
>
	<Card.Root>
		<Card.Content>
			<textarea
				bind:this={inputEl}
				bind:value={card.content}
				class="w-full resize-none outline-none focus:outline-none"
				placeholder="Type your story point..."
				rows="1"
				on:input={autoResize}
				on:blur={handleBlur}
				on:keydown={handleKeyDown}
				on:dblclick|stopPropagation
			>
			</textarea>
		</Card.Content>
	</Card.Root>
</div>
