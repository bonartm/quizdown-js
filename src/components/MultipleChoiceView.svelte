<script lang="ts">
import type { Quiz } from "../quiz";

export let quiz: Quiz;

let current = quiz.current()
</script>


{#each quiz.current().answers as answer, i}
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
        transition-duration: 0.1s;
        background-color: lightgray;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        display: block;
        padding: 0.7em;
        margin: 5px;
    }

    [type='checkbox']:active + span {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    [type='checkbox']:hover:not(:checked):not(:active) + span {
        background-color: #cfcfcf;
    }

    [type='checkbox']:checked + span {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }
</style>




