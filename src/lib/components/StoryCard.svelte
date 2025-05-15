<script lang="ts">
	import * as Card from './ui/card/index';
	import { type StoryCard } from '$lib/types/storyCard';
	export let card: StoryCard;
</script>

<Card.Root
	class={`absolute aspect-[2/1] rounded-lg bg-red-500 shadow-sm`}
	style="top: {card.pos.y}px; left: {card.pos.x}px;"
>
	<Card.Content>Hello, this is a new card component!</Card.Content>
</Card.Root>
