<template>
    <div class="app-wrapper">
        <Top :username="username"
             :useravatar="useravatar"
             :usermenu="usermenu" :title="title" :logo="logoImg"/>
        <router-view></router-view>
    </div>
</template>

<script>
    import Left from '@/components/Left';
    import Top from '@/components/Top/Top';
    import logoImg from '../../static/logo.png';
    import settings from '@/includes/settings';

    export default {
        name: 'index',
        components: {Left, Top},
        data() {
            return {
                baseURL: __ROOT__,
                title: settings.siteName,
                username: '',
                userId: '',
                useravatar: '',
                logoImg: logoImg,
                usermenu: [
                    {
                        command: 'changePassword',
                        label: '修改密码',
                        url: '/user/info'
                    },
                    {
                        command: 'logout',
                        label: '注销',
                        url: '/logout'
                    }
                ],
                permissions: [],
                isCollapse: false,
            };
        },
        created() {
            this.getUserInfo();
            this.getServers();
        },
        methods: {
            // 获取用户信息
            getUserInfo() {
                this.$store.dispatch('FETCH_USER_INFO', {}).then(resp => {
                    this.username = resp.nickname;
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 获取用户权限
            getUserPermissions(userInfo) {
                // 获取用户信息
                this.$axios({
                    method: 'get',
                    url: `sysMenu/users/${userInfo.id}`,
                    data: {}
                }).then((res) => {
                    if (res.code === 1000) {
                        const data = res.data || [];
                        const permissions = data.map(item => {
                            return item.perms
                        })
                        this.permissions = permissions;
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            collapseChange(isCollapse) {

                this.isCollapse = isCollapse;
            },
            getServers() {
                this.$store.dispatch('FETCH_SERVICES', {}).then((resp) => {
                }).catch((err) => {
                });
            },
        }
    };
</script>

<style lang="scss">

</style>
