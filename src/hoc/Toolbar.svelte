<script lang="ts">
import DropdownListContainer from "../core/dropdown/DropdownListContainer.svelte";

</script>

<template>
    <div class="toolbar-app">
        <DropdownListContainer
            values={[
                {title: 'unknown', items: ['1', '2', '3', '4']},
                {title: 'unknown', items: ['1', '2', '3', '4']},
                {title: 'unknown', items: ['1', '2', '3', '4']}
            ]}
        />
    </div>
</template>

<style lang="sass">
    .toolbar-app
        height: 30px
        background-color: rgb(0 0 0 / 31%)
        border-bottom: 1px solid rgb(255 255 255 / 18%)

        display: flex
</style>