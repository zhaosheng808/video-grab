<template>
  <div class="login-wrapper">
    <div class="bg">
      <div class="login-bg">
        <div class="login-body">
          <!--        <div class="login-logo">-->
          <!--          <img :src="appIcon"/>-->
          <!--        </div>-->
          <div class="login-title">{{ ui.name }}</div>
          <el-form :model="form" :rules="rules" ref="ruleForm">
            <el-form-item prop="username">
              <el-input
                  class="login-input"
                  size="small"
                  v-model="form.username"
                  placeholder="请输入用户名"
                  autofocus="autofocus"
                  autocomplete="off"
                  @keyup.native.13="login"><i slot="prefix" class="el-input__icon el-icon-user"></i></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  class="login-input"
                  size="small"
                  type="password"
                  v-model="form.password"
                  placeholder="请输入密码"
                  autocomplete="off"
                  @keyup.native.13="login"><i slot="prefix" class="el-input__icon el-icon-lock"></i></el-input>
            </el-form-item>
<!--            <el-form-item prop="code">-->
<!--              <el-input-->
<!--                  class="login-input"-->
<!--                  size="small"-->
<!--                  type="text"-->
<!--                  v-model="form.code"-->
<!--                  placeholder="请输入验证码"-->
<!--                  autocomplete="off"-->
<!--                  @keyup.native.13="login"><i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i></el-input>-->
<!--              <div class="code-wrapper" @click="this.getCode"><img :src="codeUrl" alt=""></div>-->
<!--            </el-form-item>-->
            <div class="error">{{message}}</div>
            <el-button class="login-btn"
                       type="primary"
                       :loading="isLoading"
                       size="small"
                       @click.prevent="handleSubmit">立即登录
            </el-button>

          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import appIcon from '@/assets/images/logo.png';
  import settings from '@/includes/settings';

  export default {
    name: 'login',
    title: '登录', // 拼接到网页title上
    data: () => {
      return {
        appIcon: appIcon,
        isLoading: false,
        ui: {
          name: settings.siteName,
          iconUrl: ''
        },
        form: {
          // username: 'root',
          // password: '123456',
          username: '',
          password: '',
          code: '',
        },
        message: '',
        showLarge: false,
        dialogVisible: false,
        tipsText: '',
        redirectUrl: '',
        codeData: {
          img: '',
          uuid: ''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'change'}],
          password: [{required: true, message: '请输入密码', trigger: 'change'}],
          code: [{required: true, message: '请输入验证码', trigger: 'change'}],
        }
      };
    },
    beforeCreate() {
      // console.log(settings, 'settings');
    },
    created() {
      if (this.$message) {
        this.$message.close();
      }
      this.redirectUrl = this.$route.query && this.$route.query.redirect || '';

      // 获取验证码
      // this.getCode();
    },
    computed: {
      codeUrl() {
        const {codeData} = this;
        let url = '';
        url = `data:image/png;base64,${codeData.img}`;
        return url;
      }
    },
    methods: {
      handleSubmit() {
        // 验证表单是否填写完毕
        this.validateForm('ruleForm', this.login);
      },
      login() {
        const {form, codeData} = this;
        this.message = '';
        const data = {
          username: form.username,
          password: form.password,
          // uuid: codeData.uuid,       // 验证码唯一标识
          // verifyCode: form.code.toUpperCase(), // 验证码
        };
        this.isLoading = true;
        this.$store.dispatch('LOGIN', data).then((resp) => {
          this.loginSuccess(resp);
        }).catch((err) => {
          this.isLoading = false;
          this.message = err;
          this.$message.closeAll();
          this.$message({
            duration: 6000,
            showClose: true,
            message: err,
            type: 'error'
          })
        });
      },
      loginSuccess() {
        if (this.redirectUrl) {
          window.location.href = decodeURIComponent(this.redirectUrl);
        } else {
          this.$router.push('/');
        }
        // setTimeout(() => {
        // this.$notify({
        //   title: '登录成功',
        //   message: `欢迎进入${this.ui.name}`,
        //   type: 'success'
        // });
        // }, 500);
      },
      // 验证表单是否全部填写完毕
      validateForm(formName, callback) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (callback && typeof callback === 'function') {
              callback();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置校验状态
      resetFields(formName) {
        if (this.$refs[formName]) {
          this.$nextTick(() => {
            this.$refs[formName].resetFields();
          });
        }
      },
      // 获取验证码
      getCode() {
        this.gCallApi('get', '/user/captchaImage', {}).then(resp => {
          this.codeData = resp.data || {};
        }).catch(err => {
          this.$message.error('验证码获取失败！')
        });
      }
    },
  };
</script>

<style>
  @import '../assets/scss/login.scss';
  .login-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    /*background: linear-gradient(180deg, rgba(27, 61, 170, 1) 0%, rgba(15, 144, 204, 1) 100%);*/
    background: rgb(45,163,140);
  }
  .bg {
    width: 100%;
    height: 100%;
    background:  url("../../static/bg.png") no-repeat left top / cover;
    position: relative;
  }
</style>

<style lang="scss">
  .login-bg {
    width: 420px;
    padding: 28px 36px;
    margin: -300px 0 0 -210px;
    position: absolute;
    right: 15%;
    top: 50%;

    .login-body {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 4px;
      padding: 30px 40px 50px;

      input {
        border-radius: 0;
        border-left: none;
        border-right: none;
        border-top: none;
      }

      .el-input__prefix {
        left: 0;
      }
    }

    .login-logo {
      width: 56px;
      height: 56px;
      margin: 0 auto;

      > img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .login-title {
      width: 100%;
      height: 20px;
      text-align: center;
      margin: 30px auto 40px;
      font-size: 24px;
      line-height: 20px;
      color: #0A98FF;
      /*font-weight: bold;*/
    }

    .login-input {
      width: 100%;

      i {
        font-size: 16px;
      }
    }

    .login-btn {
      width: 100%;
      margin-top: 30px;
      margin-bottom: 20px;
      padding: 9px 15px;
      border-radius: 4px;
    }

    .login-lost {
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #949494;
    }

    .code-wrapper {
      width: 100px;
      height: 30px;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      /*background-color: #f7f7f7;*/
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
</style>
