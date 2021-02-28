<script lang='ts'>
    export let buttonAction = () => alert('Life has never Svelte better');
    export let disabled = false;
</script>

<button disabled="{disabled}" on:click={buttonAction}>
    <slot>Hello World</slot>
</button>  
  
<style>
    button:disabled {
        background-color: white;
        color:lightgray;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        border: 0px solid orange;

    }

    button {
        background:none;
        color:black;
        margin:10px;
        background-color: lightgray;
        transition-duration: 0.1s;
        height: 2em;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        border: 0px solid orange;
        font-family: inherit;
        font-size: 1em;
        overflow:hidden;
    }

    button:active:not(:disabled) {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    button:hover:not(:checked):not(:active):not(:disabled) {
        background-color: #cfcfcf;
    }
</style>

