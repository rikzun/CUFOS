<script lang="ts">
    import Dropdown from "./Dropdown.svelte";
    import {DropdownService} from "./dropdownService";
    export let values: {title: string, items: string[]}[]

    DropdownService.init(values.length - 1)

    // let activeIndex: number | null = null
    // let maxIndex = values.length - 1
    //
    // let action: 'open' | 'close' | null = null
    // function openHandler(index: number, isClick: boolean = false) {
    //     if (isClick && activeIndex === index) return activeIndex = null
    //     if (activeIndex == index) return
    //     if (activeIndex == null && !isClick) return
    //
    //     if (isClick) changeIndex('open', 'close', index)
    //     else activeIndex = index
    // }
    //
    // function changeIndex(type, wrongType, value) {
    //     if (action === wrongType) return action = null
    //
    //     action = type
    //     activeIndex = value
    // }
    //
    // function keyHandler(e: KeyboardEvent) {
    //     if (activeIndex == null) return
    //     if (maxIndex == 0 || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
    //     let num = activeIndex
    //
    //     if (e.key === 'ArrowLeft') num--
    //     if (e.key === 'ArrowRight') num++
    //
    //     if (num > maxIndex) num = 0
    //     if (num < 0) num = maxIndex
    //
    //     openHandler(num)
    // }
</script>

<template>
<!--    <svelte:window-->
<!--        on:keydown={e => keyHandler(e)}-->
<!--        on:click={() => changeIndex('close', 'open', null)}-->
<!--    />-->
    <!--                on:mousemove={() => openHandler(i)}-->
    <div class="dropdown-list-container">
        {#each values as {title, items}, i}
            <Dropdown
                on:click={() => DropdownService.clickHandler(i)}


                active={1 === i}
                title={title}
                items={items}
            />
        {/each}
    </div>
</template>

<style lang="sass">
    .dropdown-list-container
        display: flex
        column-gap: .8rem
</style>