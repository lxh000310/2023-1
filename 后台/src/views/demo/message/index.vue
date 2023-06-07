<template>
  <d2-container>
    <span>
      <span class="aboutTitle">账号1：</span>
      <el-input placeholder="请输入账号" v-model="Users.account" style="width: 200px;"></el-input>
    </span>

    <span style="margin-left: 30px;">
      <span class="aboutTitle">角色：</span>
      <el-select size="small" placeholder="请选择" style="width: 200px;" class="el-select" v-model="Users.roleId">
        <el-option v-for="type in roleList" :label="type.name" :value="type.id" :key="type.id"></el-option>
      </el-select>
    </span>

    <el-button type="primary" size="small" v-show="true" style="margin-left: 20px;" @click="serachBY()">查询</el-button>
    <el-button type="primary" size="small" v-show="true" @click="clearBY()">重置</el-button>
    <el-button type="primary" size="small" v-show="true" v-if="searchUserRole('/oms-login/sys/user/add')" @click="addUser()">新增账户</el-button>
    <hr>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
      <el-table-column prop="name" label="用户名" align='center'>
      </el-table-column>
      <el-table-column prop="account" label="账号" align='center'>
      </el-table-column>
      <el-table-column prop="created" label="账号创建时间" align='center'>
      </el-table-column>
      <el-table-column prop="forbidState" label="账号状态" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small"v-if="searchUserRole('/oms-login/sys/userRole/list')" @click="searchUserPower(scope.$index, scope.row)" type="text" prop="likeNumber">
            查看账号角色
          </el-button>
          <el-button size="small" v-if="!(scope.row.id == 1) && scope.row.forbidState == '禁用' && searchUserRole('/oms-login/sys/user/change')"
                     @click="changeDisUser(scope.$index, scope.row)" type="text" prop="likeNumber">
            启用此账号
          </el-button>
          <el-button size="small" v-if="!(scope.row.id == 1) && scope.row.forbidState != '禁用' && searchUserRole('/oms-login/sys/user/change')"
                     @click="changeDisUser(scope.$index, scope.row)" type="text" prop="likeNumber">
            禁用此账号
          </el-button>
          <el-button size="small" v-if="!(scope.row.id == 1) && searchUserRole('/oms-login/sys/user/change')" @click="changePassword(scope.$index, scope.row)"
                     type="text" prop="likeNumber">
            重置密码
          </el-button>
          <el-button size="small" v-if="!(scope.row.id == 1) && searchUserRole('/oms-login/sys/user/remove')" @click="changeDel(scope.$index, scope.row)" type="text"
                     prop="likeNumber">
            删除账号
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


    <el-dialog title="新建账号" :visible.sync="this.addCreate" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="User" label-width="120px">
        <p>
          <el-form-item label="设置用户名：">
            <el-input
              type="text"
              v-model="User.name"
              placeholder="请输入用户名"
              style="width: 200px;"
            />
          </el-form-item>
          <span style="color: red;font-size: 20px;line-height: 40px;">*</span>
        </p>
        <p>
          <el-form-item label="设置账号：">
            <el-input
              type="text"
              v-model="User.account"
              placeholder="请输入账号"
              style="width: 200px;"
            />
          </el-form-item>
          <span style="color: red;font-size: 20px;line-height: 40px;">*</span>
        </p>
        <p>
          <el-form-item label="设置密码：">
            <el-input
              type="password"
              v-model="User.password"
              placeholder="请输入密码"
              style="width: 200px;"
            />
          </el-form-item>
          <span style="color: red;font-size: 20px;line-height: 40px;">*</span>
        </p>

        <p>
          <el-form-item label="设置角色：">
            <el-select size="small" placeholder="请选择"
                       style="width: 200px;"
                       class="el-select" v-model="aboutRole.id2">
              <el-option v-for="type in roleList" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
        </p>

      </el-form>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="changeAdd()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="重置密码" :visible.sync="this.updatePassWord" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="newPassword" label-width="120px">
        <p>
          <el-form-item label="设置新密码：">
            <el-input
              type="password"
              v-model="newPassword.password"
              placeholder="请输入新密码"
              style="width: 200px;"
            />
          </el-form-item>
        </p>
        <div style="text-align: right; margin: 0">
          <el-button type="primary" size="small" @click="changPass()">确定</el-button>
          <el-button size="small" @click="Cloose()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog title="查看角色" :visible.sync="this.userRoleS" width="800px" :showClose="false">

      <el-table :data="userRoleList" style="width: 100%;" ref="xTable">
        <el-table-column prop="name" label="账号角色" align='center' >
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="Cloose()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
  import {SearchAllUser, addUser, delUser, updateUser} from '@/api/User'
  import {SearchAllRole, SearchUserRole , addUserRole} from '@/api/Role'
  import {exMessage , changeEx , getNewKey} from '@/libs/exJSE.js'
  import {getMenuList , getPathList} from '@/api/Login'
  import {supplementPath} from '@/menu/index.js'
  import store from '@/store/index'
  import {find} from 'lodash'
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  export default {
    components: {ElInput},
    name: 'page-demo-message',
    data () {
      return {
        accounts: '',
        loading: false,
        roleLoading:false,
        addCreate: false,
        updatePassWord: false,
        userRoleS:false,
        tableData: [],
        roleList:[],
        userRoleList:[],
        Users:{
          account:'',
          roleId:''
        },
        aboutRole:{
          id1:'',
          id2:'',
        },
        User: {
          account: '',
          name: '',
          password: '',
          roleIds:[]
        },
        newPassword: {
          id: '',
          password: ''
        },
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
        this.searchAllUsers(pageinfo.currentPage, pageinfo.pageSize);
      },
      Cloose () {
        this.addCreate = false;
        this.updatePassWord = false;
        this.userRole = false;
        this.userRoleS = false;
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

      addUser(){
        this.User = {
          account: '',
          name: '',
          password: ''
        };
        this.addCreate = true;
      },

      getTableData () {
        this.searchAllUsers(1, 10);
      },

      searchAllUsers(page, size){
        if (changeEx()) {
          this.SearchUser(page, size)
        } else {
          getNewKey();
          setTimeout(function () {
            this.SearchUser(page, size)
          }, 1000)
        }
      },

      changeAdd(){
        if (changeEx()) {
          this.addNewUser()
        } else {
          getNewKey();
          setTimeout(function () {
            this.addNewUser()
          }, 1000)
        }
      },

      changeDel(index, row){
        if (changeEx()) {
          this.delUser(row.id)
        } else {
          getNewKey();
          setTimeout(function () {
            this.delUser(row.id)
          }, 1000)
        }
      },

      changeDisUser(index, row){
        if (changeEx()) {
          this.disUser(row.id, row.forbidState)
        } else {
          getNewKey();
          setTimeout(function () {
            this.disUser(row.id, row.forbidState)
          }, 1000)
        }
      },

      searchUserPower(index, row){
        if (changeEx()) {
          this.searRole(row.id)
        } else {
          getNewKey();
          setTimeout(function () {
            this.searRole(row.id)
          }, 1000)
        }
      },

      changePassword(index, row){
        console.log(row.id);
        this.newPassword = {
          id: row.id,
          password: ''
        };
        this.updatePassWord = true;
      },

      changPass(){
        console.log(this.newPassword)
        if (changeEx()) {
          this.updatePassword()
        } else {
          getNewKey();
          setTimeout(function () {
            this.updatePassword()
          }, 1000)
        }
      },

      changeRole(index,row){

        this.userRole = true;

        this.aboutRole = {
          id1:row.id,
          id2:''
        };

      },

      SearchUser (pageCount, pageSize) {
        var data1 = {
          current: pageCount,
          size: pageSize,
          account:this.Users.account,
          roleId:this.Users.roleId
        };
        var data = exMessage(data1);
        SearchAllUser(data).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.voPage.list.length; i++) {
              if (res.voPage.list[i].forbidState == 0) {
                res.voPage.list[i].forbidState = "正常"
              } else {
                res.voPage.list[i].forbidState = "禁用"
              }
            }
            this.tableData = res.voPage.list;
            this.pageinfo.totalResult = res.voPage.totalCount;

            var obj = {
              current: 1,
              size: 10000
            };
            var datas = exMessage(obj);
            SearchAllRole(datas).then(res => {
              if(res.code == 0){
                this.roleList = res.voPage.list
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
      },

      addNewUser(){
        if (this.User.name == "") {
          this.$message({
            type: 'error',
            message: '用户名不能为空'
          })
        } else if (this.User.account == "") {
          this.$message({
            type: 'error',
            message: '账号不能为空'
          })
        } else if (this.User.password == "") {
          this.$message({
            type: 'error',
            message: '密码不能为空'
          })
        } else if(this.aboutRole.id2 == ""){
          this.$message({
            type:'error',
            message:'请选择要分配的角色'
          })
        }else {
          this.User.roleIds = [this.aboutRole.id2];
          console.log(this.User)
          var data = exMessage(this.User);
          addUser(data).then(res => {
            console.log(res)
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.addCreate = false;
              this.searchAllUsers(this.pageinfo.currentPage, this.pageinfo.pageSize);
            } else if (res.code == 501) {
              if (res.msg == "Token expire") {
                this.$router.push('/login');
              }
            } else if (res.code == 505) {
              if (res.msg == "Account already exist" || res.msg == "Data already exist") {
                this.$message({
                  type: "info",
                  message: "该账号已存在"
                })
              }
            } else {
              this.$message({
                type: "error",
                message: res.msg
              })
            }
          });
        }
      },

      delUser(id){
        var data1 = {
          id: id
        };
        var data = exMessage(data1);
        delUser(data).then(res => {
          console.log(res)
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功"
            })
            this.searchAllUsers(this.pageinfo.currentPage, this.pageinfo.pageSize);
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

      disUser(id, state){
        console.log(state)
        var newState;
        if (state == "禁用") {
          newState = 0
        } else {
          newState = 1
        }
        console.log(newState)
        var data1 = {
          id: id,
          forbidState: newState,
        };
        var data = exMessage(data1);

        updateUser(data).then(res => {
          console.log(res)
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.searchAllUsers(this.pageinfo.currentPage, this.pageinfo.pageSize);
          } else if (res.msg == "Token expire") {
            this.$router.push('/login');
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      },
      updatePassword(){
        if (this.newPassword.password == "") {
          this.$message({
            type: 'error',
            message: '请输入新密码'
          })
        } else {
          var data = exMessage(this.newPassword);
          updateUser(data).then(res => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.updatePassWord = false;
            } else if (res.msg == "Token expire") {
              this.$router.push('/login');
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }
      },

      searRole(id){
        var data1 = {
          userId:id
        };
        console.log(data1)
        var data = exMessage(data1)
        SearchUserRole(data).then(res => {
          this.userRoleList = [];
          this.userRoleS = true;
          if(res.code == 0){
            this.userRoleList = res.userRoleList[0].roleList;
          }

        })
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
        this.Users = {
          account:'',
          roleId:''
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
  }
</style>
