<template>
    <div class="app-page-content">
        <div class="tab-search-header" style="margin-bottom: 10px;">
            <div class="btn_group">
                <el-button type="primary" size="small" @click="handleAdd">添加应用</el-button>
            </div>
        </div>
        <el-table
            :data="dataList"
            stripe>
            <el-table-column
                prop="id"
                label="ID"
                width="100">
            </el-table-column>
            <el-table-column
                prop="name"
                label="应用名称">
            </el-table-column>
            <el-table-column
                prop="description"
                label="应用描述">
            </el-table-column>
            <el-table-column
                prop="systemName"
                label="系统名称">
            </el-table-column>
            <el-table-column label="操作" width="180">
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
                        @click="handleDel(scope.row, scope.$index)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
<!--        <div class="pagination-wrapper">-->
<!--            <el-pagination-->
<!--                @current-change="pageChange"-->
<!--                layout="total, prev, pager, next, jumper"-->
<!--                :current-page.sync="page"-->
<!--                :page-size="pageSize"-->
<!--                :total="total"-->
<!--            ></el-pagination>-->
<!--        </div>-->

        <!-- 新增弹框-->
        <el-dialog :title="`${form.id ? '编辑' : '添加'}应用`"
                   :visible.sync="dialogVisible"
                   width="540px"
                   :close-on-click-modal="false">
            <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="应用名称：" prop="name">
                    <el-input v-model="form.name"
                              :disabled="Boolean(form.id)"
                              maxlength="20"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="应用描述：" prop="description">
                    <el-input type="textarea"
                              v-model="form.description"
                              :autosize="{minRows: 3}"
                              maxlength="150"
                              show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="系统名称：" prop="systemName">
                    <el-input v-model="form.systemName"
                              maxlength="20"
                              show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" :loading="isUpdating" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'Service',
        props: [''],
        data() {
            return {
                dialogVisible: false,
                isUpdating: false,
                searchForm: {
                    size: 10,
                    page: 1,
                    keywords: '',
                },

                dataList: [],
                form: {
                    name: '',
                    description: '',
                    systemName: '',
                    services: [],
                    client_address_patterns: [],
                },
                total: 0,
                rules: {
                    name: {required: true, message: '请输入应用名称'},
                    description: {required: true, message: '请输入应用描述'},
                    systemName: {required: true, message: '请输入系统名称'},
                },
                multipleSelection: [], // 当前页选中的数据

            };
        },
        computed: {},
        created() {
            this.getDataList();
        },
        mounted() {
        },
        methods: {
            getDataList() {
                this.$axios.get(`/home/services`).then(resp => {
                    this.dataList = resp;
                }).catch(err => {
                    this.$message.error(err);
                })
            },
            handleSearch() {
                this.searchForm.page = 1;
                this.getDataList();
            },
            pageChange() {
                this.getDataList();
            },

            handleAdd() {
                this.resetFields('ruleForm');
                this.form = {
                    id: null,
                    name: '',
                    description: '',
                    systemName: '',
                    services: [],
                    clientAddressPatterns: [],
                };
                this.dialogVisible = true;
            },
            handleEdit(row) {
                this.resetFields('ruleForm');
                this.form = {
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    systemName: row.systemName,
                    services: row.services || [],
                    clientAddressPatterns: row.clientAddressPatterns || [],
                };
                this.dialogVisible = true;
            },

            handleSubmit() {
                this.validateForm('ruleForm', () => {
                    const {form} = this;
                    this.isUpdating = true;
                    let method = 'POST';
                    let url = `/home/applications`;
                    if (form.id) {
                        method = 'PUT';
                        url = `/home/applications/${form.id}`;
                    }
                    let postData = {
                        name: form.name,
                        description: form.description,
                        services: form.services,
                        clientAddressPatterns: form.clientAddressPatterns,
                        systemName: form.systemName,
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
            handleDel(row) {
                this.sureAgain(`确认是否删除 ${row.name} ?`, () => {
                    this.delAjax(row.id);
                })
            },
            delAjax(id) {
                const {projectID} = this;
                this.$axios({
                    method: 'DELETE',
                    url: `/home/applications/${id}`,
                }).then((res) => {
                    this.getDataList();
                    this.$message.success('操作成功！');
                }).catch((err) => {
                    this.$message.error(err);
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


<style lang="scss" scoped>

</style>
