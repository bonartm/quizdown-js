<script lang="ts">
    import { afterUpdate } from 'svelte';
 
    let child: HTMLElement;
    let parent: HTMLElement;

    // dynamically adjust the fontsize to fit the maximum of 2em
    afterUpdate(() => {
            let size = 2;
            let w = parent.offsetWidth;
            let h = parent.offsetHeight;
            let texth;
            let textw;
            do {
                child.style.fontSize = size.toString()+'em';
                texth = child.offsetHeight;
                textw = child.offsetWidth;
                size -= 0.01;
            } while ((texth > h-10 || textw > w-10));           
    }); 

</script>

<div bind:this={parent} class="quizdown-headline">
    <span bind:this={child}>
        <slot></slot>
    </span>
</div>

<style>
    .quizdown-headline {
        background-color: var(--quizdown-color-primary);
        transform: skew(4deg, 0deg);
        width: 80%;
        height: 2em;
        margin: auto;
        margin-top: 1em;
        margin-bottom: 1em;
        padding:0.8em;
        font-weight: bold;  
        color: var(--quizdown-color-title);
        text-align: center;
        size:2em;
    }

</style>