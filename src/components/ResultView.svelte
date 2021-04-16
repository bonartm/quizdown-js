<script lang="ts">
	import type { Quiz } from "../quiz";
	export let quiz: Quiz;
	$: counter = quiz.counter

	let emojis = ["❌", "✅"]

	function jump(i:number){
		quiz.finished.set(false)
		counter.jump(i)
	}
</script>

<p>
	You have answered <b>{quiz.points} out of {quiz.counter.max}</b> questions correctly!
	You can click on a question title to jump back.

</p>

<ul>
	{#each quiz.questions as question, i}
		<li on:click={()=>jump(i)}>{emojis[+question.solved]} {@html question.text}
			<ol>
				{#if question.selected instanceof Array}
					{#each question.selected as selected, k}
						{#if question.answers[selected].comment}
							<li class="list-comment"><b>{@html question.answers[selected].html}</b>: {@html question.answers[selected].comment}</li>
						{/if}
					{/each}
				{:else if (question.selected) && (question.answers[question.selected].comment)}
					<li class="list-comment"><b>{@html question.answers[question.selected].html}</b>: {@html question.answers[question.selected].comment}</li>
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

