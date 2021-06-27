<script lang="ts">
    import type { Quiz } from '../quiz';
    import VideoView from './VideoView.svelte';

    import SequenceView from './SequenceView.svelte';
    import ChoiceView from './ChoiceView.svelte';
    import ResultView from './ResultView.svelte';
    import { _ } from 'svelte-i18n';

    export let quiz: Quiz;
    $: counter = quiz.counter;
    $: current = quiz.questions[$counter];

    let views = {
        MultipleChoice: ChoiceView,
        SingleChoice: ChoiceView,
        Sequence: SequenceView,
    };
</script>

{#if $counter === counter.max}
    <!-- results -->
    <h3>{$_('results_title')}</h3>
    <ResultView quiz="{quiz}" />
{:else}
    <!-- question title  -->
    <h3>Q{$counter + 1}: {@html current.text}</h3>
    <!-- explanation text -->
    {#if current.explanation !== null && current.explanation !== ''}
        <p>{@html current.explanation}</p>
    {/if}
    <!-- video -->
    {#if quiz.config.video_id !== null}
        <VideoView quiz="{quiz}" />
    {/if}
    <!-- answers -->
    <svelte:component this="{views[current.type]}" quiz="{quiz}" />
{/if}
