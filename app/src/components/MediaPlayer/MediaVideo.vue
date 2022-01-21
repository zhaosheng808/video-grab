<template>
    <div class="media-video">
        <video controls :src="src" alt=""/>
    </div>
</template>

<script>
    export default {
        name: "mediaVideo",
        props: ['src'],
        data() {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    .media-video {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        video {
            width: 100%;
            height: 100%;
        }
    }
</style>