<template>
  <d2-container type="ghost">
    <template #header>
      <h3 class="index-title" v-show="!$store.state.d2admin.fullscreen.active">
        {{ customizeOption.index.title }}2022年巡展
      </h3>
    </template>

    <div class="d2-p d2-mt white">
      <div
        style="position: absolute; top: 0; right: 0; z-index: 1"
        v-if="isMobile"
      >
        <d2-header-fullscreen/>
      </div>
      <!-- <el-button
        icon="el-icon-download"
        type="primary"
        @click="downloadAllSite"
        style="margin-left: 0.5em"
        size="small"
        :loading="downloadingAllSite"
        >导出全部数据</el-button
      > -->
      <!-- <el-button
        type="primary"
        @click="test"
        style="margin-left: 0.5em"
        size="small"
        >test</el-button
      > -->
      <div class="box" v-loading="gettingAllSite">
        <div
          class="box-item"
          v-for="item in formattedSiteArr"
          :key="item.id"
          @click="enterSpecificSite(item.id)"
        >
          <p>{{ `${item.name}(${item.begin}-${item.deadline})` }}</p>
          <i
            :class="[
              'icon',
              item.downloading ? 'el-icon-loading' : 'el-icon-download',
            ]"
            @click.stop="downloadSpecificSite(item.id)"
          ></i>
        </div>
      </div>
    </div>
  </d2-container>
</template>
<script>
import {mapActions} from "vuex";
import * as APIs from "@/api/groupedApi";
import {menuHeader, menuAside} from "@/menu";
// window.APIs = APIs; // 调试
import * as Utils from "@/utils";
import FileInputImg from "@/components/file-input-img";
import d2HeaderFullscreen from "@/layout/header-aside/components/header-fullscreen";
import customizeOption from "@/customize.js";
import {getRealSurveillanceVideoUrl} from "@/customize.js";

