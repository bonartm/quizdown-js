<script>
    export let current;
    export let max;

    function previous() {
        if (current > 0) {
            current--;
        }
    }
    function next() {
        if (current < max) {
            current++;
        }
    }
    function reset() {
        current = 0;
    }
</script>

<!-- <button on:click={previous}>Previous</button> -->

{#if current < max - 1}
    <button on:click="{next}">Next one!</button>
{:else if current < max}
    <button on:click="{next}">Get your results!</button>
{:else}<button on:click="{reset}">Try again!</button>{/if}

<hr />

<style>
    button {
        background-color: lightgray;
        transition-duration: 0.1s;
        width: 50%;
        height: 3em;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        border: 0px solid orange;
        font-family: inherit;
        font-size: 1em;
    }

    button:active {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    button:hover:not(:checked):not(:active) {
        background-color: #cfcfcf;
    }

    hr {
        margin-top: 1em;
        margin-bottom: 1em;
        border-top: 1px solid lightgray;
        width: 80%;
    }
</style>
