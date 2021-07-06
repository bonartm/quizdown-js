<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    let innerHeight: number;
    const height = tweened(innerHeight, {
        duration: 700,
        easing: cubicOut,
    });
    let mounted = false;
    onMount(() => (mounted = true));
    $: {
        if (mounted) {
            height.set(innerHeight);
        }
    }
</script>

<div class="container" style="height:{$height}px;">
    <div class="inner" bind:clientHeight="{innerHeight}">
        <slot />
    </div>
</div>

<style>
    .container {
        padding: 2px 16px;
        display: grid;
        align-items: start;
        overflow: hidden;
    }
</style>
