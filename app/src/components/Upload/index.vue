<template>
  <el-upload
      class="avatar-uploader my-uploader"
      v-loading="isLoading"
      element-loading-text="文件上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :headers="headers"
      :action="uploadUrl"
      :on-success="onSuccess"
      :on-progress="onLoading"
      :on-error="onError"
      accept="image/*"
      :show-file-list="false"
      :limit="100">
    <img v-if="src" :src="src" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <div class="del-cover" v-if="src" @click.stop>
      <i class="el-icon-delete" @click="handleDel"></i>
    </div>
    <!--删除按钮-->
  </el-upload>
</template>

<script>
  import settings from '@/includes/settings';
  import {getToken} from '@/includes/common';

  export default {
    name: "index",
    props: ['src'],
    data() {
      return {
        uploadUrl: '',
        isLoading: false,
        headers: {}, // 自定义请求头
      }
    },
    mounted() {
      const {apiAddress} = settings;
      this.uploadUrl = apiAddress + '/upload/single';
      let token = getToken();
      this.headers = {
        'Authorization': token
      };
    },
    methods: {
      handleDel() {
        this.$emit('update:src', '')
      },
      onSuccess(rs, file) {
        this.isLoading = false;
        if (rs && rs.code == 1000) {
          const url = rs.data.url;
          this.$emit('update:src', url)
        } else {
          this.$message({
            type: 'error',
            message: rs && rs.msg ? '上传失败，' + rs.msg : '出错啦',
            showClose: true
          });
        }
      },
      onError() {
        this.isLoading = false;
      },
      onLoading() {
        this.isLoading = true;
      }
    }
  }
</script>

<style lang="scss">
  .my-uploader .el-loading-spinner {
    line-height: 20px;
  }

  .my-uploader {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    border: 1px solid #eaeaea;
    border-radius: 4px;
    cursor: pointer;
    position: relative;

    .el-upload {
      width: 100%;
      height: 100%;
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .avatar-uploader-icon {
      font-size: 20px;
      color: #8c939d;
      width: 78px;
      height: 78px;
      line-height: 78px;
      text-align: center;
    }
  }

  .del-cover {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    display: none;

    i {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }


  .my-uploader :hover .del-cover {
    display: block;
  }
</style>