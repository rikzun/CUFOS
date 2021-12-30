<script lang="ts">
import Dropdown from "../core/dropdown/Dropdown.svelte";
import DropdownListContainer from "../core/dropdown/DropdownListContainer.svelte";

let items = [
    {title: 'unknown'},
    {title: 'unknown'},
    {title: 'unknown'},
    {title: 'unknown'}
]
</script>

<template>
    <div class="toolbar-app">
        <DropdownListContainer>
            <Dropdown
                title="unknown"
                items={items}
            />
            <Dropdown
                title="unknown"
                items={items}
            />
            <Dropdown
                title="unknown"
                items={items}
            />
        </DropdownListContainer>
    </div>
</template>

<style lang="sass">
    .toolbar-app
        height: 30px
        background-color: rgb(0 0 0 / 31%)
        border-bottom: 1px solid rgb(255 255 255 / 18%)

        display: flex
</style>