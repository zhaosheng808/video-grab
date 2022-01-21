<template>
    <div class="app-content-inner">
        <div class="top-nav">
            日志管理
        </div>
        <div class="app-page-wrapper">
            <div class="app-page-inner">
                <div class="app-page-content">
                    <div class="tab-search-header">
                        <el-form class="search-form" :model="searchForm" inline @submit.native.prevent>
                            <el-form-item label="资源类型">
                                <el-select size="small"
                                           style="width: 150px;"
                                           placeholder="请选择资源类型"
                                           @change="handleSearch"
                                           clearable
                                           v-model="searchForm.resourceType">
                                    <el-option
                                        v-for="item in resourceTypeArr"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="操作类型">
                                <el-select size="small"
                                           style="width: 150px;"
                                           placeholder="请选择资源类型"
                                           @change="handleSearch"
                                           clearable
                                           v-model="searchForm.operation">
                                    <el-option
                                        v-for="item in operationArr"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input placeholder="资源关键词"
                                          style="width: 150px;"
                                          size="small"
                                          clearable
                                          v-model.trim="searchForm.resource"
                                          @keyup.enter.native="handleSearch">
                                    <!--<i class="el-icon-search el-input__icon"
                                       slot="suffix"
                                       @click="handleSearch">
                                    </i>-->
                                </el-input>
                            </el-form-item>
                            <el-form-item label="操作人">
                                <el-input placeholder=""
                                          style="width: 150px;"
                                          size="small"
                                          clearable
                                          v-model.trim="searchForm.username"
                                          @keyup.enter.native="handleSearch">
                                </el-input>
                            </el-form-item>
                            <!--<el-form-item label="时间范围">
                                <el-date-picker
                                    style="width: 250px;"
                                    v-model="searchForm.dateRange"
                                    type="daterange"
                                    :picker-options="pickerOptions"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    align="right">
                                </el-date-picker>
                            </el-form-item>-->
                            <el-form-item label="">
                                <el-button size="mini" type="primary" @click="handleSearch"
                                           icon="el-icon-search"></el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table
                        :data="dataList"
                        stripe>
                        <el-table-column
                            prop="id"
                            width="100"
                            label="ID">
                        </el-table-column>

                        <el-table-column
                            prop="resource"
                            min-width="150"
                            label="资源">
                        </el-table-column>
                        <el-table-column
                            width="150"
                            prop="resourceType"
                            label="资源类型">
                        </el-table-column>
                        <!--            <el-table-column-->
                        <!--                prop="nickname"-->
                        <!--                label="昵称">-->
                        <!--            </el-table-column>-->
                        <el-table-column
                            prop="operation"
                            width="150"
                            label="操作类型">
                            <template slot-scope="scope">
                                {{scope.row.operation}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="username"
                            width="200"
                            label="操作人">
                        </el-table-column>
                        <el-table-column
                            prop="operationTime"
                            width="180"
                            label="操作时间">
                            <template slot-scope="scope">
                                {{scope.row.operationTime * 1000 | formatDate}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页-->
                    <div class="pagination-wrapper">
                        <el-pagination
                            @current-change="pageChange"
                            layout="total, prev, pager, next, jumper"
                            :current-page.sync="page"
                            :page-size="pageSize"
                            :total="total"
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: 'Logs',
        props: [''],
        data() {
            return {
                isUpdating: false,
                searchForm: {
                    resourceType: '',
                    resource: '',
                    page: 1,
                    pageSize: 10,
                    dateRange: []
                },
                dataList: [],
                pageSize: 10,
                page: 1,
                total: 0,
                resourceTypeArr: [
                    {name: 'artifact', value: 'artifact'},
                    {name: 'project', value: 'project'},
                    {name: 'repository', value: 'repository'},
                    {name: 'tag', value: 'tag'},
                ],
                operationArr: [
                    {name: 'create', value: 'create'},
                    {name: 'pull', value: 'pull'},
                    {name: 'delete', value: 'delete'},
                ],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            };
        },
        watch: {},
        computed: {
            ...mapState(['departments']),
        },
        created() {
            this.handleSearch();
        },
        mounted() {
        },
        methods: {
            handleSearch() {
                this.page = 1;
                this.getDataList();
            },
            pageChange() {
                this.getDataList();
            },
            // 获取当前数据列表
            getDataList() {
                const {page, pageSize, departmentID, searchForm} = this;
                const params = {
                    page: page,
                    size: pageSize,
                    resource: searchForm.resource,
                    username: searchForm.username,
                    operation: searchForm.operation,
                    'resource_type': searchForm.resourceType,
                };
                this.$axios({
                    method: 'get',
                    url: `/logs`,
                    params: params
                }).then((res) => {
                    this.dataList = res.data || [];
                    this.total = res.total || 0;
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
    };
</script>

<style lang="scss" scoped>
    .app-page-wrapper {
        height: calc(100vh - 58px);
        padding-top: 65px;
        box-sizing: border-box;

        .app-page-inner {
            padding: 20px;
            min-height: 100%;
            box-sizing: border-box;
            overflow: auto;
            background-color: #ffffff;
        }
    }

    .top-nav {
        font-size: 16px;
        height: 44px;
        line-height: 44px;
        background-color: #ffffff;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        padding: 0 25px;
        box-sizing: border-box;

        a {
            color: #333333;
            margin-right: 25px;
            text-decoration: none;
        }

        .router-link-active {
            color: #006EFF;
        }
    }

    .app-page-content {

    }
</style>
