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
        min-height:1em;
        margin: 5px;
        background-color: lightgray;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
    }
</style>
    
    
    
    
    