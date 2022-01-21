<template>
    <div class="header">
        <a class="header-logo limit-line1"><img v-if="logo" class="logo-img" :src="logo" alt="">{{title}}</a>
        <div class="index-nav">
            <router-link v-for="item in topNavList"
                         :key="item.index"
                         :to="item.index">{{item.name}}
            </router-link>
        </div>
        <el-dropdown class="header-user" @command="handleCommand" v-if="!hiddenUserInfo">
            <span class="el-dropdown-link">
                <div class="useravatar"><img :src="userimg"/></div>
                <span>{{username}}</span>
                <i v-if="usermenu.length > 0" class="el-icon-arrow-down el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in usermenu" :key="item.command" :command="item.command">{{item.label}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px" :append-to-body="true"
                   :close-on-click-modal="false">
            <el-form :model="form" ref="ruleForm" label-width="90px" :rules="rules">
<!--                <el-form-item label="密码" prop="old_password">-->
<!--                    <el-input type="password" size="small" show-password v-model="form.old_password"-->
<!--                              auto-complete="off"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="新密码" prop="password1">
                    <el-input type="password" size="small" show-password v-model="form.password1"
                              auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2">
                    <el-input type="password" size="small" show-password v-model="form.password2"
                              auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handle_sure" :loading="isUpdating">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import { mapState } from 'vuex';

    export default {
        name: 'top',
        props: ['baseURL', 'title', 'username', 'useravatar', 'usermenu', 'icon', 'showBack', 'hiddenUserInfo', 'logo'],
        components: {},
        data() {
            const validatePassword2 = (rule, value, callback) => {
                if (value && value !== this.form.password1) {
                    callback(new Error('两次输入的密码不同'));
                } else {
                    if (value) {
                        callback();
                    } else {
                        callback(new Error('密码不能为空'));
                    }
                }
            };
            const validatePassword1 = (rule, value, callback) => {
                if (value && value.length >= 6) {
                    callback();
                } else {
                    callback(new Error('密码不能小于6位'));
                }
            };
            return {
                isUpdating: false,
                dialogFormVisible: false,
                form: {
                    old_password: '',
                    password1: '',
                    password2: '',
                },
                navList: [
                    { name: '基础设置', index: '/home', keys: [] },
                    { name: '媒体存储服务', index: '/mss', keys: ['mss'] },
                    { name: '媒体处理服务', index: '/mps', keys: ['mps'] },
                    { name: '媒体智能服务', index: '/mis', keys: ['mis'] },
                ],
                serviceList: [],
                rules: {
                    old_password: { required: true, message: '密码不能为空' },
                    password1: { validator: validatePassword1, required: true, trigger: 'blur' },
                    password2: { validator: validatePassword2, required: true, trigger: 'blur' }
                }
            };
        },
        computed: {
            userimg: function () {
                if (!this.useravatar || this.useravatar.length == 0) {
                    return require('../../assets/images/user.png');
                } else {
                    return this.useravatar;
                }
            },
            topNavList() {
                const { navList, services } = this;
                const filterArr = [];
                const permissions = services || [];
                // const permissions = ['mss'];
                navList.forEach(item => {
                    if (item.keys.length > 0) {
                        for (let i = 0; i < item.keys.length; i++) {
                            const key = item.keys[i];
                            if (permissions.indexOf(key) > -1) {
                                filterArr.push(item);
                                break;
                            }
                        }
                    }else {
                        filterArr.push(item);
                    }
                });
                return filterArr;
            },
            ...mapState(['userId', 'services']),
        },
        created() {

        },
        methods: {
            handleCommand(command) {
                if (command === 'changePassword') {
                    this.change_password();
                } else {
                    for (let item of this.usermenu) {
                        if (command === item.command) {
                            location.href = item.url;
                            return;
                        }
                    }
                }
            },
            // 修改密码
            change_password() {
                this.form = {
                    old_password: '',
                    password1: '',
                    password2: '',
                };
                this.resetForm('ruleForm');  // 重置表单规则
                this.dialogFormVisible = true;
            },
            // 确认修改密码
            handle_sure() {
                this.validateForm('ruleForm', () => {
                    const { password1 } = this.form;
                    const { userId } = this;
                    const postData = {
                        password: password1,
                    };
                    this.isUpdating = true;
                    this.$axios.put(`/home/users/${userId}/reset-password`, postData).then(resp => {
                        this.isUpdating = false;
                        this.dialogFormVisible = false;
                        this.$message.success('操作成功！');
                    }).catch(err => {
                        this.isUpdating = false;
                        this.$message.error(err);
                    });
                });
            },
            // 重置表单
            resetForm(formName) {
                if (this.$refs[formName]) {
                    this.$refs[formName].resetFields();
                }
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
        }
    };
</script>
<style lang="scss">
    .index-nav {
        float: left;
        height: 100%;
        margin-left: 22px;

        a {
            float: left;
            height: 100%;
            line-height: 58px;
            margin-right: 0px;
            text-align: center;
            padding: 0 20px;
            cursor: pointer;
            color: #fff;
            text-decoration: none;

            &.router-link-active {
                color: #2993f2;
                background-color: #141e2d;
            }
        }
    }
</style>
<style scoped lang="scss">
    .header{
        min-width: 960px;
    }
    .back-index {
        color: #748AA1;
        display: inline-flex;
        align-items: center;
        margin-left: 30px;
        cursor: pointer;
        text-decoration: none;

        &:hover {
            color: #1890ff;
        }
    }

    .header-logo {
        width: 260px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
    }

    .logo-img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .icon-group {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('../../assets/images/Group.png') no-repeat center / contain;
        margin-right: 6px;
    }
</style>