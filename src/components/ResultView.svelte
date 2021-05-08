<script lang="ts">
    import type { Quiz } from '../quiz';
    export let quiz: Quiz;
    let emojis = ['❌', '✅'];
</script>

<p>
    You have answered <em>{quiz.points} out of {quiz.counter.max}</em> questions
    correctly!
</p>

<ol>
    {#each quiz.questions as question, i}
        <li class="top-list-item" on:click="{() => quiz.jump(i)}">
            <span class="list-question">
                {emojis[+question.solved]}
                Q{i + 1}:{@html question.text}
            </span>
            <ol>
                <!-- answer comments when selected and available -->
                {#each question.selected as selected}
                    {#if question.answers[selected].comment !== ''}
                        <li class="list-comment">
                            <i>{@html question.answers[selected].html}</i>:
                            {@html question.answers[selected].comment}
                        </li>
                    {/if}
                {/each}
            </ol>
        </li>
    {/each}
</ol>

<style>
    .top-list-item {
        margin-bottom: 0.2rem;
        list-style-type: none;
    }

    .top-list-item:hover {
        cursor: pointer;
        background-color: var(--quizdown-color-secondary);
    }

    .top-list-item:hover .list-question {
        text-decoration: underline;
    }

    .list-comment {
        margin-left: 2em;
        list-style-type: initial;
    }
</style>
