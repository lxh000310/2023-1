<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{this.name ? `你好 ${this.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="changePassword">
        <d2-icon name="power-off" class="d2-mr-5" />
        修改密码
      </el-dropdown-item>
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5" />
        注销
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import util from '@/libs/util.js'
  export default {
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    data() {
      return {
        name: ""
      }
    },
    created() {
      this.name = util.cookies.get('name');
    },
    methods: {
      ...mapActions('d2admin/account', [
        'logout'
      ]),

      /**
       * @description 登出
       */
      logOff() {
        this.logout({
          confirm: true
        })
        UserRole = [];
      },

      changePassword() {
        this.$router.push({ path: '/updatePassword' })

      }
    }
  }

</script>
