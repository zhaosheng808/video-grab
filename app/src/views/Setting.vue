<template>
  <div class="bigdata-config"
       v-loading="isLoading"
       element-loading-text="数据加载中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button style="float: right;" type="primary" size="small" :loading="isUpdating" v-if="!isNoData"
                   @click="handleSubmit">保存并应用
        </el-button>
        <div class="card-title">
          <div class="title-icon params-icon"/>
          大数据屏配置
        </div>
      </div>
      <div>
        <div v-if="isNoData" class="no-data">
          <p>大数据屏暂未配置</p>
          <button class="add-button" @click="handleAdd">新增配置</button>
        </div>
        <div v-else>

          <!--基础数据-->
          <div class="base-form">
            <el-form label-width="120px">
              <el-form-item label="启用状态">
                <el-switch
                    v-model="baseForm.status"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
              <el-form-item label="大屏页面链接">
                <el-input disabled
                          class="copy-input"
                          v-model="mainPath"/>
                <el-button type="text" class="btn-copy" @click="handleCopy">复制链接</el-button>
              </el-form-item>
            </el-form>
          </div>
          <hr style="height:1px;border: none;border-top:1px solid #ddd;margin:15px 0;">
          <!--演示数据-->
          <el-form :inline="true" label-width="120px" class="params-form">
            <el-form-item label="演示数据" style="width: 100%;">
              <div style="padding-top: 10px">
                <el-switch
                    style="float: left"
                    v-model="paramsForm.virtualStatus"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
                <div style="color: red;line-height: 20px;margin-left: 50px">注：开启演示数据后，大屏显示的数据将根据每一项配置的百分比做相应上浮</div>
              </div>
            </el-form-item>
            <br>
            <el-form-item v-for="item in paramsFormKeys" :key="item.key" :label="item.name">
              <el-input type="number" min="0" v-model="paramsForm[item.key]"/>&nbsp;&nbsp;%
            </el-form-item>
          </el-form>
        </div>

      </div>
    </el-card>

  </div>
</template>

