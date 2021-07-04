<script lang="ts">
    import type { Quiz } from './quiz';
    import ProgressBar from './components/ProgressBar.svelte';
    import { onMount } from 'svelte';
    import registerLanguages from './languages/i18n';
    import Card from './components/Card.svelte';
    import Credits from './components/Credits.svelte';
    import Container from './components/Container.svelte';
    import QuestionView from './components/QuestionView.svelte';
    import Buttons from './components/Buttons.svelte';
    import Button from './components/Button.svelte';
    import { _ } from 'svelte-i18n';
    import ResultsView from './components/ResultsView.svelte';

    export let quiz: Quiz;
    // https://github.com/sveltejs/svelte/issues/4079
    $: question = quiz.active;
    $: index = quiz.index;
    $: onLast = quiz.onLast;
    $: onResults = quiz.onResults;
    $: showHint = $question.showHint;
    $: allVisited = quiz.allVisited;

    registerLanguages(quiz.config.locale);

    let node: HTMLElement;

    // set global options
    onMount(async () => {
        let primaryColor: string = quiz.config.primaryColor;
        let secondaryColor: string = quiz.config.secondaryColor;
        let textColor: string = quiz.config.textColor;

        node.style.setProperty('--quizdown-color-primary', primaryColor);
        node.style.setProperty('--quizdown-color-secondary', secondaryColor);
        node.style.setProperty('--quizdown-color-text', textColor);
    });
</script>

<div class="quizdown-content" bind:this="{node}">
    <Card>
        <ProgressBar value="{$index}" max="{quiz.questions.length}" />
        <Container>
            {#if $onResults}
                <ResultsView quiz="{quiz}" />
            {:else}
                <QuestionView question="{$question}" n="{$index + 1}" />
                <Buttons>
                    <Button
                        disabled="{!$question.hint || $showHint}"
                        buttonAction="{$question.toggleHint}"
                        >{$_('hint')}</Button
                    >
                    {#if $onLast || $allVisited}
                        <Button
                            buttonAction="{() =>
                                quiz.jump(quiz.questions.length)}"
                        >
                            {$_('evaluate')}
                        </Button>
                    {:else}
                        <Button buttonAction="{quiz.next}">
                            {$_('next')}
                        </Button>
                    {/if}
                </Buttons>
            {/if}
            <Credits />
        </Container>
    </Card>
</div>

<style>
    /* Is there another way of including the stylesheets? */
    @import 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.6.0/build/styles/github.min.css';
    @import 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.css';

    :global(img) {
        max-height: 400px;
        border-radius: 4px;
        max-width: 100%;
        height: auto;
    }

    :global(code) {
        padding: 0 0.4rem;
        font-size: 85%;
        color: #333;
        white-space: pre-wrap;
        border-radius: 4px;
        padding: 0.2em 0.4em;
        background-color: #f8f8f8;
        font-family: Consolas, Monaco, monospace;
    }

    :global(a) {
        color: var(--quizdown-color-primary);
    }

    .quizdown-content {
        padding: 1rem;
        max-width: 900px;
        margin: auto;
    }
</style>
