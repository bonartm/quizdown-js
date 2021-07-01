<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import type { Quiz } from '../quiz';

    export let quiz: Quiz;
    $: counter = quiz.counter;
    $: finished = quiz.finished;

    const animatedCurrentBlock = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    $: {
        if ($finished) {
            animatedCurrentBlock.set(quiz.counter.max - 0.5);
        } else {
            animatedCurrentBlock.set($counter + 0.1);
        }
    }

    $: progressPercent =
        String(($animatedCurrentBlock / (quiz.counter.max - 0.5)) * 100) + '%';
</script>

<div class="quizdown-progress" data-label="">
    <div class="progress-slider" style="width:{progressPercent}"></div>
</div>

<style>
    .quizdown-progress {
        height: 0.4em;
        width: 100%;
        position: relative;
    }

    .quizdown-progress .progress-slider {
        background-color: var(--quizdown-color-primary);
        height: 100%;
        display: block;
    }
</style>
