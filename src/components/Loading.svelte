<script lang="ts">
	import Fa from 'svelte-fa';
	import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

	export let ms: number;
	export let minHeight = 0;

	export let update = false;

	let node: HTMLElement;

	async function wait(ms: number) {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}
</script>

{#key update}
	{#await wait(ms)}
		<div class="loading" bind:this={node} style="min-height:{minHeight}px;">
			<Fa icon={faCircleNotch} spin size="2x" />
		</div>
	{:then}
		<slot />
	{/await}
{/key}

<style>
	.loading {
		vertical-align: middle;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>
