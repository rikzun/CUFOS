<script lang="ts">
    import type { FileEXT } from "src/types/fs"
    import Icon from "../components/Icon.svelte"

    export let icon: string
    export let name: string
    export let ext: FileEXT
</script>

<template>
    <div class="file-container">
        <Icon icon={icon} class="icon" />
        {name}
    </div>
</template>

<style lang="sass">
    .file-container
        display: flex
        flex-direction: column
        align-items: center

        width: 80px
        height: 80px

        background-color: rgb(0 0 0 / 32%)
        border: 1px solid rgb(255 255 255 / 18%)
</style>