<template>
    <div :class="['app-body', {'is-collapse': isCollapse}]">
        <Left :menuItems="menuItems"/>
        <div class="app-content-wrapper">
            <div class="app-content">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import Left from '@/components/Left';
    import Top from '@/components/Top/Top';
    import {mapState} from "vuex";

    export default {
        name: 'index',
        components: {Left, Top},
        props: ['menuItems'],
        data() {
            return {
                permissions: [],
                // isCollapse: false,
            };
        },
        computed: {
            ...mapState(['isCollapse'])
        },
        created() {
            // this.getUserInfo();
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
            collapseChange(isCollapse) {
                // if (isCollapse) {
                //     document.querySelector('.app-body').classList.add('is-collapse');
                // }else {
                //     document.querySelector('.app-body').classList.remove('is-collapse');
                // }
                // this.isCollapse = isCollapse;
            },
        }
    };
</script>

<style lang="scss">
    .app-body.is-collapse {
        .left {
            width: 64px;
            transition: width 0.25s;
        }
        .app-content-wrapper {
            margin-left: 64px;
            transition: margin 0.25s;
        }
    }
</style>
