<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    let innerHeight: number;
    const height = tweened(innerHeight, {
        duration: 100,
    });
    let mounted = false;
    onMount(() => (mounted = true));
    $: {
        if (mounted) {
            height.set(innerHeight);
        }
    }
</script>

<div style="height:{$height}px;">
    <div bind:clientHeight="{innerHeight}">
        <slot />
    </div>
</div>
