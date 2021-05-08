<script lang="ts">
    export let buttonAction = () => alert('Life has never Svelte better');
    export let disabled = false;
</script>

<button disabled="{disabled}" on:click="{buttonAction}">
    <slot>Hello World</slot>
</button>

<style>
    button:disabled {
        background-color: rgb(231, 231, 231);
        filter: grayscale(100%);
    }

    button {
        background-color: var(--quizdown-color-secondary);
        color: var(--quizdown-color-text);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: 1px solid transparent;
        font-size: var(--font-size);
        line-height: 1;
        text-align: center;
        transition: opacity 0.2s ease;
        text-decoration: none;
        transform: scale(1);
        display: inline-block;
        cursor: pointer;
        margin: 0.2rem;
    }

    button:hover:not(:checked):not(:active):not(:disabled) {
        filter: brightness(0.9);
    }
</style>
