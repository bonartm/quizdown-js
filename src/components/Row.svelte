<div class="row">
    <div class="left">
        <slot name="left" />
    </div>
    <div class="center">
        <slot class="center" name="center" />
    </div>
    <div class="right">
        <slot name="right" />
    </div>
</div>

<style>
    .row {
        padding-top: 2em;
        display: flex;
    }

    .left {
        flex: 1;
        display: flex;
        justify-content: flex-start;
    }

    .center {
        display: flex;
        justify-content: center;
    }

    .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
    }
</style>
