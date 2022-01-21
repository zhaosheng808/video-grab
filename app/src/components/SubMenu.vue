<template>
  <div class="">
    <template v-for="item in menuData">
      <el-submenu v-if="item.children && item.children.length > 0"
                  :index="item.index" v-bind:key="item.index"
                  class="submenu">
        <template slot="title">
          <template v-if="item.type == 1">
            <el-menu-item :index="item.index" style="padding: 0;">
              <div style="width: 1px; height: 100%; display: inline-block;"></div>
              <span :title="item.name">{{ item.name }}</span>
            </el-menu-item>
          </template>
          <template v-else>
            <div style="width: 1px; height: 100%; display: inline-block;"></div>
            <span :title="item.name">{{ item.name }}</span>
          </template>
        </template>
        <SubMenu :menuData="item.children"></SubMenu>
      </el-submenu>
      <el-menu-item :index="item.index" v-else>
        <div style="width: 1px; height: 100%; display: inline-block;"></div>
        <span :title="item.name">{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>


<script>
  export default {
    name: 'SubMenu',
    props: ['menuData']
  };
</script>

<style lang="scss">
  .left {
    overflow: auto;

    .el-menu {
      border-right: none;
    }
  }

  .left > ul .submenu {
    .el-submenu__title {
      background-color: rgb(47, 49, 51) !important;
    }
  }

</style>