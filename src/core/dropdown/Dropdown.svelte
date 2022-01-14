<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let active: boolean = false
    export let title: string
    export let items: string[]

    const dispatch = createEventDispatcher()

    // const isHandlerOverride = !$$props.hasOwnProperty('active')

    // let show = active
    // let clickTarget: ClickTarget | null = null
    //
    // function dropdownClick() {
    //     if (clickTarget === 'body') return clickTarget = null
    //
    //     clickTarget = 'dropdown'
    //     show = !show
    // }
    //
    // function bodyClick() {
    //     if (clickTarget === 'dropdown') return clickTarget = null
    //
    //     clickTarget = 'body'
    //     show = false
    // }
</script>

<template>
    <!--{#if isHandlerOverride} <svelte:body on:click={bodyClick} /> {/if}-->
    <div class="dropdown-container" class:active={active}>
<!--        <div class="dropdown-title" on:click={dropdownClick}>-->
        <div class="dropdown-title"
            on:click={e => dispatch('click', e)}
            on:mousemove={e => dispatch('mousemove', e)}
        >
            {title}
        </div>

        {#if active}
            <div class="dropdown-list">
                {#each items as item}
                    <div class="item">{item}</div>
                {/each}
            </div>
        {/if}
    </div>

</template>

<style lang="sass">
    .dropdown-container
        position: relative

        &.active
            background-color: rgb(0 220 255 / 76%)

        > .dropdown-title
            position: relative
            cursor: pointer
            height: 100%
            padding-inline: 6px

        > .dropdown-list
            position: absolute
            min-width: 100%

            display: flex
            flex-direction: column
            row-gap: 0.2rem
            background-color: rgba(0, 0, 0, 0.31)
            border: 1px solid rgba(255, 255, 255, 0.18)

            > .item
                cursor: pointer
                padding: 1px 6px
                outline-style: unset

                &:focus
                    background-color: rgb(0 220 255 / 76%)

                &:hover
                    background-color: rgb(0 220 255 / 76%)
</style>