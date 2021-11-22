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
</style>