<template>
  <d2-container @click.native="pageClick" ref="d2-container">
    <el-alert
      :title="activeInfo"
      type="success"
      effect="dark"
      :closable="false"
      style="margin-bottom: .7em;"
    >
    </el-alert>
    <!-- query form -->
    <el-form :inline="true" class="form1" v-loading="dialogChange._fetching">
      <div>
        <h3 style="display: flex;justify-content: space-between;">
          <span>基本信息</span>
          <el-button type="primary" @click="refresh2()">刷新</el-button>
        </h3>
        <el-form :inline="true" class="">
          <el-form-item label="活动名称:">
            <el-input v-model="dialogChange.name"></el-input>
          </el-form-item>
          <el-form-item label="活动代码:">
            <el-input v-model="dialogChange.code"></el-input>
          </el-form-item>
          <el-form-item label="发布状态:">
            <el-switch
              v-model="dialogChange.relState"
              style="margin-left: 1em;"
              inactive-text="未发布"
              active-text="已发布"
              :inactive-value="0"
              :active-value="1"
            >
            </el-switch>
          </el-form-item>
          <div>
            <el-form-item label="活动时间:">
              <el-date-picker
                v-model="dialogChange.activeDuration"
                type="datetimerange"
                :picker-options="dialogChange._pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效下单时间:">
              <el-date-picker
                v-model="dialogChange.orderDuration"
                type="datetimerange"
                :picker-options="dialogChange._pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效核销时间:">
              <el-date-picker
                v-model="dialogChange.signDuration"
                type="datetimerange"
                :picker-options="dialogChange._pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <h3>关联商品</h3>
          <h4 style="color:red;">
            请上传小于1M的图片，并使图片之间宽高比保持一致
          </h4>
          <!-- <div class="sku-item" v-for="(item, index) in dialogChange.skuArr">
						<el-input readonly class="input" placeholder="商品类型" v-model="item.type"></el-input>
						<el-input readonly class="input" placeholder="商品ID" v-model="item.sid"></el-input>
						<el-input readonly class="input" placeholder="商品名称" v-model="item.name"></el-input>
						<img :src="item._url" alt="" style="width: 4em;height: 4em;flex: 0 0 4em;object-fit: contain;">
						<el-button type="primary" icon="el-icon-minus" @click="skuDelete_change(item, index)"></el-button>
					</div>
					<div class="sku-item" v-for="(item) in [dialogChange._skuItem]">
						<el-input class="input" placeholder="商品类型" v-model="item.type"></el-input>
						<el-input class="input" placeholder="商品ID" v-model="item.sid"></el-input>
						<el-input class="input" placeholder="商品名称" v-model="item.name"></el-input>
						<el-upload action="#" list-type="picture-card" :auto-upload="false" :multiple="false" class="upload" :limit="1" :on-exceed="skuPictureExceed_change" ref="upload_change" :on-change="skuPictureChange_change">
							<template #default>
								<i class="el-icon-plus"></i>
							</template>
							<template #file="{file}">
								<div>
									<img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
									<span class="el-upload-list__item-actions btn-box">
										<span class="el-upload-list__item-delete" @click="skuPictureRemove_change()">
											<i class="el-icon-delete"></i>
										</span>
									</span>
								</div>
							</template>
						</el-upload>
						<el-dialog :visible.sync="item._previewOpen" append-to-body>
							<img width="100%" :src="item._url" alt="">
						</el-dialog>
						<el-button type="primary" icon="el-icon-plus" @click="skuPush_change"></el-button>
					</div> -->
        </el-form>
      </div>
      <InlineEditableTable
        :data="dialogChange.skuArr"
        @remove="skuDelete_change($event[0], $event[1])"
        @add="skuPush_change()"
        :skuItem="dialogChange._skuItem"
        ref="InlineEditableTable"
      ></InlineEditableTable>
    </el-form>
    <!-- <el-dvider></el-dvider> -->
    <template #footer>
      <div style="text-align: center;">
        <el-button
          type="primary"
          @click="changeActive()"
          :loading="dialogChange._fetching"
          >确认更改</el-button
        >
      </div>
    </template>
  </d2-container>
