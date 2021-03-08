<script lang="ts">
import QuizSection from './components/QuizSection.svelte';
import Footer from './components/Footer.svelte';
import type { Quiz } from './quiz';
import ProgressBar from './components/ProgressBar.svelte'

export let quiz: Quiz;


</script>

<div class='quizdown-content'>
	<ProgressBar quiz={quiz}/>
	<QuizSection quiz={quiz}></QuizSection>
	<Footer quiz={quiz}></Footer>
</div>

<style>
   :global(html body .quizdown-content) {
	   	margin:auto;
	    max-width: 600px;
		width:100%;  	 
		display:flex;
		flex-direction: column;
		justify-content: center; 
		--quizdown-color-primary:  #FF851B  ;
		--quizdown-color-secondary: #DDDDDD;
		font-family: 'Lucida Console', 'Courier New', monospace;
		padding:1em;
		margin-top:1em;
		margin-bottom:1em;
	}
</style>