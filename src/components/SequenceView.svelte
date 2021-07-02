<script lang="ts">
    import DragDropList from './DragDropList.svelte';
    import type { BaseQuestion } from '../quiz';
    export let question: BaseQuestion;

    $: {
        question.selected = question.answers.map((answer) => answer.id);
    }
</script>

<DragDropList bind:data="{question.answers}" />
