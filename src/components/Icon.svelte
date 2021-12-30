<script lang="ts">
    export let icon: string
    export let size: string
</script>

<template>
    <span
        class="material-icons{$$props.class ? ' ' + $$props.class : ''}"
        style={size != null ? `font-size: ${size}` : undefined}
    >
        {icon}
    </span>
</template>