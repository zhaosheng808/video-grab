<template>
    <div class="left">
        <div class="collapse-button" @click="handleCollapseChange">
            <i v-if="!isCollapse" class="icon-left"></i>
            <i v-else class="icon-right"></i>
            <span v-if="!isCollapse">收起侧边栏</span>
        </div>
        <el-menu
            :default-active="onRoutes"
            :collapse="isCollapse"
            class="el-menu-vertical-left"
            text-color="#AEAEAE"
            background-color="#1E222D"
            active-text-color="#ffffff"
            unique-opened
            router>
            <template v-for="nav in menuItems">
                <!--有二级菜单-->
                <template v-if="nav.subnavs && nav.subnavs.length > 0">
                    <el-submenu :index="nav.index">
                        <template slot="title">
                            <i :class="nav.icon"></i>
                            <span slot="title">{{nav.name}}</span>
                        </template>
                        <el-menu-item v-for="subNav in nav.subnavs"
                                      :key="subNav.index"
                                      @click="handleCommend(subNav)"
                                      :index="subNav.index">
                            {{subNav.name}}
                            <el-dropdown v-if="subNav.commends && !isCollapse" size="medium">
                                <i v-if="!isCollapse" class="el-icon-more commend-icon"></i>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="commendItem in subNav.commends"
                                                      @click.native="handleMenuCommend(commendItem.commend, subNav)"
                                                      :key="commendItem.commend">{{commendItem.name}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-menu-item>
                    </el-submenu>
                </template>
                <!--只有一级菜单-->
                <template v-else>
                    <el-menu-item :index="nav.index" :key="nav.index">
                        <i :class="nav.icon"></i>
                        <span slot="title">{{nav.name}}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>

    </div>
</template>

<script>
    import SubMenu from './SubMenu.vue';
    import AppSelect from '@/components/AppSelect'
    import {mapState} from 'vuex'

    export default {
        name: 'left',
        props: ['menuItems'],
        components: {
            SubMenu,
            AppSelect
        },
        data: function () {
            return {
                isUpdating: false,
                // isCollapse: false,
            };
        },
        computed: {
            onRoutes: function () {
                let path = this.$route.path;
                const pathArr = path.split('/');
                const urlArr = pathArr.slice(0, 4);
                let urlString = urlArr.join('/');
                if (urlString == '/mps/audiototext/setting') {
                    urlString = '/mps/audiototext/task'
                }
                return urlString;
                // return this.$route.path.replace('/', ''); // $route.path表示当前路由，:index能直接跳转路由
            },
            // 根据用户权限展现有权限的菜单
            filterNavItems: function () {
                let permissionsNav = [];
                this.navitems.forEach(item => {
                    if (this.permissions.indexOf(item.key) > -1 || !item.key) {
                        permissionsNav.push(item);
                    }
                })
                return permissionsNav
            },
            ...mapState(['isCollapse'])
        },
        mounted() {

        },
        methods: {
            handleCollapseChange() {
                this.$store.commit('SET_COLLAPSE', !this.isCollapse);
            },
        },
    };
</script>

<style lang="scss">

    .left {
        background-color: #1E222D;
        overflow: hidden !important;
    }

    .el-menu-vertical-left:not(.el-menu--collapse) {
        width: 200px; //宽度自己掌握
        height: calc(100% - 46px);
    }

    .collapse-button {
        width: 100%;
        height: 46px;
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #262F3E;
        cursor: pointer;
        display: flex;
        color: #fff;
        align-items: center;
        z-index: 2;
        &:hover {
            background-color: rgba(38, 47, 62, 0.7);
        }

        i {
            width: 30px;
            height: 30px;
            display: block;
            margin: 10px 16px;
            background-image: url('../assets/images/left/left.png');
            background-repeat: no-repeat;
            background-size: contain;
        }

        .icon-right {
            transform: rotate(180deg);
            /*background-image: url('../assets/images/left/right.png');*/
        }
    }

    .left .el-submenu {
        .el-menu-item {
            padding-left: 54px !important;
            padding-right: 0;
            overflow: hidden;

            .el-dropdown {
                float: right;
            }

            .commend-icon {
                font-size: 12px;
                color: #f7f7f7;
                transform: rotate(90deg);
            }
        }
    }
</style>
