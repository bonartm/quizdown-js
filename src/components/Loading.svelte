<script lang="ts">
    import Icon from './Icon.svelte';
    export let ms: number;

    async function wait(ms: number) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
</script>

{#await wait(ms)}
    <div class="loading">
        <Icon name="cog" spin="{true}" size="lg" />
    </div>
{:then resolved}
    <slot />
{/await}

<style>
    .loading {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
</style>
