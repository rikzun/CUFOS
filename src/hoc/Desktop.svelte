<script lang="ts">
import File from "./File.svelte";

</script>

<template>
    <div class="desktop">
        <!--{#each {length: 11} as _, i}-->
        <!--    {#each {length: 24} as _, ii}-->
        <!--        <File-->
        <!--            icon="description"-->
        <!--            name="File {(24 * i) + ii + 1}"-->
        <!--            top={29 + (80 * i)}-->
        <!--            left={80 * ii}-->
        <!--        />-->
        <!--    {/each}-->
        <!--{/each}-->
    </div>
</template>

<style lang="sass">
    .desktop
        height: 100%
</style>