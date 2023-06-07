<template>
  <el-tooltip effect="dark" :content="aboutMessage" placement="bottom">
    <el-button class="d2-ml-0 d2-mr btn-text can-hover" type="text" @click="handleClick">
      <d2-icon  name="commenting" style="font-size: 20px"/>
    </el-button>
  </el-tooltip>
</template>

<script>
  export default {
    data () {
      return {
        aboutMessage:"查看消息列表"
      }
    },
    computed: {
    },
    methods: {

      handleClick () {
        this.$router.push('/message');
      },
    },
    created () {
    },
  }
</script>
