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

    <span class="progress-text">
        {#if !$finished}
            {$counter + 1}/{counter.max}
        {/if}
    </span>
</div>

<style>
    .quizdown-progress {
        height: 1.5em;
        width: 100%;
        background-color: var(--quizdown-color-secondary);
        position: relative;
    }

    .quizdown-progress .progress-slider {
        background-color: var(--quizdown-color-secondary);
        height: 100%;
        display: block;
        box-shadow: 3px 3px var(--quizdown-color-primary),
            2px 2px var(--quizdown-color-primary),
            1px 1px var(--quizdown-color-primary);
        transform: translate(-3px, -3px);
    }

    .quizdown-progress .progress-text {
        white-space: nowrap;
        font-size: 1em;
        font-weight: bolder;
        position: absolute;
        right: 0%;
        top: 25%;
    }
</style>
