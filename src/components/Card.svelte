<div class="card">
    <slot />
</div>

<style>
    .card {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        border-radius: 0 0 4px 4px;
        margin-top: 1rem;
    }

    .card:first-child {
        margin-top: 0;
    }
</style>
