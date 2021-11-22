<script lang="ts">
    import { css } from "../utils/functions";

    export let icon: string
</script>

<template>
    <span class="material-icons{css($$props.class)}">
        {icon}
    </span>
</template>

<style lang="sass" global>
    .material-icons
        user-select: none
</style>