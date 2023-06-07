<template>
  <div id="app">
    <router-view />
    <div class="cover">
      <img :src="baseUrl + 'image/rotate-tip.jpg'" class="tip" />
    </div>
  </div>
</template>

<script>
// import util from '@/libs/util'
export default {
  name: "app",
  data() {
    return {
      baseUrl:
        process.env.NODE_ENV === "development"
          ? "/"
          : "http://h5.zwlearn.com/rongwei-xunzhan_2022-03-30/admin/",
    };
  },

  //  watch: {
  //   '$i18n.locale': 'i18nHandle'
  // },
  // created () {
  //   this.i18nHandle(this.$i18n.locale)
  // },
  // methods: {
  //   i18nHandle (val, oldVal) {
  //     util.cookies.set('lang', val)
  //     document.querySelector('html').setAttribute('lang', val)
  //   }
  // }
};
</script>

<style lang="scss">
@import "~@/assets/style/public-class.scss";
.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; // 为了遮住首页按钮
  // @media screen and (min-aspect-ratio: 1/1) {
  @media screen and (orientation: landscape) {
    display: none;
  }
  img.tip {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    background: #010101;
  }
}
</style>

<style lang="less">
// 手机端硬适配
@media screen and (max-width: 1000px) {
  // 缩小datePicker弹窗
  .el-picker-panel.el-popper {
    transform: scale(0.8);
  }
}
</style>