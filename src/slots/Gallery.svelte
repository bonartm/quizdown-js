<script lang="ts">
    import { fly, fade } from 'svelte/transition';

    let direction = -1;
    export let key;
</script>

<div class="gallery-wrapper">
    {#key key}
        <div
            class="gallery-item"
            in:fade="{{ duration: 300, delay: 300 }}"
            out:fade="{{ duration: 300 }}"
        >
            <slot />
        </div>
    {/key}
</div>

<style>
    .gallery-wrapper {
        display: grid;
        align-items: start;
    }

    .gallery-item {
        grid-row-start: 1;
        grid-column-start: 1;
    }
</style>
