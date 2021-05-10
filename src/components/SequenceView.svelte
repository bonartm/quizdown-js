<script lang="ts">
    import DragDropList from './DragDropList.svelte';
    import type { Quiz } from '../quiz';
    export let quiz: Quiz;
    $: counter = quiz.counter;
    $: current = quiz.questions[$counter];

    $: {
        current.selected = current.answers.map((answer) => answer.id);
    }
</script>

<DragDropList bind:data="{current.answers}" />
