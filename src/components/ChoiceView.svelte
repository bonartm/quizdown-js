<script lang="ts">
    import type { BaseQuestion } from '../quiz';
    export let question: BaseQuestion;
</script>

<fieldset>
    {#if question.questionType === 'MultipleChoice'}
        {#each question.answers as answer, i}
            <label>
                <input
                    type="checkbox"
                    bind:group="{question.selected}"
                    value="{i}"
                />
                <span>{@html answer.html}</span>
            </label>
        {/each}
    {:else}
        {#each question.answers as answer, i}
            <label>
                <input
                    type="radio"
                    bind:group="{question.selected[0]}"
                    value="{i}"
                />
                <span>{@html answer.html}</span>
            </label>
        {/each}
    {/if}
</fieldset>

<style>
    fieldset {
        border: 0;
    }

    [type='checkbox'],
    [type='radio'] {
        position: absolute;
        opacity: 0;
    }

    [type='radio'] + span {
        border-radius: 0.5em;
    }

    [type='checkbox'] + span {
        border-radius: 2px;
    }

    [type='checkbox'] + span,
    [type='radio'] + span {
        transition-duration: 0.3s;
        background-color: var(--quizdown-color-secondary);
        color: var(--quizdown-color-text);
        display: block;
        padding: 0.5rem;
        margin: 5px;
        border: 3px solid transparent;
        cursor: pointer;
    }

    [type='checkbox']:hover + span,
    [type='checkbox']:focus + span,
    [type='radio']:hover + span,
    [type='radio']:focus + span {
        filter: brightness(0.9);
    }

    [type='checkbox']:checked + span,
    [type='radio']:checked + span {
        border: 3px solid var(--quizdown-color-primary);
    }
</style>
