<template>
    <div class="player-wrapper">
        <div class="player-inner">
            <div class="player-content">
                <MediaImg v-if="type == 'image'" :src="src"></MediaImg>
                <mediaVideo v-else-if="type == 'video'" :src="src"></mediaVideo>
                <mediaVideo v-else-if="type == 'audio'" :src="src"></mediaVideo>
                <div v-else class="no-support">该文件格式暂不支持预览</div>
            </div>
        </div>
    </div>
</template>

<script>
    import MediaImg from './MediaImg'
    import mediaVideo from './mediaVideo'
    export default {
        name: "MediaPlayer",
        props: ['type', 'src'],
        components: {
            MediaImg,
            mediaVideo,
        },
        data() {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    .player-wrapper {
        background-color: #333;
        .player-inner {
            padding-bottom: 62.25%;
            position: relative;
        }
        .player-content{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .no-support{
            color: #ffffff;
            font-size: 16px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>