<template>
  <d2-container>
    <span>
      <span class="aboutTitle">角色：</span>
      <el-input placeholder="请输入角色" v-model="Users.name" style="width: 200px;"></el-input>
    </span>

    <el-button type="primary" size="small" v-show="true" style="margin-left: 20px;" @click="serachBY()">查询</el-button>
    <el-button type="primary" size="small" v-show="true" @click="clearBY()">重置</el-button>

    <el-button type="primary" size="small" v-if="searchUserRole('/oms-login/sys/role/add')" v-show="true" @click="addRole()">新增角色</el-button>
    <hr>
    <!-- query form -->
    <el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
      <el-table-column prop="name" label="角色" align='center'>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align='center'>
      </el-table-column>
      <el-table-column prop="created" label="创建时间" align='center'>
      </el-table-column>
      <el-table-column prop="updated" label="更新时间" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small" v-if="!(scope.row.id == 1) && searchUserRole('/oms-login/sys/userRole/remove')" @click="delRoleS(scope.$index, scope.row)" type="text" prop="likeNumber">
            删除
          </el-button>
          <!--v-if="!(scope.row.id == 1)" -->
          <el-button size="small" v-if="searchUserRole('/oms-login/sys/rolePermit/change')" @click="setRole(scope.$index, scope.row)" type="text" prop="likeNumber">
            设置权限
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

    <el-dialog title="创建角色" :visible.sync="this.roleS" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="Role" label-width="120px">
        <p>
          <el-form-item label="设置角色名：">
            <el-input
              type="text"
              v-model="Role.name"
              placeholder="请输入角色名"
              style="width: 200px;"
            />
          </el-form-item>
        </p>
        <p>
          <el-form-item label="设置备注：">
            <el-input
              type="text"
              v-model="Role.account"
              placeholder="请输入备注"
              style="width: 200px;"
            />
          </el-form-item>
        </p>
        <div style="text-align: right; margin: 0">
          <el-button type="primary" size="small" @click="addRoleS()">确定</el-button>
          <el-button size="small" @click="Cloose()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>


    <el-dialog title="选择权限" :visible.sync="this.roleTree" width="800px" :showClose="false">
      <div style="max-height: 50vh;overflow: scroll">
        <el-tree
          ref="tree"
          node-key="id"
          :data="roleData"
          :props="defaultProps"
          :default-checked-keys="selectRoleDef"
          :show-checkbox="true"
          :check-strictly="false"
          @check="getCheckedNodes()"
        >
        </el-tree>
      </div>

      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="checkedKeys()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>

    </el-dialog>

  </d2-container>
</template>

