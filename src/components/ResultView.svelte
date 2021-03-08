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
		<li on:click={()=>jump(i)}>{emojis[+question.solved]} - {@html question.text}</li>
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

