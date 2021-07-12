<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    export let minHeight = 0;

    let innerHeight: number;
    const height = tweened(innerHeight, {
        duration: 100,
    });
    let mounted = false;
    onMount(() => (mounted = true));
    $: {
        if (mounted) {
            height.set(Math.max(minHeight, innerHeight));
        }
    }
</script>

<div style="height:{$height}px;">
    <div bind:clientHeight="{innerHeight}">
        <slot />
    </div>
</div>
