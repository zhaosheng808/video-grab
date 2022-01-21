<template>
    <div class="upload-wrapper clear-both">
        <div class="upload-box">
            <input
                type="file"
                ref="upload_input"
                id="upload_input"
                :accept="accept"
                @click="uploadClick"
                @change="handleChange($event)"
                style="border: 1px solid rgb(0, 0, 0); display: none;"
            >
            <div v-if="fileData" class="img-box">
                <div class="del-cover">
                    <i class="el-icon-delete" @click.prevent.stop="handleDelFile"></i>
                </div>
                <div class="file-detail">
                    <i class="el-icon-paperclip file-icon"></i>
                    <div class="limit-line1 file-name" v-if="fileData" :title="fileData.name">{{fileData.name}}</div>
                </div>
            </div>
            <label v-else for="upload_input" class="default_label">
                <i class="el-icon-upload2"></i>
            </label>

            <div class="upload-loading" v-if="uploading">
                <span>上传中 <br/>{{progress}}%</span>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    const MAX_SIZE = 500; // 最大文件大小 M
    export default {
        name: 'FileUpload.vue',
        props: ['accept', 'cover', 'maxSize', 'uploadAddress', 'autoUpload'],
        data() {
            return {
                uploading: false, // 文件上传中
                // uploadAddress: null, // 上传api地址
                tempPath: null, // 临时文件路径
                progress: 0, // 文件上传进度 0~100
                fileData: null, // 文件对象
            };
        },
        mounted() {
            // this.tempPath = this.cover;
            // this.getUploadAddress();
        },
        watch: {
        },
        computed: {
        },
        created() {
        },
        methods: {
            // 重新上传
            reUpload() {
                if (this.fileData) {
                    this.handleUploadFile(this.fileData);
                }
            },
            handleDelFile() {
                this.tempPath = '';
                this.uploading = false;
                this.fileData = null;
                this.$emit('onChange', null)
            },
            getUploadAddress() {
                // this.$store
                //   .dispatch('FETCH_UPLOADADDRESS', {})
                //   .then(res => {
                //     this.uploadAddress = res;
                //   })
                //   .catch(err => {
                //     this.$toast(err);
                //   });
            },
            uploadClick() {
                if (this.$refs['upload_input']) {
                    if (!this.uploading) {
                        const input = this.$refs['upload_input'];
                        input.value = '';
                        input.click();
                    }
                }
            },
            // 上传文件封面图 change
            handleChange(e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                /*        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                          this.$toast('仅支持jpg|jpeg|png图片格式');
                          return;
                        }*/
                const fileData = files[0];
                this.fileData = fileData;
                // console.log(fileData.size / 1024, 'size')
                const fileSize = fileData.size / 1024; // kb
                const maxSize = this.maxSize || MAX_SIZE; // M为单位


                if (fileSize > maxSize * 1024) { // 大于最大 文件大小
                    this.$message.warning(`文件大小不能超过${maxSize}M`);
                    return false;
                }

                this.$emit('onChange', e)
                const {autoUpload} = this;
                if (autoUpload) {
                    this.handleUploadFile(fileData);
                }
            },
            clearInput() {
                const input = this.$refs['upload_input']; // 清空input
                input.value = '';
            },
            onProgress(progress) {
                this.progress = progress;
                this.$emit('onProgress', progress)
            },
            onError(error) {
                this.uploading = false;
                this.$message.error(error);
                this.$emit('onError')
            },
            start() {
                const {fileData} = this;
                if (fileData) {
                    this.handleUploadFile(fileData)
                } else {
                    this.onError('请先选择文件');
                }
            },
            // 上传指定file
            handleUploadFile(fileData) {
                const _this = this;
                const formData = new FormData();
                formData.append('file', fileData);
                // Post image
                _this.uploading = true;

                axios({
                    method: 'post',
                    url: _this.uploadAddress,
                    onUploadProgress(e) {
                        if (e.lengthComputable) {
                            const progress = ((e.loaded / e.total) * 100).toFixed(2);
                            _this.onProgress(progress);
                            // console.log('上传进度',e.loaded / e.total); //已上传的比例
                        }
                    },
                    params: {},
                    data: formData,
                }).then(response => {
                    _this.uploadSuccess(response);
                }).catch(error => {
                    _this.onError(error.message);
                });
                this.clearInput()
            },
            uploadSuccess() {
                this.onProgress(100);
                this.uploading = false;
                this.$emit('onSuccess')
            },
        }
    };
</script>
<style lang="scss" scoped>
    .upload-wrapper {
        width: 100%;
        display: block;
    }

    .upload-box {
        position: relative;
        width: 80px;
        height: 80px;
        float: left;
        border: 1px dashed #dddddd;
        border-radius: 4px;
        cursor: pointer;
        background-color: #f7f8fa;
    }

    .upload-box:hover {
        border: 1px dashed #409EFF;
    }

    .upload-box .img-box {
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
    }

    .upload-loading {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        text-align: center;
        background-color: rgba(50, 50, 51, 0.88);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #ffffff;
        line-height: 20px;
        font-size: 14px;

        span {
            margin-top: 6px;
            font-size: 12px;
        }
    }

    .del-cover {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 0 0 0 10px;
        display: none;
        i {
            position: absolute;
            top: -1px;
            right: -1px;
            color: #fff;
            font-size: 20px;
            transform: scale(0.5);
        }

    }

    .upload-box :hover .del-cover {
        display: block;
    }

    .img-box img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .file-detail{
        padding: 20px 0;
        line-height: 20px;
        .file-icon{
            font-size: 20px;
        }
        .file-name{
            padding: 0 4px;
        }
    }

    .upload-btn-wrapper {
        float: left;
    }

    .upload-btn-wrapper button {
        display: block;
        margin: 10px 4px !important;
    }

    .default_label {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &:hover{
            color: #409EFF;
        }
    }
</style>
