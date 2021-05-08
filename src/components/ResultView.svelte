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
		<li on:click={()=>quiz.jump(i)}>{emojis[+question.solved]} {@html question.text}
			<ol>
				{#if question.selected instanceof Array}
					{#each question.selected as selected, k}
						{#if question.answers[selected].comment}
							<li class="list-comment"><b>{@html question.answers[selected].html}</b><br />{@html question.answers[selected].comment}</li>
						{/if}
					{/each}
				{:else if (question.selected != null) && (question.answers[question.selected].comment)}
					<li class="list-comment"><b>{@html question.answers[question.selected].html}</b><br />{@html question.answers[question.selected].comment}</li>
				{/if}
			</ol>
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

	.list-comment {
		margin-left: 2em;
	}
</style>
