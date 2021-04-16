<script lang="ts">
import type { Quiz } from "../quiz";

export let quiz: Quiz;

$: counter = quiz.counter
$: current = quiz.questions[$counter]
</script>

{#if current.type === 'MultipleChoice'}
    {#each current.answers as answer, i}
            <label>
                <input type=checkbox
                    bind:group={current.selected} 
                    value={i} >
                <span>{@html answer.html}</span>
            </label>            
    {/each}
{:else}
    {#each current.answers as answer, i}            
            <label>
                <input type=radio
                        bind:group={current.selected} 
                        value={i} >
                <span>{@html answer.html}</span>
            </label>
    {/each}
{/if}	



<style>

    label [type='radio'] + span {
        border-radius:0.4em;
    }


	label [type='checkbox'], 
    label [type='radio'] {
        display: none;
    }

    [type='checkbox'] + span, 
    [type='radio'] + span {
        transition-duration: 0.2s;
        background-color: var(--quizdown-color-secondary);
        box-shadow: 3px 3px var(--quizdown-color-primary), 2px 2px var(--quizdown-color-primary), 1px 1px var(--quizdown-color-primary);
        display: block;
        padding: 0.6rem;
        margin: 5px;
        font-weight: normal;
    }

    [type='checkbox']:active + span,
    [type='radio']:active + span {
        filter: brightness(1.1);
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    [type='checkbox']:hover:not(:active) + span,
    [type='radio']:hover:not(:active) + span {
        filter: brightness(1.1);
    }

    [type='checkbox']:checked + span,
    [type='radio']:checked + span {
        background-color: var(--quizdown-color-primary);
        transform: translate(3px, 3px);
        box-shadow: none;
    }
</style>




