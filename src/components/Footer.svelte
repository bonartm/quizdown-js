<script lang="ts">
    export let quiz;
    $: counter = quiz.counter
    $: finished = quiz.finished
</script>

<hr>

<div class='button-row'>
    {#if !$finished}	
    <button disabled="{$counter === 0}" on:click={quiz.previous}>-</button>	
        {#if $counter === counter.max-1}
            <button on:click={quiz.calc_points}>Show Results</button>
        {:else}
            <button on:click={quiz.next}>+</button>
        {/if}
    {:else}
        <button on:click={quiz.reset}>Start new</button>
    {/if}

</div>



<style>
    .button-row{
        width:100%;
        text-align: center;
        display:inline-flex;
    }
    
    button:disabled {
        background-color: white;
    }

    button {
        margin:10px;
        background-color: lightgray;
        transition-duration: 0.1s;
        width: 50%;
        height: 3em;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        border: 0px solid orange;
        font-family: inherit;
        font-size: 1em;
    }

    button:active:not(:disabled) {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    button:hover:not(:checked):not(:active):not(:disabled) {
        background-color: #cfcfcf;
    }

    hr {
        margin-top: 1em;
        margin-bottom: 1em;
        border-top: 1px solid lightgray;
        width: 80%;
    }
</style>


