<script lang="ts">
    import Icon from "../components/Icon.svelte"

    export let icon: string
    export let name: string

    export let top: number
    export let left: number

    let startTop = top
    let startLeft = left

    let clickTop: number | null = null
    let clickLeft: number | null = null

    function mousedown(e: MouseEvent) {
        clickTop = e.clientY
        clickLeft = e.clientX
    }

    function mouseup() {
        clickTop = null
        clickLeft = null
        startTop = top
        startLeft = left
    }

    function mousemove(e: MouseEvent) {
        if (clickTop == null || clickLeft == null) return

        top = startTop + e.clientY - clickTop
        left = startLeft + e.clientX - clickLeft
    }
</script>

<template>
    <svelte:window
        on:mousemove={mousemove}
        on:mouseup={mouseup}
    />

    <div class="file-block"
        on:mousedown={mousedown}
        style="top: {top}px; left: {left}px"
    >
        <div class="icon">
            <Icon icon={icon} size="46px" />
        </div>
        <div class="text">{name}</div>
    </div>
</template>

<style lang="sass">
    .file-block
        position: absolute
        display: flex
        flex-direction: column
        align-items: center

        width: 80px
        height: 80px

        color: white
        padding: 4px
        font-size: 14px

        background-color: rgb(0 0 0 / 32%)
        border: 1px solid rgb(255 255 255 / 18%)

        > .icon
            display: flex
            align-items: center
            justify-content: center

            width: 100%
            height: 100%

        > .text
            overflow: hidden
            white-space: pre
            text-overflow: ellipsis

            width: 100%
            height: 40%
</style>