<template>
  <d2-container>

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
    <el-button type="primary" size="small" v-show="true" v-if="searchUserRole('/oms-order/gift/pack/add')"  @click="addTags()">新建权益包</el-button>
    <hr>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
      <el-table-column prop="id" label="权益包ID" align='center'>
      </el-table-column>
      <el-table-column prop="skuCode" label="权益包商家编码" align='center' width="150">
      </el-table-column>
      <el-table-column prop="name" label="权益包名称" align='center'>
      </el-table-column>
      <el-table-column prop="type" label="是否是小程序权益包" align='center' width="150">
      </el-table-column>
      <el-table-column prop="remark" label="备注" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small" v-if="searchUserRole('/oms-order/gift/packItem/list')" @click="searchItem(scope.$index, scope.row)" type="text" prop="likeNumber">
            查看详情
          </el-button>
          <!--<el-button size="small"v-if="searchUserRole('/oms-order/crm/dealer/change')" @click="changeCubes(scope.$index, scope.row)" type="text" prop="likeNumber">-->
            <!--编辑-->
          <!--</el-button>-->
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
    <el-dialog title="新建" :visible.sync="this.addNewTags" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="NewTags" label-width="120px">

        <div style="text-align: center;height: 50px;">
          <span class="aboutTitle" style="margin-left: 10%;">权益包商家编码：</span>
          <el-input
            type="text"
            v-model="NewTags.skuCode"
            placeholder="请输入经销商代码"
            style="width: 200px;float: left"
          />
        </div>

        <div style="text-align: center;height: 50px;">
          <span class="aboutTitle" style="margin-left: 10%;">权益包名称：</span>
          <el-input
            type="text"
            v-model="NewTags.name"
            placeholder="请输入权益包名称"
            style="width: 200px;float: left"
          />
        </div>

        <div style="text-align: center;height: 50px;">
          <span class="aboutTitle" style="margin-left: 10%;">是否是小程序权益：</span>

          <el-select size="small" placeholder="请选择" style="width: 200px;float: left" class="el-select" v-model="NewTags.type">
            <el-option v-for="type in tagsState" :label="type.name" :value="type.id" :key="type.id"></el-option>
          </el-select>

        </div>

        <div style="text-align: center;height: 50px;">
          <span class="aboutTitle" style="margin-left: 10%;">请选择该权益包包含权益：</span>
          <span style="width: 480px;float: left;">
            <div style="height: 45px;" v-for="(tag,index) in NewTags.items">
              <el-input
                type="text"
                v-model="NewTags.items[index].itemId"
                placeholder="请输入权益名称"
                style="width: 305px;float: left;text-align: center;margin-bottom: 5px;"
              />
              <el-input
                type="text"
                v-model="NewTags.items[index].num"
                placeholder="发放数量"
                style="width: 100px;float: left;text-align: center;margin-bottom: 5px;margin-left: 5px;"
              />
              <el-button type="primary" size="small" style="height:30px; margin-top: 5px;margin-right:5px;width: 60px;float: left; margin-left: 5px;" @click="delRow(index)" >删 除</el-button>
            </div>
            <el-button type="primary" size="small" style="height:30px; float: left;margin-top: 5px;" @click="addTag()">添加</el-button>
          </span>
        </div>

        <div style="text-align: center;">
          <span class="aboutTitle" style="float: none;margin-left: 10%;">备注：</span>
          <textarea class="textarea" :style="{top:textareaTop+'px'}" v-model="NewTags.remark" ></textarea>
        </div>

      </el-form>
      <div style="text-align: right; margin: 0;margin-top:30px;">
        <el-button type="primary" size="small" @click="AddNewTagS()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看包含的权益" :visible.sync="this.pakcItemState" width="800px" :showClose="false">
      <el-table :data="packItem" v-loading="loading" style="width: 100%;" ref="xTable">
        <el-table-column prop="iid" label="仓库礼品ID" align='center'>
        </el-table-column>
        <el-table-column prop="name" label="权益名称" align='center' width="150">
        </el-table-column>
        <el-table-column prop="numOfPack" label="数量" align='center'>
        </el-table-column>
        <el-table-column prop="unitOfPack" label="单位" align='center' width="150">
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
  import {SearchGift , addTags , SearchAllTags , SearchPackItem} from '@/api/tag'
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
        addNewTags:false,
        pakcItemState:false,
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
        packItem:[],
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
        this.addNewTags = false;
        this.pakcItemState = false;
      },

      //查询按钮级别的权限
      searchUserRole(string){
        for(var i = 0; i < UserRole.length; i++){
          if(UserRole[i] == string){
            return true;
          }
        }
      },

      getPro(){
        for(var i = 0; i < this.arr.length; i++){
          if(this.arr[i].name == this.NewCubes.province){
            this.cityList = this.arr[i].children;
          }
        }
      },

      searchItem(index,row){
        console.log(row.id);
        if(changeEx()){
          this.findItem(row.id)
        }else{
          getNewKey();
          setTimeout(function () {
            this.findItem(row.id)
          })
        }
      },

      findItem(id){
        var obj = {
          packId:id
        };

        var data = exLongMessage(obj);

        SearchPackItem(data).then(res => {
          if(res.code == 0){
            this.packItem = res.packItemList[0].itemList;
            this.pakcItemState = true;
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
          name:this.Tags.name,
        };
        var data = exLongMessage(data1);
        SearchAllTags(data).then(res => {
          if (res.code == 0) {

            for(var i = 0 ; i < res.page.list.length ; i++){
              if(res.page.list[i].type == 0){
                res.page.list[i].type = "普通权益"
              }else{
                res.page.list[i].type = "小程序权益"
              }
            }

            this.tableData = res.page.list;
            this.pageinfo.totalResult = res.page.totalCount;
          }
        })
      },


      addTags(){
        this.addNewTags = true;
      },

      delRow(index){
        this.NewTags.items.splice(index,1);
        console.log(this.NewTags.items.length);
        if(this.NewTags.items.length == 1){
          this.textareaTop = -5;
        }else if(this.NewTags.items.length == 0){
          this.textareaTop = -45;
        }
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
          addTags(data).then(res => {
            console.log(res)
            if(res.code == 0){

            }else if(res.code == 503){

            }else {

            }
          })
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
          this.Tags = {
              name:''
          }
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