<script>
  import icon1 from '@/assets/images/setting/icon1.png';
  import icon2 from '@/assets/images/setting/icon2.png';
  import Upload from '@/components/Upload';
  import {copyText, getDashboardIndexLink} from '@/includes/common';

  export default {
    name: 'BigData',
    title: '大数据配置',
    components: {
      Upload,
    },
    data() {
      return {
        icon1,
        icon2,
        isLoading: true,
        isUpdating: false,
        mainPath: '', // 首页地址
        dialogVisibleBase: false,
        dialogVisibleParams: false,

        isNoData: true, // 未配置大屏数据
        baseData: {
          virtualStatus: 0, // 大屏是否启用(0:false未启用；1:true，启用)
          status: 0,  // 是否启用演示数据(0:false未启用；1:true，启用)
          virtualData: {},  // 演示数据配置信息
        },
        baseForm: {
          status: 0,  // 是否启用演示数据(0:false未启用；1:true，启用)
        },
        paramsForm: {
          newUser: 0,
          registerUser: 0,
          sessionCount: 0,
          activeUser: 0,
          articlePublish: 0,
          articleRead: 0,
          articlePraise: 0,
          articleComment: 0,
          videoPublish: 0,
          videoPlay: 0,
          liveCount: 0,
          liveUserCount: 0,
          virtualStatus: 0,
        },
        paramsFormKeys: [
          {name: '每日新增用户', key: 'newUser'},
          {name: '每日注册用户', key: 'registerUser'},
          {name: '每日使用次数', key: 'sessionCount'},
          {name: '每日活跃用户', key: 'activeUser'},
          {name: '文章发布', key: 'articlePublish'},
          {name: '文章阅读', key: 'articleRead'},
          {name: '文章点赞', key: 'articlePraise'},
          {name: '文章评论', key: 'videoPublish'},
          {name: '视频发布', key: 'videoPlay'},
          {name: '直播场次', key: 'liveCount'},
          {name: '直播参与用户', key: 'liveUserCount'},
        ],
        addressInfo: {
          province: '',
          city: ''
        },
        baseRules: {
          appName: [{required: true, message: '请输入应用名称'}],
          companyName: [{required: true, message: '请输入公司名称'}],
          // companyAddr: [{required: true, message: '请输入公司地址'}],
          logo: [{required: true, message: '请上传logo'}],
        },
        map: null,
        marker: null,
      };
    },
    mounted: function () {
      this.getInfo();
      this.getMainUrl();
    },
    methods: {
      filterTime(time) {
        let filterTime = '';
        if (time) {
          filterTime = this.$moment(time).format('YYYY-MM-DD');
        }
        return filterTime
      },
      getMainUrl() {
        const link = getDashboardIndexLink();
        this.mainPath = link;
      },
      getInfo() {
        //sys/appInfo/{appId}
        this.isLoading = true;
        const projectID = 0; // 总站默认为0
        this.$axios.get(`/sys/screen/config/${projectID}`).then(resp => {
          if (resp.code === 1000) {
            if (resp.data) {
              this.baseData = resp.data;
              this.initForm()
              this.isNoData = false;
            } else {
              this.isNoData = true;
            }
          } else {
            this.$message.error(resp.msg);
          }
          this.isLoading = false;
        }).catch(err => {
          this.isLoading = false;
          this.$message.error(err.msg);
        })
      },
      // 初始化form
      initForm() {
        const {baseData} = this;
        const {
          virtualStatus = 0,
          status = 0,
          virtualData = {}
        } = baseData;
        const {
          newUser = 0,
          registerUser = 0,
          sessionCount = 0,
          activeUser = 0,
          articlePublish = 0,
          articleRead = 0,
          articlePraise = 0,
          articleComment = 0,
          videoPublish = 0,
          videoPlay = 0,
          liveCount = 0,
          liveUserCount = 0,
        } = virtualData;

        this.paramsForm = {
          newUser,
          registerUser,
          sessionCount,
          activeUser,
          articlePublish,
          articleRead,
          articlePraise,
          articleComment,
          videoPublish,
          videoPlay,
          liveCount,
          liveUserCount,
          virtualStatus: virtualStatus ? 1 : 0,
        };
        this.baseForm = {
          status: status ? 1 : 0,
        };
      },
      handleCopy() {
        const {mainPath} = this;
        copyText(mainPath, () => {
          this.$message.success('链接已复制到粘贴板！');
        });
      },
      // 编辑基础信息
      handleEditBase() {
        this.resetFields('baseForm');
        this.baseForm = {...this.baseData};
        this.dialogVisibleBase = true;
      },
      handleSubmitBase() {
        const projectID = 0; // 总站默认为0
        this.validateForm('baseForm', () => {
          const {baseForm} = this;
          const {
            appName,
            logo,
            companyName,
            companyAddr,
            companyLat,
            companyLng,
            companyProvince,
            companyCity,
            status,
          } = baseForm;

          const postData = {
            appName,
            logo,
            companyName,
            companyAddr,
            companyProvince,
            companyCity,
            companyLat: companyLat ? String(companyLat) : '',
            companyLng: companyLng ? String(companyLng) : '',
            status: status || 0,
          };
          this.$axios.put(`/sys/appInfo/${projectID}`, postData).then(resp => {
            if (resp.code === 1000) {
              this.$message.success('操作成功！');
              this.dialogVisibleBase = false;
              this.getInfo();
            } else {
              this.$message.error(resp.msg);
            }
          }).catch(err => {
            this.$message.error(err.msg);
          })


        });
      },
      // 二次确认
      sureAgain(warnText, callback) {
        this.$confirm(warnText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (callback) {
            callback();
          }
        }).catch(() => {
        });
      },
      // 验证表单是否全部填写完毕
      validateForm(formName, callback) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (callback) {
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
      // 新增配置
      handleAdd() {
        this.isNoData = false;
        this.paramsForm = {
          newUser: 0,
          registerUser: 0,
          sessionCount: 0,
          activeUser: 0,
          articlePublish: 0,
          articleRead: 0,
          articlePraise: 0,
          articleComment: 0,
          videoPublish: 0,
          videoPlay: 0,
          liveCount: 0,
          liveUserCount: 0,
          virtualStatus: 0,
        };
        this.baseForm = {
          status: 0,
        };
      },
      checkForm(form) {
        let canPass = true;
        let noPassKey = '';
        const allKeys = Object.keys(form)
        for (let i = 0; i < allKeys.length; i++) {
          let key = allKeys[i];
          if (form[key] < 0) {
            noPassKey = key;
            canPass = false;
            break
          }
        }
        return {
          canPass,
          noPassKey
        }
      },
      handleSubmit() {

        const projectID = 0; // 总站默认为0
        const {baseForm, paramsForm, paramsFormKeys} = this;
        const checkFormResult = this.checkForm(paramsForm)
        if (!checkFormResult.canPass) {

          const noPassItem = paramsFormKeys.find(item => item.key == checkFormResult.noPassKey)
          this.$message.warning(`${noPassItem.name} 数据不能小于 0！`)
          return false
        }
        this.isUpdating = true;
        const postData = {
          appId: projectID,
          status: baseForm.status,
          virtualStatus: paramsForm.virtualStatus,
          virtualData: {...paramsForm},
        };
        this.$axios.post('/sys/screen/config', postData).then(resp => {
          if (resp.code === 1000) {
            this.$message.success('操作成功！');
            this.getInfo();
          } else {
            this.$message.error(resp.msg);
          }
          this.isUpdating = false;
        }).catch(err => {
          this.isUpdating = false;
          this.$message.error(err.msg);
        })
      }
    },
    filters: {}
  }
  ;
</script>

<style lang="scss">
  .bigdata-config {
    margin: 20px;

    .btn-copy {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(120%, -50%);
    }

    .params-form .el-input {
      width: 80px;
    }

    .amap-wrapper {
      height: 200px;
      background-color: #f7f7f7;
    }

    .el-form--inline {
      .el-form-item {
        width: 300px;
      }
    }

    .inline-form-item {
      display: inline-block;
      margin-right: 10px;


      .el-form-item__label {
        width: auto !important;
        text-align: left;
        display: inline-block;
      }

      .el-form-item__content {
        margin-left: 0 !important;
        display: inline-block;
      }
    }

    .tips {
      font-size: 12px;
      color: #999999;
    }

    .base-form {
      .el-form {
        max-width: 500px;
      }
    }

    .box-card {
      margin: 0 10px 40px;
      min-height: 200px;
    }

    .add-button {
      color: #2993f2;
      font-size: 16px;
      outline: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      background-color: transparent;
    }
  }


  .title-icon.base-icon {
    background-image: url('../assets/images/setting/icon1.png');
  }

  .title-icon.params-icon {
    background-image: url('../assets/images/setting/icon1.png');
  }


</style>