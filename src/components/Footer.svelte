<script lang="ts">
    import type { Quiz } from '../quiz';
    import Button from './Button.svelte'
    export let quiz: Quiz;
    import SpeechBubble from '../slots/SpeechBubble.svelte'

    $: counter = quiz.counter
    $: finished = quiz.finished
    $: current =  quiz.questions[$counter]
    $: show_hint = false

</script>

<div class="button-row">


    {#if !$finished}
        <Button disabled={$counter === 0} buttonAction={quiz.previous}>Previous</Button>
        <span>
            <Button disabled={current.hint === null || current.hint === ''} buttonAction={() => show_hint=!show_hint}>Help me!</Button>
            {#if show_hint}<SpeechBubble>{@html current.hint}</SpeechBubble>{/if}
        </span>	
        {#if $counter === counter.max-1}
            <Button buttonAction={quiz.calc_points}>Evalution</Button>
        {:else}
            <Button buttonAction={quiz.next}>Next</Button>
        {/if}
 
    {:else}
        <Button buttonAction={quiz.reset}>One more time!</Button>
    {/if}
    </div>

<hr>

<div class="credits">This quiz was created with <a href="https://github.com/bonartm/quizdown-js">quizdown-js</a> </div> 


<style>
    .button-row {
        margin-top:0.8em;
        justify-content: center;
        display: inline-flex;
    }
    
    .credits {
		font-size: small;
		text-align:end;
	}

    hr {
        margin-top: 1em;
        margin-bottom: 1em;
        border-top: 1px solid lightgray;
        width: 80%;
    }
</style>






