<style>
	p {
		color: purple;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}
</style>

<script>
	import MultipleChoice from './MultipleChoice.svelte';
	import uuidv4 from 'uuid';

	// this.parent_node.dataset.uuid = this.id
	let id = uuidv4();
	let current_block = 0
	export let quiz_data;
</script>

<h2> Quiz with id: {id}</h2>

<h3>{quiz_data[current_block]['data']["question"]}</h3>

{#each quiz_data[current_block]['data']["answers"] as answer, i}
<p> {answer['text']} </p>
{/each}




