<script lang="ts">
import File from "./File.svelte";
</script>

<template>
    <div class="desktop">
        <File
            icon="settings"
            name="Настройки"
            top={50}
            left={50}
        />
    </div>
</template>

<style lang="sass">
    .desktop
        height: 100%
</style>