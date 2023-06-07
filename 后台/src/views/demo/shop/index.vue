<template>
  <d2-container>

    <!--增加商品列表筛选条件-->

    <span style="margin-left: 30px;">
      <span class="aboutTitle1">权益包名称：</span>
      <el-input
        type="text"
        v-model="Tags.name"
        placeholder="请输入权益包名称"
        style="width: 200px;"
      />
    </span>



    <el-button type="primary" size="small" v-show="true" style="margin-left: 20px;" @click="serachBY()">查询</el-button>
    <el-button type="primary" size="small" v-show="true" @click="clearBY()">重置</el-button>
    <el-button type="primary" size="small" v-show="true" v-if="searchUserRole('/oms-order/order/sku/add')"  @click="addNewSku()">新建商品</el-button>
    <hr>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
      <el-table-column prop="stage" label="平台" align='center'>
      </el-table-column>
      <el-table-column prop="code" label="平台商品ID" align='center' width="150">
      </el-table-column>
      <el-table-column prop="name" label="商品名称" align='center'>
      </el-table-column>
      <el-table-column prop="type" label="商品类型" align='center' width="150">
      </el-table-column>
      <el-table-column prop="send" label="是否线索下发" align='center'>
      </el-table-column>
      <el-table-column prop="valid" label="商品状态" align='center'>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <!--根据商品查询政策-->
          <el-button size="small" v-if="searchUserRole('/oms-order/order/sku/change')" @click="updateV(scope.$index, scope.row , 1)" type="text" prop="likeNumber">
            更 多
          </el-button>

          <el-button size="small" v-if="searchUserRole('/oms-order/order/sku/change')" @click="aboutCarInfo(scope.$index, scope.row)" type="text" prop="likeNumber">
            查看车辆
          </el-button>

          <el-button size="small" v-if="searchUserRole('/oms-order/order/sku/change') && scope.row.valid == '已下架'" @click="updateV(scope.$index, scope.row , 1)" type="text" prop="likeNumber">
            上 架
          </el-button>

          <el-button size="small" v-if="searchUserRole('/oms-order/order/sku/change') && scope.row.valid == '正常'" @click="updateV(scope.$index, scope.row , 0)" type="text" prop="likeNumber">
            下 架
          </el-button>

          <el-button size="small"v-if="searchUserRole('/oms-order/order/sku/change')" @click="changeShop(scope.$index, scope.row)" type="text" prop="likeNumber">
            编 辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="footer">
      <vxe-pager
        align="right"
        size="small"
        :current-page.sync="pageinfo.currentPage"
        :page-size.sync="pageinfo.pageSize"
        :total="pageinfo.totalResult"
        @page-change="handlePageChange"
      >
      </vxe-pager>
    </template>
    <el-dialog title="查看包含的权益" :visible.sync="this.shopCarState" width="800px" :showClose="false">
      <el-table :data="shopCars" v-loading="loading" style="width: 100%;" ref="xTable">
        <el-table-column prop="series" label="车系" align='center'>
        </el-table-column>
        <el-table-column prop="model" label="车型" align='center'>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin: 0;margin-top:30px;">
        <el-button type="primary" size="small" @click="Cloose()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>

  import {searchAllShop , updateShop , searchCarByShop} from '@/api/Shop'
  import {SearchUserRole} from '@/api/Role'
  import {exMessage , changeEx , getNewKey , exLongMessage} from '@/libs/exJSE.js'
  import {getMenuList , getPathList} from '@/api/Login'
  import {supplementPath} from '@/menu/index.js'
  import store from '@/store/index'
  import {find} from 'lodash'
  import util from '@/libs/util.js'
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  export default {
    components: {
      ElButton,
      ElInput},
    name: 'demotalbe',
    data () {
      return {
        loading: false,
        shopCarState:false,
        textareaTop:-45,
        tagsState:[
          {id:-1,name:'请选择权益类型'},
          {id:0,name:'普通权益'},
          {id:1,name:'小程序权益'},
        ],
        Tags:{
          name:'',
        },
        NewTags:{
          name:'',
          name:'',
          type:-1,
          remark:'',
          skuCode:'',
          items:[]
        },
        tableData: [],
        shopCars:[],
        pageinfo: {
          currentPage: 1,
          pageSize: 10,
          totalResult: 600
        },
      }
    },
    computed: {},
    watch: {},
    // 方法集合
    methods: {
      // 格式化内容
      formatterComm (cellValue, row, column) {
        const thatType = cellValue.column.property
        const item = find(this.$data[thatType], ['value', cellValue.cellValue])
        return item ? item.label : ''
      },
      //时间格式化
      formatterTime(row){
        if (row.cellValue == null) {
          return "";
        }
        var date = new Date(row.cellValue);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ":";
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ":" : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      },

      formatterTimetoString(time){
        var date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ":";
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ":" : date.getMinutes() + ':';
        var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      },

      handlePageChange ({currentPage, pageSize}) {
        const pageinfo = this.pageinfo;
        pageinfo.currentPage = currentPage;
        pageinfo.pageSize = pageSize;
        this.searchAllCubes(pageinfo.currentPage, pageinfo.pageSize);
      },
      Cloose () {
        this.shopCarState = false;
      },

      //查询按钮级别的权限
      searchUserRole(string){
        for(var i = 0; i < UserRole.length; i++){
          if(UserRole[i] == string){
            return true;
          }
        }
      },

      aboutCarInfo(index,row){
        if(changeEx()){
          this.CarsInfos(row.id)
        }else{
          getNewKey();
          setTimeout(function () {
            this.CarsInfos(row.id)
          },1000)
        }
      },

      CarsInfos(id){
        var obj = {
          skuId:id
        };
        var data = exLongMessage(obj);
        searchCarByShop(data).then(res => {
          if(res.code == 0){
            for(var  i = 0; i < res.skuModelList[0].modelList.length; i++){
              var json = {
                series:res.skuModelList[0].modelList[i].series.series,
                model:res.skuModelList[0].modelList[i].model
              };
              this.shopCars.push(json);
            }
            this.shopCarState = true;
          }
        })
      },

      updateV(index,row,state){
        console.log(row.id,state)
        var data = {
          id: row.id,
          valid: state
        };

        if(changeEx()){
            this.updateShopV(data)
        }else{
          getNewKey();
          setTimeout(function () {
            this.updateShopV(data)
          },1000)
        }
      },

      updateShopV(data){
        var data = exLongMessage(data);
        updateShop(data).then(res => {
          if(res.code == 0){
            this.$message({
              type:'success',
              message:'操作成功'
            })

            this.getTableData();
          }else if (res.code == 501) {
            if (res.msg == "Token expire") {
              this.$router.push('/login');
            }
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        })
      },



      //获取按钮级别权限
      getPathList(){
        getPathList().then(res => {
          if(res.code == 0){
            for(var i = 0;i < res.pathList.length; i++){
              UserRole.push(res.pathList[i].url);
            }
            this.getTableData();
          }else if (res.code == 501) {
            if (res.msg == "Token expire") {
              this.$router.push('/login');
            }
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        })
      },

      getTableData () {
        this.pageinfo = {
          currentPage: 1,
          pageSize: 10,
          totalResult: 600
        };
        this.searchAllTags(1, 10);
      },

      searchAllTags(page, size){
        if (changeEx()) {
          this.SearchTags(page, size)
        } else {
          getNewKey();
          setTimeout(function () {
            this.SearchTags(page, size)
          }, 1000)
        }
      },

      SearchTags (pageCount, pageSize) {
        var data1 = {
          current: pageCount,
          size: pageSize,
        };
        var data = exLongMessage(data1);
        searchAllShop(data).then(res => {
          if (res.code == 0) {
            for(var i = 0; i < res.page.list.length; i++){
              switch (res.page.list[i].stage){
                case 0:
                  res.page.list[i].stage = "天猫订单";
                  break;
                case 1:
                  res.page.list[i].stage = "京东订单";
                  break;
                case 2:
                  res.page.list[i].stage = "京东线索平台";
                  break;
                case 3:
                  res.page.list[i].stage = "其他";
                  break;
              }
              switch (res.page.list[i].type){
                case 0:
                  res.page.list[i].type = "整车订金";
                  break;
                case 1:
                  res.page.list[i].type = "日常试驾";
                  break;
                case 2:
                  res.page.list[i].type = "其他";
                  break;
              }
              switch (res.page.list[i].send){
                case 0:
                  res.page.list[i].send = "不下发";
                  break;
                case 1:
                  res.page.list[i].send = "下发";
                  break;
              }
              switch (res.page.list[i].valid){
                case 0:
                  res.page.list[i].valid = "已下架";
                  break;
                case 1:
                  res.page.list[i].valid = "正常";
                  break;
              }
            }

            this.tableData = res.page.list;
            this.pageinfo.totalResult = res.page.totalCount;
          }
        })
      },


      addNewSku(){
        this.$router.push({
          path:'/addShop',
//          query:{
//              aboutID:1
//          }
        });
      },

      changeShop(index,row){
        this.$router.push({
          path:'/addShop',
          query:{
            aboutID:row.id
          }
        })

      },

      addTag(){
        var obj = {
          itemId:'',
          num:'',
          unit:'默认单位'
        };
        this.NewTags.items.push(obj); // 塞入一个新的权益对象
        this.textareaTop = this.textareaTop + 40;
        if(this.textareaTop > 11){
          this.textareaTop = 10;
        }
      },

      AddNewTagS(){
        if(changeEx()){
          this.addnewTagS()
        }else{
          getNewKey();
          setTimeout(function () {
            this.addnewTagS();
          },1000)
        }
      },

      addnewTagS(){
        var items = 0;
        console.log(this.NewTags);
        if(this.NewTags.skuCode == ""){
          this.$message({
            type: "error",
            message: "请输入商家编码"
          })
        }else if(this.NewTags.name == ""){
          this.$message({
            type: "error",
            message: "请输入权益包名称"
          })
        } else if(this.NewTags.type == -1){
          this.$message({
            type: "error",
            message: "请选择权益类型"
          })
        } else if(this.NewTags.items.length == 0){
          this.$message({
            type: "error",
            message: "请至少添加一个权益"
          })
        } else{
          for(var i = 0 ; i < this.NewTags.items.length ; i++){
            if(this.NewTags.items[i].itemId == ""){
              this.$message({
                type: "error",
                message: "请输入所添加权益的名称"
              })
              items = -1
            }else if(this.NewTags.items[i].num == ""){
              this.$message({
                type: "error",
                message: "请输入所添加权益的发放数量"
              })
              items = -1
            }
          }
        }

        if(items == 0){
          var data = exLongMessage(this.NewTags);

        }
      },

      getMuens(){
        if (changeEx()) {
          var list = [];
          getMenuList().then( res=> {
            if(res.code == 0){
              for(var i = 0; i< res.menuTree[0].children.length; i++){
                if(res.menuTree[0].children[i].children){
                  var json = {title: '', icon: '', children: []};
                  json.title = res.menuTree[0].children[i].name;
                  json.icon = res.menuTree[0].children[i].icon;
                  for(var j = 0 ; j < res.menuTree[0].children[i].children.length ; j++){
                    var json1 = {path: '', title: '', icon: ''};
                    json1.title = res.menuTree[0].children[i].children[j].pathList[0].name;
                    json1.icon = res.menuTree[0].children[i].children[j].pathList[0].module;
                    json1.path = res.menuTree[0].children[i].children[j].pathList[0].url;
                    json.children.push(json1)
                  }
                  list.push(json);
                }else{
                  var json = {path: '', title: '', icon: ''};
                  json.title = res.menuTree[0].children[i].pathList[0].name;
                  json.icon = res.menuTree[0].children[i].pathList[0].module;
                  json.path = res.menuTree[0].children[i].pathList[0].url;
                  list.push(json);
                }
              }
            }
            this.$store.commit('d2admin/menu/asideSet', supplementPath(list))
          });
        } else {
          getNewKey();
          setTimeout(function () {
            this.getMuens()
          }, 1000)
        }
      },
      serachBY(){
        this.getTableData();
      },
      clearBY(){
        this.getTableData();
      }
    },
// 生命周期 - 创建完成（可以访问当前this实例）
    created () {
      this.getMuens();
      this.getPathList();
    },
// 生命周期 - 挂载完成（可以访问DOM元素）
    mounted () {
    },
    beforeCreate () {
    }, // 生命周期 - 创建之前
    beforeMount () {
    }, // 生命周期 - 挂载之前
    beforeUpdate () {
    }, // 生命周期 - 更新之前
    updated () {
    }, // 生命周期 - 更新之后
    beforeDestroy () {
    }, // 生命周期 - 销毁之前
    destroyed () {
    }, // 生命周期 - 销毁完成
    activated () {
    } // 如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang='scss' scoped>
  //@import url(); 引入公共css类
  .ep-input {
    width: 80%;
    position: absolute;
    right: 5%;
  }

  .ep-select {
    position: absolute;
    left: 15%;
  }

  .aboutTitle{
    font-size: 14px;
    color: #606266;
    display: block;
    float: left;
    width:200px;
    text-align: right;
    height:40px;
    line-height: 40px;
  }

  .aboutTitle1{
    font-size: 14px;
    color: #606266;
  }

  .textarea{
    position: relative;width: 200px;height: 70px;resize:none;border:1px solid #DCDFE6;border-radius: 4px;
  }
</style>
