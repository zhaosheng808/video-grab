<template>
  <div class="dashboard-wrapper">
    <el-form :model="form" class="url-form" ref="ruleForm" @submit.native.prevent>
      <el-button-group>
        <el-button size="small"
                   v-for="item in platform"
                   :key="item.name"
                   @click="handleChangePageUrl(item.url)">{{item.name}}</el-button>
      </el-button-group>
      <el-form-item prop="url" label="网页地址：">
        <el-input
            class="login-input"
            size="small"
            v-model="form.url"
            placeholder="请输入网页地址"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 5}"
            autofocus="autofocus"
            autocomplete="off"
            @keyup.native.13="handleSubmit"><i slot="prefix" class="el-input__icon el-icon-link"></i></el-input>
      </el-form-item>
      <el-button class="login-btn"
                 type="primary"
                 :loading="isLoading"
                 size="small"
                 @click.prevent="handleSubmit">提交
      </el-button>
      <template v-if="form.videoUrl">
        <el-divider content-position="left">解析结果</el-divider>
        <el-form-item prop="videoUrl" label="视频地址：">
          <el-input
              size="small"
              type="textarea"
              :autosize="{minRows: 3, maxRows: 8}"
              v-model="form.videoUrl"
              readonly
          ></el-input>
        </el-form-item>
      </template>

    </el-form>
  </div>
</template>

<script>

  export default {
    name: 'Dashboard',
    title: '', // 拼接到网页title上
    data: () => {
      return {
        isLoading: false,
        form: {
          // url: 'https://www.douyin.com/video/7020764246476590339', // 网页地址
          url: 'https://v.cctv.cn/2022/01/15/VIDEJnMMIJw5FRqehWqkua8w220115.shtml?spm=C90324.PE6LRxWJhH5P.EPZudTwNMBDs.1', // 网页地址
          videoUrl: ''
        },
        platform: [
          {name: '抖音', url: 'https://www.douyin.com/video/7020764246476590339'},
          {name: '央视', url: 'https://v.cctv.cn/2022/01/15/VIDEJnMMIJw5FRqehWqkua8w220115.shtml?spm=C90324.PE6LRxWJhH5P.EPZudTwNMBDs.1'},
          {name: '微博', url: 'https://weibo.com/tv/show/1034:4726981519147023?mid=4726985493054318'},
        ]
      };
    },
    methods: {
      handleSubmit() {
        const {form} = this;
        if (!form.url) {
          this.$message.error('请先输入网页地址！');
          return;
        }
        this.isLoading = true;
        this.form.videoUrl = '';
        const postData = {
          url: form.url
        }
        this.$axios.post('/analysis/video', postData).then((data) => {
          console.log(data, 'data');
          this.form.videoUrl = data.videoUrl;
        }).catch(err => {
          this.$message.error(err);
        }).finally(() => {
          this.isLoading = false;
        })
      },
      handleChangePageUrl(url) {
        this.form.url = url;
        this.form.videoUrl = '';
      }
    },
  };
</script>

<style lang="scss">
.dashboard-wrapper{
  .url-form{
    padding: 100px 0 0;
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