<script>
  import {SearchAllRole , addRole , delRole} from '@/api/Role'
  import {SearchPerTree , AddRolePer , SearchRolePre} from '@/api/Permit'
  import {getMenuList , getPathList} from '@/api/Login'
  import {exMessage, changeEx, getNewKey , exLongMessage} from '@/libs/exJSE.js'
  import {supplementPath} from '@/menu/index.js'
  import util from '@/libs/util.js'
  import store from '@/store/index'

  import {find} from 'lodash'
  export default {
    name: 'demotalbe',
    data () {
      return {
        loading: false,

        roleTree:false,
        roleS: false,

        tableData: [],
        selectRoleDef:[],
        selectRole:[],//选中的节点

        selectRoleId:-1,
        Users:{
          name:''
        },
        Role: {
          name: '',
          remark: ''
        },
        pageinfo: {
          currentPage: 1,
          pageSize: 10,
          totalResult: 600
        },
        roleData: [],
        defaultProps: {
          children: "children",
          label: "name",
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

      Cloose(){
          this.roleTree = false;
          this.roleS = false;
          this.$refs.tree.setCheckedKeys([]);
      },

      getTableData () {
        this.loading = true;
        this.ActSJList(1, 10);
      },
      addRole(){
        this.Role = {
          name: '',
            remark: ''
        };
        this.roleS = true;
      },
      ActSJList(pageCount, pageSize){
        if (changeEx()) {
          this.findAllRole(pageCount, pageSize)
        } else {
          getNewKey();
          setTimeout(function () {
            this.findAllRole(pageCount, pageSize)
          }, 1000);
        }
        this.loading = false;
      },
      findAllRole(pageCount, pageSize){
        var data1 = {
          current: pageCount,
          size: pageSize,
          name:this.Users.name
        };
        var data = exMessage(data1);
        SearchAllRole(data).then(res => {
          if (res.code == 0) {
            this.tableData = res.voPage.list;
            this.pageinfo.totalResult = res.voPage.totalCount;
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

      //新增角色
      addRoleS(){
        if (changeEx()) {
          this.doAddRole();
        } else {
          getNewKey();
          setTimeout(function () {
            this.doAddRole();
          }, 1000)
        }
      },
      doAddRole(){
        if (this.Role.name == "") {
          this.$message({
            type: 'error',
            message: '请输入角色名'
          })
        } else {
          var data = exMessage(this.Role);
          addRole(data).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.roleS = false;
              this.ActSJList(this.pageinfo.currentPage, this.pageinfo.pageSize);
            } else if (res.code == 501) {
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
        }
      },
      //删除
      delRoleS(index,row){
        if(changeEx()){
            this.doDelRole(row.id)
        }else{
          getNewKey();
          setTimeout(function () {
            this.doDelRole(row.id)
          },1000)
        }
      },
      doDelRole(id){
        var obj = {
          id: id
        };
        var data = exMessage(obj);
        delRole(data).then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功"
            })
            this.ActSJList(this.pageinfo.currentPage, this.pageinfo.pageSize);
          } else if (res.code == 501) {
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
      //获取全部权限树
      getAllPer(){
        if(changeEx()){
          this.AllPer()
        }else{
          getNewKey();
          setTimeout(function () {
            this.AllPer()
          },1000)
        }
      },
      AllPer(){
        SearchPerTree().then(res => {
          if(res.code == 0){
            this.roleData = res.permitPathTree;
          }
        })
      },
      setRole(index,row){
        this.selectRoleId = row.id;
        this.roleTree = true;
        this.exPre(row.id);
      },
      //添加权限
      checkedKeys(){
        if(changeEx()){
          this.addPer()
        }else{
          getNewKey();
          setTimeout(function () {
            this.addPer()
          },1000)
        }
      },
      //封一下数据
      getPreList(){
        var data = {
          dataArray:[]
        };
        if(this.selectRole.length != 0){
          for(var i = 0; i < this.selectRole.length ; i++){
            var json = {id1:this.selectRoleId,id2:this.selectRole[i].id};
            data.dataArray.push(json)
          }
        }else{
          for(var i = 0; i < this.selectRoleDef.length ; i++){
            var json = {id1:this.selectRoleId,id2:this.selectRoleDef[i]};
            data.dataArray.push(json)
          }
        }
        return data;
      },
      addPer(){
        if(this.selectRole.length == 0 && this.selectRoleDef.length == 0){
          this.$message({
            type:'error',
            message:'请至少选择一个权限'
          })
        }else{
            console.log(this.getPreList());


          var data = exLongMessage(this.getPreList());
          AddRolePer(data).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.roleTree = false;
              this.$refs.tree.setCheckedKeys([]);
            } else if (res.code == 501) {
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
        }
      },
      //获取角色已经有的权限
      exPre(id){
        if(changeEx()){
          this.SearchPre(id)
        }else{
          getNewKey();
          setTimeout(function () {
            this.SearchPre(id)
          },1000)
        }
      },
      SearchPre(id){
          var obj = {
            roleId:id
          };
        var data = exMessage(obj);
        var aboutList = [];

        SearchRolePre(data).then(res => {
          if(res.code == 0){
            if(res.rolePermitList[0].permitList != null){
              for(var i = 0; i < res.rolePermitList[0].permitList.length; i++){
                aboutList.push(res.rolePermitList[0].permitList[i].id)
              }
            }else{
                aboutList= [];
            }
            this.selectRoleDef = aboutList;
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
        this.Users = {
          name:''
        }
        this.getTableData();
      }

    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {
      this.getMuens();
      this.getAllPer();
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
