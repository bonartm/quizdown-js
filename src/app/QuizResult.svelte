<script>
    import Icon from 'svelte-awesome';
    import { checkSquare, timesCircle } from 'svelte-awesome/icons';
    export let data;
    let max_idx = data.length;
</script>

{#each data as block, i}
    <div class="question">
        <h4>
            {i + 1}/{max_idx}:
            {data[i]['data']['question']}
            <Icon
                data="{checkSquare}"
                style="float: right;color: green;"
                scale="2" />
            <Icon
                data="{timesCircle}"
                style="float: right;color: red;"
                scale="2" />
        </h4>
    </div>
{/each}

<style>
    .question {
        text-align: left;
        display: block;
        padding: 1em;
        margin: 10px;
        background-color: lightgray;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
    }
</style>
