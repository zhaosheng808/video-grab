<template>
    <!-- 选择人员 -->
    <el-dialog title="镜像管理"
               :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               width="720px">
        <div v-loading="isLoading"
             element-loading-spinner="el-icon-loading"
             element-loading-text="数据加载中...">
            <div class="operate-wrapper">
                <el-button size="small" type="primary" @click="handleUpload" icon="el-icon-upload2">上传</el-button>
                <el-button size="small" type="primary" @click="handleDownload" icon="el-icon-download">下载</el-button>
                <el-button size="small" type="danger" @click="handleDel" :loading="isDeleting" icon="el-icon-delete">
                    删除
                </el-button>
            </div>
            <el-table :data="dataList"
                      border
                      ref="multipleTable"
                      row-key="id"
                      @selection-change="handleSelectionChange"
                      stripe tooltip-effect="dark">
                <el-table-column
                    type="selection"
                    width="40">
                </el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="pullCommand" label="拉取命令" width="90px">
                    <template slot-scope="scope">
                        <i class="el-icon-document-copy" style="font-size: 20px;cursor: pointer;"
                           @click="handleCopyText(scope.row.pullCommand)"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="tag" label="tag" width="100px"></el-table-column>
                <el-table-column prop="size" label="大小" width="100px">
                    <template slot-scope="scope">
                        {{formatFileSize(scope.row.size)}}
                    </template>
                </el-table-column>
                <el-table-column prop="pushTime" label="更新时间" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.pushTime * 1000 | formatDate}}
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
        <!--上传弹框-->
        <el-dialog title="上传镜像"
                   :close-on-click-modal="false"
                   append-to-body
                   custom-class="padding-dialog"
                   :visible.sync="dialogVisible_add"
                   destroy-on-close
                   width="520px">
            <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px" @submit.native.prevent>
                <el-form-item label="tag" prop="tag">
                    <el-input size="small" v-model="form.tag" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="镜像文件" prop="fileData">
                    <Upload ref="fileUpload"
                            accept=".tar,.tar.gz"
                            :autoUpload="false"
                            :uploadAddress="uploadAddress"
                            v-on:onSuccess="uploadSuccess"
                            v-on:onChange="uploadChange"
                            v-on:onProgress="uploadProgress"
                            v-on:onError="uploadError"></Upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_add = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="isUpdating">确 定</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>

<script>
    import Upload from './Upload/FileUpload';
    import {copyText, downloadFile} from "../includes/common";
    import settings from "../includes/settings";
    /*镜像管理*/
    export default {
        name: 'ImageSelect',
        props: ['projectID'],
        components: {Upload},
        data() {
            return {
                dialogVisible_add: false,
                isLoading: false,
                isUpdating: false,
                isDeleting: false,
                dialogVisible: false,
                dataList: [],
                multipleSelection: [],
                total: 0,
                searchForm: {
                    page: 1,
                    pageSize: 10,
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
        computed: {
            uploadAddress() {
                const {projectInfo, applicationInfo, form} = this;
                let address = '';
                if (projectInfo) {
                    const projectName = projectInfo.name;
                    const name = applicationInfo.name;
                    const tag = form.tag;
                    address = `${settings.apiAddress}/projects/${projectName}/images/upload?name=${name}&tag=${tag}`;
                }
                return address;
            }
        },
        methods: {
            show(projectInfo, applicationInfo) {
                this.dialogVisible = true;
                this.projectInfo = projectInfo;
                this.applicationInfo = applicationInfo;
                this.handleSearch();
            },
            handleSearch() {
                this.searchForm.page = 1;
                this.getDataList();
            },
            getDataList() {
                this.isLoading = true;
                const {searchForm, projectInfo, applicationInfo} = this;
                const params = {
                    name: searchForm.keywords,
                    page: searchForm.page,
                    size: searchForm.pageSize,
                };
                this.$axios
                    .get(`/projects/${projectInfo.name}/applications/${applicationInfo.name}/images`, {
                        params: {...params}
                    })
                    .then((data) => {
                        this.dataList = data.data || [];
                        this.total = data.total;
                        this.isLoading = false;
                    })
                    .catch(err => {
                        this.isLoading = false;
                        console.log(err);
                    });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleUpload() {
                this.resetFields('ruleForm');
                this.form = {
                    tag: '',
                    fileData: null,
                };
                this.dialogVisible_add = true;
            },
            handleDownload() {
                const {multipleSelection} = this;
                if (multipleSelection.length == 0) {
                    this.$message.warning('请先选择一个镜像');
                    return;
                }
                multipleSelection.forEach(item => {
                    this.downloadAjax(item);
                });
            },
            downloadAjax(row) {
                const {applicationInfo, projectInfo} = this;
                const tag = row.tag;
                const projectName = projectInfo.name;
                let apiAddress = this.$store.state.apiAddress;
                let token = this.$store.state.token;
                const params = {
                    token: token,
                    name: applicationInfo.name, // 镜像名
                    tag: tag, // 镜像标签
                    compress: 1, // 压缩算法: 不传或传0代表不压缩，1代表gzip压缩
                };
                const url = `${apiAddress}/projects/${projectName}/images/download`;
                downloadFile(url, params);
            },
            handleDel() {
                const {multipleSelection} = this;
                if (multipleSelection.length == 0) {
                    this.$message.warning('请先选择一个镜像');
                    return;
                }
                this.isDeleting = true;
                const promiseArr = multipleSelection.map(item => {
                    return this.delAjax(item);
                })
                // 循环添加多个
                Promise.all(promiseArr).then((values) => {
                    this.isDeleting = false;
                    this.$message.success('操作成功！');
                    this.getDataList();
                }).catch(err => {
                    this.isDeleting = false;
                    this.$message.error(err);
                });
            },
            delAjax(row) {
                return new Promise((resolve, reject) => {
                    const {projectInfo} = this;
                    const projectName = projectInfo.name;
                    const appName = row.name;
                    const tagName = row.tag;
                    this.$axios({
                        method: 'DELETE',
                        url: `projects/${projectName}/applications/${appName}/images/${tagName}`,
                    }).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                })

            },
            handleCopyText(text) {
                copyText(text, () => {
                    this.$message.success('拉取命令已复制到粘贴板');
                });
            },
            // 提交镜像
            handleSubmit() {
                this.validateForm('ruleForm', () => {
                    this.isUpdating = true;
                    this.$refs['fileUpload'].start()
                })
            },

            startUpload(fileData) {
                // this.$refs['fileUpload'].handleUploadFile(fileData);
            },
            uploadSuccess() {
                this.$message.success('上传成功！');
                this.isUpdating = false;
                this.dialogVisible_add = false;
                this.getDataList();
            },
            uploadChange(e) {
                if (e) {
                    let files = e.target.files || e.dataTransfer.files;
                    this.form.fileData = files[0];
                } else {
                    this.form.fileData = null;
                }
            },
            uploadProgress() {
            },
            uploadError() {
                this.isUpdating = false;
            },
            // 格式化文件大小 B => K / M / G
            formatFileSize: (size) => {
                let sizeText = '';
                if (size >= 1024 * 1024 * 1024) {
                    sizeText = (size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
                } else if (size >= 1024 * 1024) {
                    sizeText = (size / 1024 / 1024).toFixed(2) + 'MB';
                } else {
                    sizeText = (size / 1024).toFixed(2) + 'KB';
                }

                return sizeText
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