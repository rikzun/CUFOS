<script lang="ts">

</script>

<template>
    {#if process.env.NODE_ENV !== 'dev123elopment'}
        <h1>Production environment!</h1>
    {/if}
</template>

<style lang="sass">
    :global
        body
            display: flex
            align-items: center
            justify-content: center

            margin: 0
            width: 100vw
            height: 100vh

            background-image: url('https://palscity.ams3.cdn.digitaloceanspaces.com/upload/photos/2021/08/fVooSsgnWxS7uRJatGn7_19_b1ca2d4a591d79191715b66af54ddf3a_image.jpg?cache=0')
            background-position: center
            background-repeat: no-repeat
            background-size: cover
</style>