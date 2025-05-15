<script lang="ts">
	import { boardStore } from '../../store/svelteBridge';
	$: demoText = $boardStore.demo;
</script>

<div class="h-screen w-screen bg-gray-100">
	<hi>{demoText}</hi>
</div>
