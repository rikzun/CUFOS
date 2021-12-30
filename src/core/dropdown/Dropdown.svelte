<script lang="ts">
    import { DropdownItem, ClickTarget } from "./dropdown-types.ts";

    export let title: string
    export let items: DropdownItem[]

    let show = false
    let clickTarget: ClickTarget | null = null

    function dropdownClick() {
        if (clickTarget === 'body') return clickTarget = null

        clickTarget = 'dropdown'
        show = !show
    }

    function bodyClick() {
        if (clickTarget === 'dropdown') return clickTarget = null

        clickTarget === 'body'
        show = false
    }
</script>

<template>
    <svelte:body on:click={bodyClick} />

    <div class="dropdown-container" class:active={show}>
        <button class="dropdown-title" on:click={dropdownClick}>
            {title}
        </button>

        {#if show}
            <div class="dropdown-list">
                {#each items as {title, icon}}
                    <button class="item">{title}</button>
                {/each}
            </div>
        {/if}
    </div>

</template>

<style lang="sass">
    %button-unset
        font-family: auto
        font-size: initial
        border: unset
        background-color: unset
        padding: 0

    .dropdown-container
        &.active
            background-color: rgb(0 220 255 / 76%)

        > .dropdown-title
            @extend %button-unset

            position: relative
            cursor: pointer
            height: 100%
            padding-inline: 6px

        > .dropdown-list
            position: absolute

            display: flex
            flex-direction: column
            row-gap: 0.2rem
            background-color: rgba(0, 0, 0, 0.31)
            border: 1px solid rgba(255, 255, 255, 0.18)

            > .item
                @extend %button-unset

                cursor: pointer
                padding: 1px 6px
                outline-style: unset

                &:focus
                    background-color: rgb(0 220 255 / 76%)

                &:hover
                    background-color: rgb(0 220 255 / 76%)
</style>