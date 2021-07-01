<script lang="ts">
    import QuizSection from './components/QuizSection.svelte';
    import Footer from './components/Footer.svelte';
    import type { Quiz } from './quiz';
    import ProgressBar from './components/ProgressBar.svelte';
    import { onMount } from 'svelte';
    import registerLanguages from './languages/i18n';

    export let quiz: Quiz;

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
    <div class="quizdown-card">
        <ProgressBar quiz="{quiz}" />
        <div class="quizdown-container">
            <QuizSection quiz="{quiz}" />
            <Footer quiz="{quiz}" />
        </div>
    </div>
</div>

<style>
    /* I don't know no other way of including the stylesheets */
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

    .quizdown-card {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        border-radius: 0 0 4px 4px;
    }

    .quizdown-container {
        padding: 2px 16px;
    }
</style>
