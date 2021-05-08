<script lang="ts">
    import type { Quiz } from '../quiz';

    import SequenceView from './SequenceView.svelte';
    import ChoiceView from './ChoiceView.svelte';
    import ResultView from './ResultView.svelte';
    import { current_component } from 'svelte/internal';

    export let quiz: Quiz;
    $: counter = quiz.counter;
    $: current = quiz.questions[$counter];

    const views = {
        MultipleChoice: ChoiceView,
        SingleChoice: ChoiceView,
        Sequence: SequenceView,
    };
</script>

{#if $counter === counter.max}
    <!-- Results -->
    <h3>Your quiz results</h3>
    <ResultView quiz="{quiz}" />
{:else}
    <!-- Question  -->
    <!-- title -->
    <h3>Q{$counter + 1}: {@html current.text}</h3>
    <!-- explanation text -->
    {#if current.explanation !== null && current.explanation !== ''}
        <p>{@html current.explanation}</p>
    {/if}
    <svelte:component this="{views[current.type]}" quiz="{quiz}" />
{/if}
