<script lang="ts">
import Toolbar from "../../hoc/Toolbar.svelte"
import Desktop from "../../hoc/Desktop.svelte"

</script>

<template>
    <div class="display">
        <Toolbar />
        <Desktop />
    </div>
</template>

<style lang="sass">
    .display
        display: flex
        flex-direction: column
</style>