<script lang="ts">
    import type { FileEXT } from "src/types/fs"
    import Icon from "../components/Icon.svelte"
    import {MouseEventType} from "../types/mouse";

    export let icon: string
    export let name: string
    export let ext: FileEXT

    let selected = false
    let hovered = false

    const FileService = {
        clickCount: 0,
        onClick: false,

        mouseHandler: (type: MouseEventType, e: MouseEvent) => {
            switch (type) {
                case MouseEventType.HOVER: hovered = true; break
                case MouseEventType.LEAVE: hovered = false; break
                case MouseEventType.DOWN: {
                    FileService.onClick = true
                    break
                }
                case MouseEventType.UP: {
                    if (!FileService.onClick) return
                    FileService.onClick = false
                    FileService.clickCount++

                    if (FileService.clickCount == 2) {
                        FileService.clickCount = 0
                        selected = true
                    }
                    break
                }
            }
        }
    }
</script>

<template>
    <div
        class="file-block"
        class:selected
        class:hovered
        on:mouseenter={(e) => FileService.mouseHandler(MouseEventType.HOVER, e)}
        on:mouseleave={(e) => FileService.mouseHandler(MouseEventType.LEAVE, e)}
        on:mousedown={(e) => FileService.mouseHandler(MouseEventType.DOWN, e)}
        on:mouseup={(e) => FileService.mouseHandler(MouseEventType.UP, e)}
    >
        <div class="icon">
            <Icon icon={icon} size="46px" />
        </div>
        <div class="text">{name}</div>
    </div>
</template>

<style lang="sass">
    .file-block
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