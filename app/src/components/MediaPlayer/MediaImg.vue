<template>
    <div class="media-img">
        <img :src="src" :alt="src">
    </div>
</template>

<script>
    export default {
        name: "mediaImg",
        props: ['src'],
        data() {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    .media-img {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
</style>