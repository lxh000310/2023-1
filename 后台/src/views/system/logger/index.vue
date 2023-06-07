<template>
  <d2-container>
    <span style="height: 40px;">
      <span class="aboutTitle">操作人：</span>
      <el-select size="small" placeholder="请选择"
                 style="width: 200px;" class="el-select" v-model="searchBy.uid">
        <el-option v-for="type in userList" :label="type.name" :value="type.id" :key="type.id"></el-option>
      </el-select>
    </span>

    <span style="height: 40px;margin-left: 30px;">
      <span class="aboutTitle">日志类型：</span>
      <el-select size="small" placeholder="请选择"
                 style="width: 200px;" class="el-select" v-model="searchBy.type">
        <el-option v-for="type in loggerType" :label="type.name" :value="type.id" :key="type.id"></el-option>
      </el-select>
    </span>

    <span style="height: 40px;margin-left: 30px;">
      <span class="aboutTitle">操作时间：</span>
      <el-date-picker v-model="searchBy.createdStart"  format="yyyy-MM-dd" value-format="timestamp"
                      style="width: 150px;" type="datetime" placeholder="请选择">
      </el-date-picker>
      <span class="aboutTitle" style="margin-left: 10px;margin-right: 10px;">至</span>
      <el-date-picker v-model="searchBy.endStart"  format="yyyy-MM-dd" value-format="timestamp"
                      style="width: 150px;" type="datetime" placeholder="请选择">
      </el-date-picker>

    </span>

    <el-button type="primary" style="margin-left: 20px" size="small" v-show="true" @click="searchByType()">查询</el-button>
    <el-button type="primary" size="small" v-show="true" @click="clearByType()">重置查询条件</el-button>

    <hr>
    <!-- query form -->
    <el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
      <el-table-column prop="id" label="序号" align='center' width="100px">
      </el-table-column>
      <el-table-column prop="uid" label="操作人" align='center'>
      </el-table-column>
      <el-table-column prop="type" label="日志类型" align='center'>
      </el-table-column>
      <el-table-column prop="created" label="操作时间" align='center'>
      </el-table-column>
      <el-table-column prop="value" label="日志消息" align='center'>
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

  </d2-container>
</template>

<script>
  import {getMenuList , getPathList} from '@/api/Login'
  import {SearchAllUser} from '@/api/User'
  import {exMessage, changeEx, getNewKey , exLongMessage} from '@/libs/exJSE.js'
  import {supplementPath} from '@/menu/index.js'
  import {searchLogger} from '@/api/logger'
  import util from '@/libs/util.js'
  import store from '@/store/index'

  import {find} from 'lodash'
  export default {
    name: 'demotalbe',
    data () {
      return {
        loading: false,
        tableData: [],
        userList:[],
        loggerType:[{id:0,name:'系统日志'},{id:1,name:'操作日志'}],
        searchBy:{
          uid:'',
          type:'',
          createdStart:'',
          endStart:''
        },
        pageinfo: {
          currentPage: 1,
          pageSize: 10,
          totalResult: 100
        },
      }
    },
    computed: {},
    watch: {},
    // 方法集合
    methods: {
      //获取树选中的数据
      getCheckedNodes(){
        this.selectRole = this.$refs.tree.getCheckedNodes();
      },

      //查询按钮级别的权限
      searchUserRole(string){
        for(var i = 0; i < UserRole.length; i++){
          if(UserRole[i] == string){
            return true;
          }
        }
      },
      //获取按钮级别权限
      getPathList(){
        getPathList().then(res => {
          if(res.code == 0){
            for(var i = 0;i < res.pathList.length; i++){
              UserRole.push(res.pathList[i].url);
            }
            this.SearchAllUsers();
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
        this.ActSJList(pageinfo.currentPage, pageinfo.pageSize);
      },

      startDatePicker(){
        console.log(this.searchBy)
      },

      getTableData () {
        this.loading = true;
        this.ActSJList(1, 10);
      },

      ActSJList(pageCount, pageSize){
        if (changeEx()) {
          this.findLooger(pageCount, pageSize)
        } else {
          getNewKey();
          setTimeout(function () {
            this.findAllRole(pageCount, pageSize)
          }, 1000);
        }
        this.loading = false;
      },
      findLooger(pageCount,pageSize){
        var data1 = {
          current: pageCount,
          size: pageSize,
          createdDesc:true,
          type:this.searchBy.type,
          uid:this.searchBy.uid,
          createdStart:this.searchBy.createdStart,
          createdEnd:this.searchBy.endStart
        };
        var data = exLongMessage(data1);
        searchLogger(data).then(res => {
          if (res.code == 0) {
            this.pageinfo.totalResult = res.page.totalCount;
            for(var i = 0; i < res.page.list.length; i++){
                for(var j = 0; j < this.userList.length; j++){
                  if(res.page.list[i].uid == this.userList[j].id){
                    res.page.list[i].uid = this.userList[j].name
                  }
                }

                if(res.page.list[i].type == 0){
                  res.page.list[i].type = "系统日志"
                }else{
                  res.page.list[i].type = "操作记录"
                }
            }
            this.tableData = res.page.list;

          }else if (res.code == 501) {
            if (res.msg == "Token expire") {
              this.$router.push('/login');
            }
          } else if (res.msg == "Data nonexistent") {
            this.$message({
              type: "error",
              message: "数据不存在，请刷新后重试"
            })
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        })
      },
      //左侧列表
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
              this.$store.commit('d2admin/menu/asideSet', supplementPath(list))

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
          });
        } else {
          getNewKey();
          setTimeout(function () {
            this.getMuens()
          }, 1000)
        }
      },
      SearchAllUsers () {
        var data1 = {
          current: 1,
          size: 1000000000
        };
        var json = {
          id:0,
          name:''
        };
        var data = exMessage(data1);
        SearchAllUser(data).then(res => {
          if (res.code == 0) {
            for(var i = 0; i < res.voPage.list.length; i++){
              json = {
                id:res.voPage.list[i].id,
                name:res.voPage.list[i].name
              };
              this.userList.push(json)
            }

            this.getTableData();
          }else if(res.code == 501){
            if (res.msg == "Token expire") {
              this.$router.push('/login');
            }
          }
        })
      },

      searchByType(){
        if(this.searchBy.createdStart == null){
          this.searchBy.createdStart = ""
        }
        if(this.searchBy.endStart == null){
          this.searchBy.endStart = ""
        }
        this.ActSJList(1, 10);
      },

      clearByType(){
        this.searchBy = {
          uid:'',
          type:'',
          createdStart:'',
          endStart:''
        };
        this.ActSJList(1, 10);
      }


    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {
      this.getMuens();
      this.getPathList()
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
  .aboutTitle{
    font-size: 14px;
    color: #606266;
  }
</style>
