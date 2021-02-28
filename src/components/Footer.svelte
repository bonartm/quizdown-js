<script lang="ts">
    import type { Quiz } from '../quiz';
    import Button from './Button.svelte'
    export let quiz: Quiz;
    import SpeechBubble from '../slots/SpeechBubble.svelte'

    $: counter = quiz.counter
    $: finished = quiz.finished
    $: current =  quiz.questions[$counter]
    let show_hint = false
    // disable hint on new question
    $: {
        $counter
        show_hint = false
    }

</script>

<div class="quizdown-button-row">
    {#if !$finished}
        <!-- previous, disabled on first question -->
        <Button disabled={$counter === 0} buttonAction={quiz.previous}>Previous</Button>
        <!-- help, disabled if no hint is available -->
        <span>
            <Button disabled={current.hint === null || current.hint === ''} buttonAction={() => show_hint = !show_hint}>Help me!</Button>
            {#if show_hint}<SpeechBubble>{@html current.hint}</SpeechBubble>{/if}
        </span>	
        <!-- next or evaluation on last question -->
        {#if $counter === counter.max-1}
            <Button buttonAction={quiz.calc_points}>Evalution</Button>
        {:else}
            <Button buttonAction={quiz.next}>Next</Button>
        {/if} 
    {:else}
        <!-- start quiz again on result page -->
        <Button buttonAction={quiz.reset}>One more time!</Button>
    {/if}
</div>

<hr>

<div class="quizdown-credits">This quiz was created with <a href="https://github.com/bonartm/quizdown-js">quizdown-js</a>.</div> 


<style>
    .quizdown-button-row {
        margin-top:0.8em;
        justify-content: center;
        display: inline-flex;
    }

    .quizdown-credits a {
        color: darkgray;
    }

    .quizdown-credits a:hover {
        text-decoration: underline;
    }

    .quizdown-credits {
		font-size: small;
		text-align:end;
        color:gray;
	}

    hr {
        margin-top: 1em;
        margin-bottom: 1em;
        border-top: 1px solid lightgray;
        width: 80%;
    }
</style>






