<script lang="ts">
    import { fade } from 'svelte/transition';
    export let show: Boolean;
    export let hint: string;
</script>

{#if show}
    <p in:fade|local="{{ duration: 400 }}" class="hint">
        💡 {@html hint}
    </p>
{/if}
