<script lang="ts">
	import Headline from '../slots/Headline.svelte'

	import type { BaseQuestion, Quiz } from "../quiz";
	export let quiz:Quiz;
	$: counter = quiz.counter

	let emojis = ["☹️", "😀"]

	function jump(i:number){
		quiz.finished.set(false)
		counter.jump(i)
	}

</script>

<Headline>
    <h3>Quiz Results</h3>
</Headline>


You have answered {quiz.points} out of {quiz.counter.max} questions correctly!

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

