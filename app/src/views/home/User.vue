<template>
    <div class="app-page-content">
        <el-form class="search-form" :model="searchForm" inline @submit.native.prevent>
            <el-form-item label="用户名">
                <el-input placeholder="用户名关键词" v-model="searchForm.keywords"
                          style="width: 150px;"
                          size="small" @keyup.enter.native="handleSearch">
                    <i class="el-icon-search el-input__icon"
                       slot="suffix"
                       @click="handleSearch">
                    </i>
                </el-input>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" size="small" @click="handleAdd">添加用户</el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="dataList"
            v-loading="isLoading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="数据加载中..."
            stripe>
            <el-table-column
                prop="id"
                label="ID"
                width="100">
            </el-table-column>
            <el-table-column
                prop="username"
                label="用户名">
            </el-table-column>
            <el-table-column
                prop="nickname"
                label="昵称">
            </el-table-column>
            <el-table-column
                prop="creationTime"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.creationTime * 1000 | formatDate}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleEdit(scope.row, scope.$index)">编辑
                    </el-button>
                    <el-button
                        size="mini"
                        class="danger-color"
                        type="text"
                        @click="handleDel(scope.row, scope.$index)">移除
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleReset(scope.row, scope.$index)">重置密码
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination-wrapper">
            <el-pagination
                @current-change="pageChange"
                layout="total, prev, pager, next, jumper"
                :current-page.sync="searchForm.page"
                :page-size="searchForm.size"
                :total="total"
            ></el-pagination>
        </div>
        <!-- 新增弹框-->
        <el-dialog :title="`${form.id ? '编辑' : '添加'}用户`"
                   :visible.sync="dialogVisible"
                   width="540px"
                   custom-class="padding-dialog"
                   :close-on-click-modal="false">
            <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="form.username"
                              size="small"
                              :disabled="Boolean(form.id)"
                              auto-complete="new-password"
                              maxlength="20"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="呢称：" prop="nickname">
                    <el-input v-model="form.nickname"
                              size="small"
                              maxlength="20"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="密码：" v-if="!form.id" prop="password">
                    <el-input  size="small"
                               auto-complete="new-password"
                               v-model="form.password" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" :loading="isUpdating" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹框-->
        <el-dialog :title="`重置密码`"
                   :visible.sync="dialogVisible_reset"
                   width="540px"
                   custom-class="padding-dialog"
                   :close-on-click-modal="false">
            <el-form :model="resetForm" ref="resetForm" :rules="rules" label-width="100px">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="resetForm.username"
                              size="small"
                              disabled
                              auto-complete="new-password"
                              maxlength="20"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="密码：" prop="password">
                    <el-input  size="small"
                               auto-complete="new-password"
                               v-model="resetForm.password" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="dialogVisible_reset = false">取 消</el-button>
                <el-button size="small" type="primary" :loading="isUpdating" @click="handleSubmitReset">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Members',
        props: ['projectID'],
        data() {
            return {
                dialogVisible: false,
                dialogVisible_reset: false,
                isUpdating: false,
                isLoading: false,
                dataList: [],
                searchForm: {
                    page: 1,
                    size: 10,
                    keywords: '',
                },
                form: {
                    id: '',
                    username: '',
                    password: '',
                    nickname: '',
                },
                resetForm: {
                    id: '',
                    username: '',
                    password: '',
                },
                userList: [],
                roleList: [],
                total: 0,
                rules: {
                    username: {required: true, message: '请输入用户名'},
                    password: {required: true, message: '请输入密码'},
                    nickname: {required: true, message: '请输入昵称'},
                },
                multipleSelection: [], // 当前页选中的数据
            };
        },
        computed: {
        },
        created() {
        },
        mounted() {
            this.getDataList();
        },
        methods: {
            handleSearch() {
                this.searchForm.page = 1;
                this.getDataList();
            },
            pageChange() {
                this.getDataList();
            },
            // 获取当前数据列表
            getDataList() {
                const {searchForm} = this;
                this.isLoading = true;
                this.$axios({
                    method: 'get',
                    url: `/home/users`,
                    params: {
                        page: searchForm.page,
                        size: searchForm.size,
                        username: searchForm.keywords
                    }
                }).then((res) => {
                    this.dataList = res.data || [];
                    this.total = res.total || 0;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$message.error(err);
                    this.isLoading = false;
                });
            },
            handleAdd() {
                this.resetFields('ruleForm');
                this.form = {
                    id: null,
                    username: '',
                    password: '',
                    nickname: '',
                };
                this.dialogVisible = true;
            },
            handleEdit(row) {
                this.resetFields('ruleForm');
                this.form = {
                    id: row.id,
                    username: row.username,
                    password: row.password,
                    nickname: row.nickname,
                };
                this.dialogVisible = true;
            },
            handleSubmit() {
                this.validateForm('ruleForm', () => {
                    const {form} = this;
                    this.isUpdating = true;
                    let method = 'POST';
                    let url = `/home/users`;
                    if (form.id) {
                        method = 'PUT';
                        url = `/home/users/${form.id}`;
                    }
                    let postData = {
                        username: form.username,
                        password: form.password,
                        nickname: form.nickname,
                    };
                    this.$axios({
                        method: method,
                        url: url,
                        data: postData
                    }).then((res) => {
                        this.isUpdating = false;
                        this.dialogVisible = false;
                        this.getDataList();
                        this.$message.success('操作成功！');
                    }).catch((err) => {
                        this.$message.error(err);
                        this.isUpdating = false;
                    });
                })
            },
            handleReset(row) {
                this.resetForm = {
                    id: row.id,
                    username: row.username,
                    password: row.password,
                };
                this.dialogVisible_reset = true;
            },
            handleSubmitReset() {
                this.validateForm('resetForm', () => {
                    const {resetForm} = this;
                    this.isUpdating = true;
                    let method = 'PUT';
                    let url = `/home/users/${resetForm.id}/reset-password`;
                    let postData = {
                        password: resetForm.password,
                    };
                    this.$axios({
                        method: method,
                        url: url,
                        data: postData
                    }).then((res) => {
                        this.isUpdating = false;
                        this.dialogVisible_reset = false;
                        this.getDataList();
                        this.$message.success('操作成功！');
                    }).catch((err) => {
                        this.$message.error(err);
                        this.isUpdating = false;
                    });
                })
            },
            handleDel(row) {
                this.sureAgain(`确认是否移除 ${row.nickname} ?`, () => {
                    this.delAjax(row.id);
                })
            },
            delAjax(userId) {
                this.$axios({
                    method: 'DELETE',
                    url: `/home/users/${userId}`,
                }).then((res) => {
                    this.getDataList();
                    this.$message.success('操作成功！');
                }).catch((err) => {
                    this.$message.error(err);
                });
            },
            handelChangeRole(row, roleId) {
                const userId = row.id;
                this.setRoleAjax(userId, roleId).then(resp => {
                    this.getDataList();
                    this.$message.success('操作成功！');
                }).catch(err => {
                    this.$message.error(err);
                });
            },
            setRoleAjax(userId, roleId) {
                return new Promise((resolve, reject) => {
                    const {projectID} = this;
                    const postData = {
                        roleId: roleId,
                    };
                    this.$axios({
                        method: 'PUT',
                        url: `projects/${projectID}/members/${userId}`,
                        data: postData
                    }).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            clearTableSelectionAll() {
                this.$refs.multipleTable.clearSelection();
            },
            // 移除添加成员中选中的用户
            removeSelectUser(row) {
                const {multipleSelection} = this;
                multipleSelection.forEach((item, index) => {
                    if (item.id == row.id) {
                        this.multipleSelection.splice(index, 1);
                        this.clearTableSelection(row)
                    }
                })
            },
            clearTableSelection(row) {
                this.$refs.multipleTable.toggleRowSelection(row, false);
            },
            setSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }
            },
            formatDepartmentName(departmentID) {
                const {departments} = this;
                const department = departments.find(item => item.id == departmentID) || {};
                return department.name || '--';
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
            validateForm(formName, callback, errorCallback) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (callback && typeof callback === 'function') {
                            callback();
                        }
                    } else {
                        if (errorCallback && typeof errorCallback === 'function') {
                            errorCallback();
                        }
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
        }
    };
</script>

<style lang="scss">
    .role-choose-group{
        margin-bottom: 10px;
        .el-radio-group{
            .el-radio-button__inner{
                border: none;
                background-color: #fff!important;
                box-shadow: none!important;
            }
            .el-radio-button__orig-radio:checked+.el-radio-button__inner{
                color: #2993f2;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .dialog-content {
        height: 320px;
    }

    .choosed-panel {
        height: 100%;
        width: 160px;
        border-left: 1px solid #eee;
        padding-left: 15px;
        box-sizing: border-box;
        float: right;

        h3 {
            height: 30px;
            line-height: 30px;
            padding: 0;
            margin: 0;
            color: #000;
            font-size: 16px;
            border-bottom: 1px solid #eee;
        }

        .choosed-user-list {
            height: calc(100% - 30px);
            overflow: auto;

            .choosed-user-item {
                height: 26px;
                line-height: 26px;
                margin-bottom: 6px;
                cursor: default;

                &:hover {
                    background-color: rgb(244, 244, 244);
                }

                .el-icon-close {
                    height: 26px;
                    line-height: 26px;
                    float: right;
                    cursor: pointer;

                    &:hover {
                        color: red;
                    }
                }

                .choosed-username {
                    margin-right: 26px;
                    padding-left: 6px;
                }
            }
        }
    }

    .select-panel {
        margin-right: 160px;
        height: 100%;
    }
</style>
