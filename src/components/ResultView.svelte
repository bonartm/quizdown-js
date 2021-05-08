<script lang="ts">
    import type { Quiz } from '../quiz';
    export let quiz: Quiz;
    let emojis = ['❌', '✅'];
</script>

<p>
    You have answered <em>{quiz.points} out of {quiz.counter.max}</em> questions
    correctly! You can click on a question title to jump back.
</p>

<ul>
    {#each quiz.questions as question, i}
        <li on:click="{() => quiz.jump(i)}">
            {emojis[+question.solved]} - {@html question.text}
        </li>
    {/each}
</ul>

<style>
    li {
        list-style-type: none;
    }
    li:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>
