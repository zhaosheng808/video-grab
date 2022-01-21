<template>
    <SecondIndex :menuItems="filterMenuItems"></SecondIndex>
</template>

<script>
    import SecondIndex from '../SecondIndex';
    import { mapState } from 'vuex';
    export default {
        name: 'index',
        components: { SecondIndex },
        props: ['settings'],
        data() {
            return {
                activeIndex: 'index',
                menuItems: [
                    {name: '用户管理', index: '/home/user', isAdminPermission: true, key: '', icon: 'el-icon-s-custom', subnavs: []},
                    {name: '应用管理', index: '/home/application', key: '', icon: 'el-icon-s-platform', subnavs: []},
                    // {name: '服务管理', index: '/home/service', key: '', icon: 'el-icon-menu', subnavs: []},
                ],
            };
        },
        computed: {
            filterMenuItems() {
                const {menuItems, username} = this;
                const filterData = menuItems.filter(item => {
                    let hasPermission = true;
                    if (username != 'admin') {
                        if (item.isAdminPermission) {// 超管才有的权限
                            hasPermission = false;
                        }
                    }
                    return hasPermission;
                })
                return filterData;
            },
            ...mapState(['username']),
        },
        created() {

        },
        methods: {}
    };
</script>

<style lang="scss">
</style>
