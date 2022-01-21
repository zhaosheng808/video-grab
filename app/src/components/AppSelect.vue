<template>
    <!-- 导出项目 选择应用弹框 -->
    <el-dialog title="导出项目"
               :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               width="520px">
        <div v-loading="isLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-text="数据加载中...">
            <div class="operate-wrapper" style="float: right">
                <el-button size="small"
                           type="primary"
                           @click="handleDownload"
                           :loading="isUpdating"
                           icon="el-icon-download">导出</el-button>
            </div>
            <el-table :data="dataList"
                      border
                      ref="multipleTable"
                      row-key="id"
                      max-height="400"
                      @selection-change="handleSelectionChange"
                      stripe tooltip-effect="dark">
                <el-table-column
                    type="selection"
                    width="40">
                </el-table-column>
                <el-table-column prop="name" label="项目名称"></el-table-column>
                <el-table-column prop="tag" label="镜像tag" width="150">
                    <template slot-scope="scope">
                        <el-select size="mini"
                                   style="width: 120px;"
                                   placeholder="请选择tag"
                                   v-model="scope.row.tag">
                            <el-option
                                v-for="item in scope.row.tags"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper">
                <el-pagination
                    @current-change="getDataList"
                    layout="total, prev, pager, next, jumper"
                    :current-page.sync="searchForm.page"
                    :page-size="searchForm.pageSize"
                    :total="total"
                ></el-pagination>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    /*镜像管理*/
    export default {
        name: 'AppSelect',
        props: [],
        components: {},
        data() {
            return {
                isLoading: false,
                isUpdating: false,
                isDeleting: false,
                dialogVisible: false,
                dataList: [],
                multipleSelection: [],
                total: 0,
                searchForm: {
                    page: 1,
                    pageSize: 100,
                },
                form: {
                    tag: '',
                    fileData: null,
                },
                projectInfo: null, // 项目信息
                applicationInfo: null, // 应用信息
                rules: {
                    tag: {required: true, message: '镜像tag不能为空'},
                    fileData: {required: true, message: '镜像文件不能为空'},
                },

                // uploadAddress: '',
            };
        },
        computed: {},
        methods: {
            show(projectInfo) {
                this.dialogVisible = true;
                this.projectInfo = projectInfo;
                this.handleSearch();
            },
            handleSearch() {
                this.searchForm.page = 1;
                this.getDataList();
            },
            getDataList() {
                this.isLoading = true;
                const {searchForm, projectInfo} = this;
                const params = {
                    name: searchForm.keywords,
                    page: searchForm.page,
                    size: searchForm.pageSize,
                };
                this.$axios({
                    method: 'get',
                    url: `projects/${projectInfo.name}/applications`,
                    params: params
                }).then((res) => {
                    this.isLoading = false;
                    this.total = res.total || 0;
                    const dataList = res.data || [];
                    dataList.forEach(item => {
                        item.tag = item.tags[0];
                    })
                    this.dataList = dataList;

                }).catch((err) => {
                    this.isLoading = false;
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleDownload() {
                const {multipleSelection, projectInfo} = this;
                if (multipleSelection.length == 0) {
                    this.$message.warning('请先选择一个项目！');
                    return;
                }
                let imageArr = multipleSelection.map(item => {
                    return {
                        name: item.name,
                        tag: item.tag
                    }
                });
                // 过滤掉没有tag的镜像
                imageArr = imageArr.filter(item => item.tag);
                if (imageArr.length == 0) {
                    this.$message.warning('镜像列表为空！')
                    return;
                }
                const postData = {
                    images: imageArr
                }
                this.isUpdating = true;
                this.$axios({
                    method: 'POST',
                    url: `/projects/export?id=${projectInfo.id}`,
                    data: postData,
                    responseType: 'blob' // 表明返回服务器返回的数据类型
                }).then((res) => { // 处理返回的文件流
                    const content = res
                    const blob = new Blob([content])
                    const fileName = `${projectInfo.name}.zip`
                    this.isUpdating = false;
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                }).catch(err => {
                    this.isUpdating = false;
                    this.$message.error(err);
                })
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
        }
    }
</script>
<style scoped>
    .operate-wrapper {
        margin-bottom: 10px;
    }
</style>