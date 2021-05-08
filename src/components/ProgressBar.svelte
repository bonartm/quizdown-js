<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import type { Quiz } from '../quiz';

    export let quiz: Quiz;
    $: counter = quiz.counter;
    $: finished = quiz.finished;

    const animated_current_block = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    $: {
        if ($finished) {
            animated_current_block.set(quiz.counter.max - 0.5);
        } else {
            animated_current_block.set($counter + 0.1);
        }
    }

    $: progress_percent =
        String(($animated_current_block / (quiz.counter.max - 0.5)) * 100) +
        '%';
</script>

<div class="quizdown-progress" data-label="">
    <div class="progress-slider" style="width:{progress_percent}"></div>
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
