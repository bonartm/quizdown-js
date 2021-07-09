<script lang="ts">
    import type { Quiz } from './quiz';
    import ProgressBar from './components/ProgressBar.svelte';
    import { onMount } from 'svelte';
    import registerLanguages from './languages/i18n';
    import Card from './components/Card.svelte';
    import Credits from './components/Credits.svelte';
    import SmoothResize from './components/SmoothResize.svelte';
    import QuestionView from './components/QuestionView.svelte';
    import Buttons from './components/Buttons.svelte';
    import Button from './components/Button.svelte';
    import { _ } from 'svelte-i18n';
    import ResultsView from './components/ResultsView.svelte';
    // import { Linear, CheckFirst } from './progressModes.js';
    import Animated from './components/Animated.svelte';
    import registerIcons from './registerIcons.js';
    import Icon from './components/Icon.svelte';
    import { flip } from 'svelte/animate';
    import { fly } from 'svelte/transition';
    import Container from './components/Container.svelte';
    // import Modal from './components/Modal.svelte';

    export let quiz: Quiz;
    // https://github.com/sveltejs/svelte/issues/4079
    $: question = quiz.active;
    $: index = quiz.index;
    $: onLast = quiz.onLast;
    $: onFirst = quiz.onFirst;
    $: onResults = quiz.onResults;
    $: isEvaluated = quiz.isEvaluated;
    $: allVisited = quiz.allVisited;

    //let game = new Linear(quiz);

    registerLanguages(quiz.config.locale);
    registerIcons();

    let node: HTMLElement;
    // let showModal = false;

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

        <Container>
            <SmoothResize>
                <Animated update="{$index}">
                    {#if $onResults}
                        <ResultsView quiz="{quiz}" />
                    {:else}
                        <QuestionView question="{$question}" n="{$index + 1}" />
                    {/if}
                </Animated>
            </SmoothResize>

            <!-- <Modal show="{showModal}">Are you sure?</Modal> -->

            <Buttons>
                <Button
                    title="{$_('previous')}"
                    disabled="{$onFirst || $onResults || $isEvaluated}"
                    buttonAction="{quiz.previous}"
                    ><Icon name="arrow-left" size="lg" /></Button
                >
                <Button title="{$_('reset')}" buttonAction="{quiz.reset}"
                    ><Icon name="redo" size="sm" /></Button
                >
                <Button
                    disabled="{$onLast || $onResults || $isEvaluated}"
                    buttonAction="{quiz.next}"
                    title="{$_('next')}"
                    ><Icon name="arrow-right" size="lg" /></Button
                >

                {#if $onLast || $allVisited}
                    <div in:fly="{{ x: 200, duration: 500 }}">
                        <Button
                            disabled="{!($onLast || $allVisited) || $onResults}"
                            title="{$_('evaluate')}"
                            buttonAction="{() =>
                                quiz.jump(quiz.questions.length)}"
                            ><Icon name="check-double" size="lg" /></Button
                        >
                    </div>
                {/if}
            </Buttons>

            <Credits />
        </Container>
    </Card>
</div>

<style type="text/scss" global>
    @import 'highlight.js/styles/github';
    @import 'katex/dist/katex';
    @import '@fortawesome/fontawesome-svg-core/styles';

    img {
        max-height: 400px;
        border-radius: 4px;
        max-width: 100%;
        height: auto;
    }

    code {
        padding: 0 0.4rem;
        font-size: 85%;
        color: #333;
        white-space: pre-wrap;
        border-radius: 4px;
        padding: 0.2em 0.4em;
        background-color: #f8f8f8;
        font-family: Consolas, Monaco, monospace;
    }

    a {
        color: var(--quizdown-color-primary);
    }

    .quizdown-content {
        padding: 1rem;
        max-width: 900px;
        margin: auto;
    }
</style>
