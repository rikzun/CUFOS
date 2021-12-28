<script lang="ts">
import Toolbar from "../../hoc/Toolbar.svelte"
import Desktop from "../../hoc/Desktop.svelte"
import DevThing from "../../components/DevThing.svelte";

</script>

<template>
    <div class="display">
        <Toolbar />
        <Desktop />
        <DevThing />
    </div>
</template>

<style lang="sass">
    .display
        display: flex
        flex-direction: column

        height: 100%
</style>