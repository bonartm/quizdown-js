<script lang="ts">
    export let buttonAction = () => alert('Life has never Svelte better');
    export let disabled = false;
    export let title = '';
</script>

<button title="{title}" disabled="{disabled}" on:click="{buttonAction}">
    <slot />
</button>

<style>
    button:disabled {
        background-color: white;

        filter: grayscale(100%);
        color: gray;
        cursor: initial;
    }

    button {
        background-color: white;
        color: var(--quizdown-color-text);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: 1px solid transparent;
        line-height: 1;
        text-align: center;
        transition: opacity 0.2s ease;
        text-decoration: none;
        display: inline-block;
        cursor: pointer;
        margin: 0.2rem;
        font-size: 1em;
    }

    button:hover:not(:checked):not(:active):not(:disabled) {
        filter: brightness(0.9);
    }
</style>
