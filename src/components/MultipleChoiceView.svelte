<script lang="ts">
import type { Quiz } from "../quiz";

export let quiz: Quiz;

$: counter = quiz.counter
$: current = quiz.questions[$counter]
</script>


{#each current.answers as answer, i}
<label>
	<input type="checkbox"
		bind:group={current.selected} 
		value={i} >
		<span>{@html answer.html}<span>
</label>
{/each}

<style>
	label [type='checkbox'] {
        display: none;
    }

    [type='checkbox'] + span {
        transition-duration: 0.2s;
        background-color: var(--quizdown-color-secondary);
        box-shadow: 3px 3px var(--quizdown-color-primary), 2px 2px var(--quizdown-color-primary), 1px 1px var(--quizdown-color-primary);
        display: block;
        padding: 0.7em;
        margin: 5px;
    }

    [type='checkbox']:active + span {
        filter: brightness(1.1);
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    [type='checkbox']:hover:not(:active) + span {
        filter: brightness(1.1);
    }

    [type='checkbox']:checked + span {
        background-color: var(--quizdown-color-primary);
        transform: translate(3px, 3px);
        box-shadow: none;
    }
</style>




