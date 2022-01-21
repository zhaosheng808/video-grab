<template>
    <span :class="['thumbnail-icon', typeClassName]">
        <img
            v-if="showImage"
            :src="thumbnail"
            class="thumbnail-icon__img"
            onerror="this.classList.add('error')">
        <span v-else class="thumbnail-icon__default"></span>
        <span v-if="shareMark" class="shared-mark"></span>
    </span>
</template>

<script>
import FILE from '../includes/types';

const CLASS_NAME_MAP = {
    [FILE.VIDEO]: 'video',
    [FILE.AUDIO]: 'audio',
    [FILE.DOC]: 'doc',
    [FILE.PICTURE]: 'picture',
    [FILE.FOLDER]: 'folder',
    [FILE.UNKNOWN]: 'unknown',
    [FILE.NON_LINEAR]: 'nle',
    [FILE.ANOTHER]: 'else'
}

export default {
    name: 'ThumbnailIcon',
    props: {
        type: Number | String,
        thumbnail: String,
        shareMark: Boolean
    },
    computed: {
        showImage({ type, thumbnail }) {
            type = parseInt(type);

            return ![FILE.FOLDER].includes(type) && !!thumbnail
        },
        typeClassName({ type }) {
            return CLASS_NAME_MAP[type];
        }
    },
}
</script>

<style lang="scss">
.thumbnail-icon {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    flex-grow: 0;
    align-items: center;
    width: 24px;
    height: 24px;
    font-size: 0;
    background-repeat: no-repeat;
    background-position: left bottom;

    &__img {
        display: inline-block;
        width: 100%;
        height: 100%;

        &.error {
            position: relative;
            display: inline-block;
            transform: scale(1);
            content: '';
            color: transparent;
        }

        &.error::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
            background-repeat: no-repeat;
        }
    }

    .shared-mark {
        position: absolute;
        left: -6px;
        bottom: -6px;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background-image: url('../assets/images/icon/shared.png');
        background-color: transparent;
        background-position: left bottom;
        background-repeat: no-repeat;
    }

    &__default {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-repeat: no-repeat;
        background-position: left bottom;
    }

    &.folder {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/folder.png');
            background-position-y: 2px;
        }
    }

    &.unknown {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/unknown.png');
        }
    }

    &.video {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/video.png');
        }
    }

    &.audio {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/audio.png');
        }
    }

    &.picture {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/picture.png');
        }
    }

    &.doc {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/doc.png');
        }
    }

    &.nle {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/nle.png');
        }
    }

    &.else {
        .thumbnail-icon__img.error::before,
        .thumbnail-icon__default {
            background-image: url('../assets/images/icon/else.png');
        }
    }
}
</style>