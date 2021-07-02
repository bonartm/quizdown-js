<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    export let value: number;
    export let max: number;

    const progress = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });
    $: progress.set(Math.min(max, value) + 0.5);
    $: progressPercent = String(($progress / (max + 0.5)) * 100) + '%';
</script>

<div class="progress" data-label="">
    <div class="progress-slider" style="width:{progressPercent}"></div>
</div>

<style>
    .progress {
        grid-area: auto;

        height: 0.4em;
        width: 100%;
        position: relative;
    }

    .progress .progress-slider {
        background-color: var(--quizdown-color-primary);
        height: 100%;
        display: block;
    }
</style>
