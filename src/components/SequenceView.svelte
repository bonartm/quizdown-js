<script lang="ts">
import { current_component, get_current_component } from "svelte/internal";
import DragDropList from "svelte-dragdroplist";
import type { Quiz } from "../quiz";
export let quiz: Quiz;
$: counter = quiz.counter
$: current = quiz.questions[$counter]

$: {
    current.selected = current.answers.map(answer => answer.id)
}

</script>

<DragDropList bind:data={current.answers}/>    
    
<style>
    :global(.dragdroplist > .list > div.item) {
        min-height: 2rem;
        height: 2.5rem;
        margin: 5px;
        padding:0;
        width: unset;
        background-color: var(--quizdown-color-secondary);
        box-shadow: 3px 3px var(--quizdown-color-primary), 2px 2px var(--quizdown-color-primary), 1px 1px var(--quizdown-color-primary);
    }

    :global(.dragdroplist div.content) {
        padding:0;
        margin: auto auto auto 0 !important;
    }

</style>
    
    
    
    
    