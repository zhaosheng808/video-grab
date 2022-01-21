<template>
  <div class="center">正在注销...</div>
</template>

<script>
  export default {
    name: 'logout',
    mounted: function () {
      this.$store.dispatch('LOGOUT', null).then((resp) => {
        this.jump();
      }).catch((err) => {
        this.jump();
      });
    },
    methods: {
      jump() {
        location.href = '/';
      }
    }
  };
</script>

<style lang="scss">
  .center {
    width: 200px;
    height: 30px;
    font-size: 24px;
    line-height: 30px;
    position: fixed;
    top: 30vh;
    left: calc(50vw - 100px);
  }
</style>
