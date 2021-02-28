<script lang="ts">
    import type { Quiz } from '../quiz';
    import SequenceView from './SequenceView.svelte';
    import MultipleChoiceView from './MultipleChoiceView.svelte'
    import BlanksView from './BlanksView.svelte'
    import PairsView from './PairsView.svelte'
    import Headline from '../slots/Headline.svelte'
    import Button from './Button.svelte'
    
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
    <h2>{@html current.text}</h2>
</Headline>

<p>
    {@html current.explanation}


</p>

<svelte:component this={views[current.type]} quiz={quiz}/>

