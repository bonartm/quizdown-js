<script lang="ts">
    export let show: Boolean;
    export let hint: string;
</script>

{#if show}
    <p class="hint">💡 {@html hint}</p>
{/if}

<style>
    .hint {
        font-size: smaller;
    }
</style>
