<script lang="ts">
    let show = false

    let screenY: number | null = null
    let screenX: number | null = null

    let clientY: number | null = null
    let clientX: number | null = null

    function wheelClick(e: MouseEvent) {
        if (e.button !== 1) return
        show = !show

        clientY = e.clientY
        clientX = e.clientX
    }

    function mousemove(e: MouseEvent) {
        if (!show) return
        screenY = e.screenY
        screenX = e.screenX

        clientY = e.clientY
        clientX = e.clientX
    }

    function mouseleave() {
        clientY = null
        clientX = null
    }
</script>

<template>
    <svelte:body
        on:mouseup={wheelClick}
        on:mousemove={mousemove}
        on:mouseleave={mouseleave}
    />

    {#if show && clientY != null && clientX != null}
        <div class="div-thing" style={`top: ${clientY + 10}px; left: ${clientX + 10}px`}>
            screenY: {screenY}px
            screenX: {screenX}px

            clientY: {clientY}px
            clientX: {clientX}px
        </div>
    {/if}
</template>

<style lang="sass">
    .div-thing
        position: absolute
        width: fit-content

        white-space: pre-line
        background-color: white
        user-select: none

        z-index: 9999
        font-size: 12px
</style>