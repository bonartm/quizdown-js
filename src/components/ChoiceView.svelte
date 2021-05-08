<script lang="ts">
    import type { Quiz } from '../quiz';
    export let quiz: Quiz;

    $: counter = quiz.counter;
    $: current = quiz.questions[$counter];
</script>

{#if current.type === 'MultipleChoice'}
    {#each current.answers as answer, i}
        <label>
            <input
                type="checkbox"
                bind:group="{current.selected}"
                value="{i}"
            />
            <span>{@html answer.html}</span>
        </label>
    {/each}
{:else}
    {#each current.answers as answer, i}
        <label>
            <input
                type="radio"
                bind:group="{current.selected[0]}"
                value="{i}"
            />
            <span>{@html answer.html}</span>
        </label>
    {/each}
{/if}

<style>
    [type='checkbox'],
    [type='radio'] {
        display: none;
    }

    [type='radio'] + span {
        border-radius: 0.4em;
    }

    [type='checkbox'] + span,
    [type='radio'] + span {
        transition-duration: 0.3s;
        background-color: var(--quizdown-color-secondary);
        display: block;
        padding: 0.5rem;
        margin: 5px;
        border: 3px solid transparent;
    }

    [type='checkbox']:hover + span,
    [type='radio']:hover + span {
        filter: brightness(0.9);
    }

    [type='checkbox']:checked + span,
    [type='radio']:checked + span {
        border: 3px solid var(--quizdown-color-primary);
    }
</style>
