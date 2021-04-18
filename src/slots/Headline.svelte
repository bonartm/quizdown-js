<script lang="ts">
    import { afterUpdate } from 'svelte';

    let child: HTMLElement;
    let parent: HTMLElement;

    // dynamically adjust the fontsize to fit the maximum height
    afterUpdate(() => {
        let size = 2;
        let h = parent.offsetHeight;
        let texth;
        let ops_left = 1000;
        do {
            child.style.fontSize = size.toString() + 'em';
            texth = child.offsetHeight;
            size -= 0.01;
            ops_left -= 1;
        } while (texth > h - 10 && ops_left > 0);
    });
</script>

<div bind:this="{parent}" class="quizdown-headline">
    <span bind:this="{child}" class="quizdown-headline-content">
        <slot />
    </span>
</div>

<style>
    .quizdown-headline {
        background-color: var(--quizdown-color-primary);
        transform: skew(4deg, 0deg);
        width: 80%;
        height: 3rem;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-weight: bold;
        padding-left: 10px;
        padding-right: 10px;
        color: var(--quizdown-color-title);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
