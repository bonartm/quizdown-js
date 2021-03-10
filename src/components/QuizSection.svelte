<script lang="ts">
    import type { Quiz } from '../quiz';

    import SequenceView from './SequenceView.svelte';
    import ChoiceView from './ChoiceView.svelte'
    import BlanksView from './BlanksView.svelte'
    import PairsView from './PairsView.svelte'
    import Headline from '../slots/Headline.svelte'
    import ResultView from './ResultView.svelte'
    import Gallery from '../slots/Gallery.svelte'

    export let quiz: Quiz;
    $: counter = quiz.counter
    $: current = quiz.questions[$counter]
    $: finished = quiz.finished

    const views = {
        'MultipleChoice': ChoiceView,
        'SingleChoice': ChoiceView,
        'Sequence': SequenceView,
        'Gaps': BlanksView,
        'Pairs': PairsView
    }
  
</script>

<!-- <Gallery key={$counter}> -->
    {#if $finished}
        <!-- Results -->
        <Headline>Your quiz results</Headline>
        <ResultView quiz={quiz}/>    
    {:else}
        <!-- Question  -->
        <Headline>{@html current.text}</Headline>
        {#if current.explanation !== null && current.explanation !== ''}
            <p class='quizdown-explanation'>{@html current.explanation}</p>
        {/if}
        <svelte:component this={views[current.type]} quiz={quiz}/>    
    {/if}
<!-- </Gallery>   -->