</template>
<script>
import { mapActions } from "vuex";
import * as APIs from "@/api/groupedApi";
import { menuHeader, menuAside } from "@/menu";
import FileInputImg from "@/components/file-input-img";
import * as Utils from "@/utils";
import InlineEditableTable from "@/components/inline-editable-table";
import FileInput from "@/components/file-input/test";
import $ from "jquery";
// window.$ = $;

export default {
  name: "page-imgConf",
  components: {
    FileInputImg,
    FileInput,
    InlineEditableTable
  },
  data() {
    return {
      activeInfo: "",
      activeTab: "1",
      loading: false,
      tableData: [],
      query: {
        nick: null
      },
      pageinfo: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      dialogChange: {
        _openState: false,
        _fetching: false,
        _pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        _skuItem: {
          type: null,
          sid: null,
          name: null,
          file: null,
          _url: null,
          _previewOpen: false
        },
        id: null,
        name: null,
        code: null,
        relState: null,
        activeDuration: null,
        orderDuration: null,
        signDuration: null,
        skuArr: [
          /*{
							id, type, sid, name, _url
						},*/
        ],
        skuArrDeleted: [] // 放id
        // skuArrAdded: [], // 放_skuItem
      }
    };
  },
  computed: {
    skuArrAdded() {
      return this.dialogChange.skuArr.filter(item => !item.id);
    },
    skuArrOld() {
      return this.dialogChange.skuArr.filter(item => item.id);
    }
  },
  watch: {},
  // 方法集合
  methods: {
    pageEsc(e) {
      if (e.key === "Escape") {
        console.log("clear current");
        this.$refs.InlineEditableTable.clearCurrent("esc");
      }
    },
    pageClick(e) {
      console.log("e", e);
      let path;
      // 兼容火狐
      if (e.path) {
        path = e.path;
      } else {
        path = [...$(e.target).parents()];
      }
      if (path.includes(this.$refs.InlineEditableTable.$el)) {
      } else {
        console.log("clear current");
        this.$refs.InlineEditableTable.clearCurrent("click");
      }
    },
    clearAllImgInput() {
      // 清空所有 FileInputImg 组件的input，并清空对应的file数据
      this.$refs["file-input-img"].forEach(obj => obj.clearInput());
      this.imgConfs.forEach(item =>
        item.inputArr.forEach(ele => (ele.file = null))
      );
    },
    skuDelete_change(item, index) {
      console.log("skuDelete_change");
      if (item.id) {
        // 删除旧商品
        this.dialogChange.skuArrDeleted.push(item.id); // 放入删除队列
        this.dialogChange.skuArr.splice(index, 1); // 渲染
      } else {
        // 删除新商品
      }
    },
    skuPush_change() {
      this.dialogChange.skuArr.push({ ...this.dialogChange._skuItem });
      /*const { type, sid, name, file } = this.dialogChange._skuItem;
				if (typeof(type) !== 'number') {
					this.$message('商品类型不能为空');
				} else if (!sid) {
					this.$message('商品ID不能为空');
				} else if (!name) {
					this.$message('商品名称不能为空');
				} else if (!file) {
					this.$message('商品图片不能为空');
				} else {
					// this.skuArrAdded.push({...this.dialogChange._skuItem}); // 放入add队列
					// 渲染出来新商品，结构是为了和_skuItem断开响应性，避免一起清空
					// this.dialogChange._skuItem = {};
					// this.skuPictureRemove_change();
				}*/
    },
    skuPictureChange_change(files, fileList) {
      console.log("change");
      console.log(...arguments);
      this.dialogChange._skuItem.file = files;
      this.dialogChange._skuItem._url = files.url;
    },
    skuPictureExceed_change(files, fileList) {
      if (fileList.length >= 1) {
        this.$message("每个商品只能选择一张图片");
      }
    },
    skuPictureRemove_change() {
      const instance = this.$refs.upload_change[0]; // 拿到upload组件实例
      instance.clearFiles();
      this.dialogChange._skuItem.file = null;
      this.dialogChange._skuItem._url = null;
    },
    changeActive() {
      if (this.$refs.InlineEditableTable.adding) {
        // 正在添加，说明商品未填写完整
        const { sid, name, file } = this.dialogChange._skuItem;
        if (!sid) {
          this.$message("商品ID不能为空");
        } else if (!name) {
          this.$message("商品名称不能为空");
        } else if (!file) {
          this.$message("商品图片不能为空");
        }
        return;
      } else if (this.$refs.InlineEditableTable.editingRowIndex !== -1) {
        return;
      }
      console.log("change");
      // 编辑活动
      const {
        id,
        name,
        code,
        relState,
        activeDuration,
        orderDuration,
        signDuration
      } = this.dialogChange;
      if (!name) {
        this.$message.error("活动名称不能为空");
        return;
      } else if (!code) {
        this.$message.error("活动代码不能为空");
        return;
      } else if (!activeDuration || !orderDuration || !signDuration) {
        this.$message.error("时间不能为空");
        return;
      }
      this.dialogChange._fetching = true;
      const fnArr1 = [
        () =>
          APIs.Active_change({
            id,
            name,
            code,
            relState,
            activeBegin: +activeDuration[0],
            activeDeadline: +activeDuration[1],
            orderBegin: +orderDuration[0],
            orderDeadline: +orderDuration[1],
            signBegin: +signDuration[0],
            signDeadline: +signDuration[1]
          }).then(res => {
            if (res.code === 0) {
            } else {
              let msg = res.msg;
              if (
                res.code === 503 &&
                res.msg === "Active already exists for this time period"
              ) {
                msg = "活动时间冲突，此段时间内存在已发布的活动";
              }
              this.$message.error(msg);
              throw 1;
            }
          })
      ];
      // 删除商品
      const fnArr2 = this.dialogChange.skuArrDeleted.map(id => () => {
        APIs.Sku_remove({ id }).then(res => {
          if (res.code === 0) {
          } else {
            this.$message.error(res.msg);
            throw 1;
          }
        });
      });
      // 添加商品
      const fnArr3 = this.skuArrAdded.map(item => () =>
        APIs.Sku_add(
          {
            aid: id,
            type: item.type,
            name: item.name,
            sid: item.sid
          },
          (() => {
            const formData = new FormData();
            let file;
            if (item.file) {
              file = item.file;
            } else {
              file = item._file;
            }
            formData.append("file", file);
            return formData;
          })()
        ).then(res => {
          if (res.code === 0) {
          } else {
            this.$message.error(res.msg);
            throw 1;
          }
        })
      );
      // 修改旧商品
      const fnArr4 = this.skuArrOld.map(item => () =>
        APIs.Sku_change(
          (() => {
            const formData = new FormData();
            if (item.file) {
              formData.append("file", item.file);
              return formData;
            } else {
              return;
            }
          })(),
          {
            id: item.id,
            type: item.type,
            name: item.name,
            sid: item.sid
          }
        ).then(res => {
          if (res.code === 0) {
          } else {
            this.$message.error(res.msg);
            throw 1;
          }
        })
      );

      return Utils.serialPromise([...fnArr1, ...fnArr2, ...fnArr3, ...fnArr4])
        .then(() => {
          this.$message.success("更改成功");
          // this.dialogChange._openState = false;
          // this.getTableDataPage1();
          this.refresh2();
        })
        .finally(() => {
          this.dialogChange._fetching = false;
        });
    },
    async clickChange(row) {
      this.dialogChange.skuArrDeleted = []; // 清空要删除的任务
      // this.skuArrAdded = []; // 清空要添加的任务
      this.dialogChange.id = row.id; // 保存id
      await this.getSkuArr(row.id);
      this.dialogChange._openState = true;
      console.log(row);
      const {
        id,
        name,
        code,
        relState,
        activeBegin,
        activeDeadline,
        orderBegin,
        orderDeadline,
        signBegin,
        signDeadline
      } = row;
      Object.assign(this.dialogChange, {
        name,
        code,
        relState,
        activeDuration: [new Date(activeBegin), new Date(activeDeadline)],
        orderDuration: [new Date(orderBegin), new Date(orderDeadline)],
        signDuration: [new Date(signBegin), new Date(signDeadline)]
      });
    },
    getSkuArr(aid) {
      return APIs.Sku_page({
        aid,
        current: 1,
        size: 999
      }).then(res => {
        if (res.code === 0) {
          const skuArr = res.page.list.map(item => {
            const { id, type, sid, name, img: _url } = item;
            return { id, type, sid, name, _url };
          });
          this.dialogChange.skuArr = skuArr;
        } else {
          this.$message.error(res.msg);
          throw 1;
        }
      });
    },
    refresh2() {
      APIs.Active_page({
        id: APIs.getActiveId(),
        current: 1,
        size: 10
      }).then(res => {
        if (res.code === 0) {
          const row = res.page.list[0];
          this.clickChange(row);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 更新活动名称提示
    updateActiveInfo() {
      APIs.Active_page({
        id: APIs.getActiveId(),
        current: 1,
        size: 10
      }).then(res => {
        console.log(1, res.page.list[0].name);
        if (res.code === 0) {
          this.activeInfo = `当前活动：${res.page.list[0].name}`;
        }
      });
    },
    // 进入活动
    getIntoActivity(index, row) {
      const id = row.id;
      this.chooseActivity(id);
    },
    clickTab(tab, event) {
      this.getTableDataPage1(); // 刷新表格
    },
    dialogEditClose(done) {
      /*this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});*/
      done();
    },
    ...mapActions("d2admin/page", ["closeAll"]),
    closeAllTabs() {
      this.$confirm("此操作将关闭其他打开的页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        res => this.closeAll(),
        err => err
      );
    },
    chooseActivity(id) {
      console.log(id);
      // 判断当前是否已进入活动
      if (APIs.getActiveId() === null) {
        // 当前未进入活动
        APIs.setActiveId(id);
      } else if (APIs.getActiveId() === id) {
        // 重复进入当前活动
        // 跳转到当前活动主页
      } else {
        // 进入新的活动
        this.$confirm(
          "是否要离开当前活动，并进入新活动？此操作会关闭所有的其他页面并进入新活动页，确认继续？"
        ).then(
          res => {
            this.closeAllTabs();
          },
          err => {}
        );
      }

      this.$store.commit("d2admin/menu/headerSet", menuHeader);
      this.$store.commit("d2admin/menu/asideSet", menuAside);
    },
    handlePageChange({ currentPage, pageSize }) {
      const pageinfo = this.pageinfo;
      pageinfo.currentPage = currentPage;
      pageinfo.pageSize = pageSize;
      this.getTableData();
    },
    Close() {
      this.slogan = "";
      this.healthyPhotoUrl = "";
      this.photoUrl = "";
    },
    reset() {
      this.teamId = -1;
      this.userIds = [];
      this.getTableData();
    },
    console_log(...args) {
      console.log(...args);
    },
    getTableDataPage1() {
      this.pageinfo.currentPage = 1;
      this.getTableData();
    },
    getTableData() {
      const { currentPage: current, pageSize: size } = this.pageinfo;
      const { nick } = this.query;
      this.loading = true;
      // this.refresh();
    },

    SearchUser(pageCount, pageSize) {
      this.pageinfo = {
        currentPage: pageCount,
        pageSize
      };
      this.tableData = [];
    }
  },
  beforeCreate() {}, // 生命周期 - 创建之前
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.updateActiveInfo();
    // this.getTableData();
    document.addEventListener("keydown", this.pageEsc);

    this.refresh2();
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  beforeMount() {}, // 生命周期 - 挂载之前
  mounted() {},
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {
    console.log("==================beforeDestroy==================");
    document.removeEventListener("keydown", this.pageEsc);
  }, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="less" scoped>
// @import url(); 引入公共css类
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

.list {
  display: block;

  & > p {
    color: #999;
  }

  .item {
    display: flex;
    flex-wrap: wrap;
    margin: 0.7em 0;
    align-items: center;

    .title {
      margin-right: 0.7em;
      width: 8em;
    }

    .file-input-img-container {
      margin-right: 0.7em;
    }
  }
}
</style>
