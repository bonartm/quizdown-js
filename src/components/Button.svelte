<script lang="ts">
    export let buttonAction = () => alert('Life has never Svelte better');
    export let disabled = false;
</script>

<button disabled="{disabled}" on:click="{buttonAction}">
    <slot>Hello World</slot>
</button>

<style>
    button:disabled {
        background-color: white;
        color: lightgray;
        box-shadow: 3px 3px var(--quizdown-color-primary),
            2px 2px var(--quizdown-color-primary),
            1px 1px var(--quizdown-color-primary);
        border: 0px solid var(--quizdown-color-primary);
    }

    button {
        margin: 10px;
        background-color: var(--quizdown-color-secondary);
        transition-duration: 0.2s;
        height: 2em;
        box-shadow: 3px 3px var(--quizdown-color-primary),
            2px 2px var(--quizdown-color-primary),
            1px 1px var(--quizdown-color-primary);
        border: 0px solid var(--quizdown-color-primary);
        overflow: hidden;
        padding: 0.8em;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
    }

    button:active:not(:disabled) {
        filter: brightness(1.1);
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    button:hover:not(:checked):not(:active):not(:disabled) {
        filter: brightness(1.1);
    }
</style>
