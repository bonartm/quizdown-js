<script lang="ts">
    import QuizSection from './components/QuizSection.svelte';
    import Footer from './components/Footer.svelte';
    import type { Quiz } from './quiz';
    import ProgressBar from './components/ProgressBar.svelte';
    import { onMount } from 'svelte';

    export let quiz: Quiz;

    let node: HTMLElement;

    // set global options
    onMount(async () => {
        let primary_color: string = quiz.config['primary_color'];
        let secondary_color: string = quiz.config['secondary_color'];
        let text_color: string = quiz.config['text_color'];

        node.style.setProperty('--quizdown-color-primary', primary_color);
        node.style.setProperty('--quizdown-color-secondary', secondary_color);
        node.style.setProperty('--quizdown-color-text', text_color);
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
    @import 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.6.0/build/styles/github.min.css';

    :global(code, kbd) {
        padding: 0 0.4rem;
        font-size: 90%;
        white-space: pre-wrap;
        border-radius: 4px;
        padding: 0.2em 0.4em;
        background-color: rgb(248, 255, 206);
        font-family: monaco, 'Consolas', 'Lucida Console', monospace;
    }

    :global(pre) {
        background-color: rgb(248, 255, 206);
        font-size: 1em;
        padding: 0.4rem;
        overflow-x: auto;
        font-family: monaco, 'Consolas', 'Lucida Console', monospace;
    }

    :global(pre code) {
        background: none;
        padding: 0;
    }

    :global(a) {
        color: var(--quizdown-color-primary);
    }

    .quizdown-content {
        line-height: 1.2;
        font-size: 1.1em;
        font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
        padding: 1rem;
        max-width: 700px;
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
