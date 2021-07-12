<script lang="ts">
    import type { QuizType, BaseQuestion } from '../quiz';
    import type { SvelteComponent } from 'svelte';

    import Button from './Button.svelte';
    import Icon from './Icon.svelte';

    import SequenceView from './SequenceView.svelte';
    import ChoiceView from './ChoiceView.svelte';
    import { _ } from 'svelte-i18n';

    export let question: BaseQuestion;

    export let n: number;
    $: showHint = question.showHint;

    // a mapping from quiz types to svelte components
    let componentMap: Record<QuizType, typeof SvelteComponent> = {
        Sequence: SequenceView,
        MultipleChoice: ChoiceView,
        SingleChoice: ChoiceView,
    };
</script>

<h3>
    Q{n}: {@html question.text}
</h3>

{#if question.explanation}
    <p>{@html question.explanation}</p>
{/if}

<svelte:component
    this="{componentMap[question.quizType]}"
    question="{question}"
/>
