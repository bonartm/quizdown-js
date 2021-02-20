import { writable, get, Writable } from 'svelte/store';
import autoBind from 'auto-bind';
import type { SvelteComponent } from 'svelte';


export abstract class BaseQuestion {
	readonly text: string
	readonly answers: Array<Answer>
	readonly explanation: string
	selected: Array<number>
	solved: boolean
	readonly hint: string

	static is_equal(a1:Array<number>, a2:Array<number>): boolean{
		return JSON.stringify(a1) === JSON.stringify(a2)
	}

	static shuffle(array:Array<any>): Array<any> {
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		let currentIndex = array.length, temporaryValue, randomIndex;
	  
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {	  
		  // Pick a remaining element...
		  randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex -= 1;	  
		  // And swap it with the current element.
		  temporaryValue = array[currentIndex];
		  array[currentIndex] = array[randomIndex];
		  array[randomIndex] = temporaryValue;
		}	  
		return array;
	}

	constructor(text:string, explanation:string, hint:string, answers:Array<Answer>){
		this.text=text
		this.explanation=explanation
		this.hint=hint
		this.solved=false
		this.answers=BaseQuestion.shuffle(answers)
		this.selected=[]
		autoBind(this);
	}

	reset() {
		this.selected = []
		this.solved = false
		BaseQuestion.shuffle(this.answers)
	}

	abstract check(): void;
}

class Blanks extends BaseQuestion {
	check() {
		this.solved = false
	}
}

class Pairs extends BaseQuestion {
	check(){
		this.solved = false
	}
}


export class Sequence extends BaseQuestion {

	constructor(text:string, explanation:string, hint:string, answers:Array<Answer>){
		super(text, explanation, hint, answers)
	}

	check(){
		// extract answer ids from answers
		let true_answer_ids = this.answers.map((answer)=>answer.id)
		this.solved = BaseQuestion.is_equal(true_answer_ids.sort(), this.selected)

	}

}

export class MultipleChoice extends BaseQuestion {

	constructor(text:string, explanation:string, hint:string, answers:Array<Answer>){
		super(text, explanation, hint, answers)
	}

	check(){
		let true_answer_ids = this.answers.map((answer, i) => i).filter(i => this.answers[i].correct);
		this.solved = BaseQuestion.is_equal(true_answer_ids.sort(), this.selected.sort())
	}
}

export class Answer {
	html:string
	correct:boolean
	id: number

	constructor(id:number, html:string, correct:boolean){
		this.html = html
		this.correct = correct
		this.id = id
		autoBind(this);
	}
}

class Counter {
	val: Writable<number>
	max: number
	subscribe

	constructor(max:number){
		this.val = writable(0)
		this.max = max
		this.subscribe = this.val.subscribe
		autoBind(this)
	}

	jump(i: number){
		this.val.set(i)
	}

	next(){
		this.val.update(val => (val < this.max-1) ? val+1 : val)
	}

	previous(){
		this.val.update(val => val > 0 ? val-1 : val);
	}

	reset(){		
		// trigger a change
		if (get(this.val) == 0) this.val.set(1)
		this.val.set(0)
	}
}

export class Quiz {
	questions: Array<BaseQuestion>
	counter: Counter
	finished: Writable<boolean>
	points: number

	constructor(questions){
		this.questions = questions;	
		this.counter = new Counter(this.questions.length)	
		this.finished = writable(false)	
		this.points = 0
		autoBind(this);
	}

	current(): BaseQuestion {
		let n:number = get(this.counter)
		return this.questions[n]
	}

	next(){
		this.counter.next()
	}

	previous(){
		this.counter.previous()
	}

	reset(){
		this.counter.reset()
		this.questions.forEach(q => q.reset())
		this.finished.set(false)
	}

	calc_points(){
		this.finished.set(true)
		var points = 0
		for (var q of this.questions){
			q.check()
			if (q.solved) points++
		}
		this.points = points
	}	
}