export default {
  name: "index",
  components: {
    FileInputImg,
    d2HeaderFullscreen,
  },
  data() {
    return {
      customizeOption,
      isMobile: window.outerWidth < 1000,
      gettingAllSite: false,
      downloadingAllSite: false,
      siteArr: Array(0)
        .fill(true)
        .map((item, index) => ({
          id: index,
          name: "郑州站",
          begin: "2022-03-28T03:00:29.282Z",
          deadline: "2022-04-28T03:00:29.282Z",
          downloading: false,
        })),
      loadingSiteSet: new Set(), //存放loading站点id的集合
    };
  },
  computed: {
    formattedSiteArr() {
      return this.siteArr.map((item) => {
        function formatte(str) {
          return new Date(str)
            .toLocaleDateString()
            .replace(/^(\d+)\/(\d+)\/(\d+)/, (...args) => {
              // console.log(args);
              return args[2] + "月" + args[3] + "日";
            });
        }

        return {
          ...item,
          begin: formatte(item.begin),
          deadline: formatte(item.deadline),
          downloading: this.loadingSiteSet.has(item.id),
        };
      });
    },
  },
  watch: {},
  // 方法集合
  methods: {
    async test() {
      const deviceWidth = Math.max(screen.width, screen.height); // 取较长的为宽
      // await this.$message('deviceWidth'+deviceWidth);
      const fixedWidth = 990; // 显示效果较好的某个宽度
      const scale = deviceWidth > fixedWidth ? 1 : deviceWidth / fixedWidth;
      // await this.$message('scale'+scale);
      const meta = document.querySelector("meta[name=viewport]");
      meta.content = `width=device-width,initial-scale=${scale},maximum-scale=${scale},user-scalable=no`;
    },
    async downloadAllSite() {
      this.downloadingAllSite = true;
      const notify1 = this.$notify({
        title: "导出文件准备中",
        message: "准备工作会在后台进行，你可以选择进行其他操作",
        duration: 0,
      });
      const res = await APIs.ActiveData_downloadAllMobile().finally(() => {
        this.downloadingAllSite = false;
        notify1.close();
      });
      console.log(7, res);
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      }); // 转化为blob对象
      let filename = new Date().toLocaleString() + "数据.xls"; // 判断是否使用默认文件名
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
        const tempLink = document.createElement("a"); // 创建一个a标签
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename); // 给a标签添加下载属性
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink); // 将a标签添加到body当中
        tempLink.click(); // 启动下载
        document.body.removeChild(tempLink); // 下载完毕删除a标签
        window.URL.revokeObjectURL(blobURL);
      }
      console.log("-----------download done-----------");
    },
    async downloadSpecificSite(siteId) {
      if (this.loadingSiteSet.has(siteId)) {
        return;
      }
      this.loadingSiteSet = new Set(this.loadingSiteSet.add(siteId));
      const notify1 = this.$notify({
        title: "导出文件准备中",
        message: "准备工作会在后台进行，你可以选择进行其他操作",
        duration: 0,
      });
      const res = await APIs.ActiveData_downloadMobileBySite({
        siteId,
        stayMin: customizeOption.index.downloadMobileBySite.stayMin,
        stayMax: customizeOption.index.downloadMobileBySite.stayMax,
      }).finally(() => {
        this.loadingSiteSet.delete(siteId);
        this.loadingSiteSet = new Set(this.loadingSiteSet);
        notify1.close();
      });
      console.log(7, res);
      let blob = new Blob([res], {
        type: "application/vnd.ms-excel",
      }); // 转化为blob对象
      let filename = new Date().toLocaleString() + "数据.xls"; // 判断是否使用默认文件名
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
        const tempLink = document.createElement("a"); // 创建一个a标签
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename); // 给a标签添加下载属性
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink); // 将a标签添加到body当中
        tempLink.click(); // 启动下载
        document.body.removeChild(tempLink); // 下载完毕删除a标签
        window.URL.revokeObjectURL(blobURL);
      }
    },
    enterSpecificSite(siteId) {
      console.log("enter", siteId);
      this.$router.replace({
        name: "site",
        params: {
          siteId,
        },
      });
    },
    getAllSite() {
      this.gettingAllSite = true;
      APIs.Site_page()
        .then((res) => {
          if (res.code === 0) {
            const arr = res.data.list;
            if (this.customizeOption.configurable) {
              this.siteArr = arr;
            } else {
              this.siteArr = arr.filter((site) => {
                const {option} = getRealSurveillanceVideoUrl(
                  site.surveillanceVideo
                );
                return option && option.index.visible;
              });
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.gettingAllSite = false;
        });
    },

    console_log(...args) {
      console.log(...args);
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.test(); // 初始化meta的viewport
    // this.getAllSite();
    this.$store.dispatch("d2admin/menu/asideCollapseSet", true);
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
  },
  beforeCreate() {
  }, // 生命周期 - 创建之前
  beforeMount() {
  }, // 生命周期 - 挂载之前
  beforeUpdate() {
  }, // 生命周期 - 更新之前
  updated() {
  }, // 生命周期 - 更新之后
  beforeDestroy() {
  }, // 生命周期 - 销毁之前
  destroyed() {
  }, // 生命周期 - 销毁完成
  activated() {
    console.log("activated");
    this.getAllSite();
  }, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang="less" scoped>
.white {
  background: white;
  border-radius: 4px;
  border: 1px solid #cfd7e5;
}

.ep-input {
  width: 80%;
  position: absolute;
  right: 5%;
}

.ep-select {
  position: absolute;
  left: 15%;
}

.form1 {
  .item1 {
    display: flex;
    justify-content: space-between;

    .left {
      flex: auto;

      .input {
        max-width: 20em;
        margin-right: 0.7em;
      }
    }
  }
}

.upload {
  transform-origin: 0 0;
  transform: scale(0.5);

  .btn-box {
    transform: scale(2);
  }
}

.sku-item {
  display: flex;
  justify-content: center;
  align-items: center;

  .input {
    max-width: 10em;
    margin-right: 0.7em;

    &:nth-of-type(3) {
      max-width: initial;
    }
  }
}

.box {
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  margin-top: 1em;

  .box-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.75em;
    width: 20em;
    height: 4em;
    margin: 0.5em;
    // background: #0007;
    outline: 2px solid #d9d9d9;
    color: #333;
    cursor: pointer;

    &:hover {
      outline-width: 3px;
    }

    i.icon {
      position: absolute;
      bottom: 0;
      right: 0;
      // background:#0007;
      font-size: 1.5em;
      cursor: pointer;
      color: #d9d9d9;

      &:not(.el-icon-loading):hover {
        background: #409eff;
        color: white;
      }
    }
  }
}

.index-title {
  text-align: center;
  font-weight: normal;
  margin: 0;
}

// 手机端硬适配
@media screen and (max-width: 1000px) {
  .index-title {
    // background: red;
    font-size: 1em;
  }

  .white {
    margin-top: 1px !important;
  }

  /deep/ .d2-container-ghost__header {
    padding: 0 !important;
  }

  .box {
    margin-top: 4px !important;
  }

  .white {
    padding-top: 8px !important;
  }
}
</style>
