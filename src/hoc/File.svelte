<script lang="ts">
    import Icon from "../components/Icon.svelte"

    export let icon: string
    export let name: string

    export let top: number
    export let left: number

    let startTop: number | null = null
    let startLeft: number | null = null

    function mousedown(e: MouseEvent) {
        startTop = e.clientY
        startLeft = e.clientX
    }

    function mouseup() {
        startTop = null
        startLeft = null
    }

    function mousemove(e: MouseEvent) {
        if (startTop == null || startLeft == null) return
        top = e.clientY - startTop
        left = e.clientX - startLeft
    }
</script>

<template>
    <svelte:window
        on:mousemove={mousemove}
        on:mouseup={mouseup}
    />

    <div class="file-block"
        on:mousedown={mousedown}
        style={`top: ${top}px; left: ${left}px`}
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