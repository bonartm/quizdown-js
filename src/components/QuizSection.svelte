<script lang="ts">
    import type { Quiz } from '../quiz';
    import SequenceView from './SequenceView.svelte';
    import MultipleChoiceView from './MultipleChoiceView.svelte'
    import BlanksView from './BlanksView.svelte'
    import PairsView from './PairsView.svelte'
    import Headline from '../slots/Headline.svelte'
    
    export let quiz: Quiz;
    $: counter = quiz.counter
    $: current = quiz.questions[$counter]
    
    const views = {
        'MultipleChoice': MultipleChoiceView,
        'Sequence': SequenceView,
        'Gaps': BlanksView,
        'Pairs': PairsView
    }

    
</script>

<Headline>
    <h3>{@html current.text}</h3>
</Headline>

<p>
    {@html current.explanation}
</p>

<svelte:component this={views[current.type]} quiz={quiz}/>


