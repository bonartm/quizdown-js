<script lang="ts">
    import type { Quiz } from './quiz';
    import ProgressBar from './components/ProgressBar.svelte';
    import { onMount } from 'svelte';
    import registerLanguages from './languages/i18n';
    import Card from './components/Card.svelte';
    import Credits from './components/Credits.svelte';
    import SmoothContainer from './components/SmoothContainer.svelte';
    import QuestionView from './components/QuestionView.svelte';
    import Buttons from './components/Buttons.svelte';
    import Button from './components/Button.svelte';
    import { _ } from 'svelte-i18n';
    import ResultsView from './components/ResultsView.svelte';
    import { Linear, CheckFirst } from './progressModes.js';
    import Animated from './components/Animated.svelte';
    import registerIcons from './registerIcons.js';
    import Icon from './components/Icon.svelte';
    import { flip } from 'svelte/animate';

    export let quiz: Quiz;
    // https://github.com/sveltejs/svelte/issues/4079
    $: question = quiz.active;
    $: index = quiz.index;
    $: onLast = quiz.onLast;
    $: onFirst = quiz.onFirst;
    $: onResults = quiz.onResults;
    $: showHint = $question.showHint;
    $: isEvaluated = quiz.isEvaluated;
    $: allVisited = quiz.allVisited;

    let game = new Linear(quiz);

    registerLanguages(quiz.config.locale);
    registerIcons();

    let node: HTMLElement;
    import { fly } from 'svelte/transition';

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
        <ProgressBar value="{$index}" max="{quiz.questions.length - 1}" />

        <Buttons>
            <Button title="{$_('reset')}" buttonAction="{quiz.reset}"
                ><Icon name="redo" /></Button
            >
            <Button
                title="{$_('previous')}"
                disabled="{$onFirst ||
                    !game.hasPrevious ||
                    $onResults ||
                    $isEvaluated}"
                buttonAction="{game.previous}"
                ><Icon name="arrow-left" /></Button
            >
            <Button
                disabled="{$onLast || $onResults || $isEvaluated}"
                buttonAction="{game.next}"
                title="{$_('next')}"><Icon name="arrow-right" /></Button
            >
            {#if $question.hint && !$showHint && !$onResults}
                <div transition:fly="{{ x: 200, duration: 500 }}">
                    <Button
                        title="{$_('hint')}"
                        disabled="{!$question.hint || $showHint || $onResults}"
                        buttonAction="{$question.enableHint}"
                        ><Icon name="lightbulb" /></Button
                    >
                </div>
            {/if}
            {#if $onLast || $allVisited}
                <div transition:fly="{{ x: 200, duration: 500 }}">
                    <Button
                        disabled="{!($onLast || $allVisited)}"
                        title="{$_('evaluate')}"
                        buttonAction="{() => game.jump(quiz.questions.length)}"
                        ><Icon name="check-double" /></Button
                    >
                </div>
            {/if}
        </Buttons>

        <SmoothContainer>
            <Animated update="{$index}">
                {#if $onResults}
                    <ResultsView quiz="{quiz}" />
                {:else}
                    <QuestionView question="{$question}" n="{$index + 1}" />
                {/if}
                <Credits />
            </Animated>
        </SmoothContainer>
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
