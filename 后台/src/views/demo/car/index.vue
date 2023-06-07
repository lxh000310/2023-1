<template>
  <d2-container>

    <span style="margin-left: 30px;">
      <span class="aboutTitle">车系：</span>
      <el-input
        type="text"
        v-model="Cars.series"
        placeholder="请输入车系名称"
        style="width: 200px;"
      />
    </span>

    <span style="margin-left: 30px;">
      <span class="aboutTitle">车型：</span>
      <el-input
        type="text"
        v-model="Cars.model"
        placeholder="请输入车型名称"
        style="width: 200px;"
      />
    </span>

    <el-button type="primary" size="small" v-show="true" style="margin-left: 20px;" @click="serachBY()">查询</el-button>
    <el-button type="primary" size="small" v-show="true" @click="clearBY()">重置</el-button>
    <el-button type="primary" size="small" v-show="true" v-if="searchUserRole('/oms-order/crm/series/add')" @click="addCars()">新建车系</el-button>
    <hr>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
      <el-table-column prop="series" label="车系" align='center'>
      </el-table-column>
      <el-table-column prop="code" label="车辆代码" align='center'>
      </el-table-column>
      <el-table-column prop="valid" label="状态" align='center'>
      </el-table-column>
      <!--<el-table-column prop="send" label="是否下发CRM" align='center'>-->
      <!--</el-table-column>-->
      <el-table-column prop="created" label="创建日期" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small" v-if="searchUserRole('/oms-order/crm/series/list')" @click="searchModellist(scope.$index, scope.row)" type="text" prop="likeNumber">
            查看车型
          </el-button>
          <el-button size="small"v-if="searchUserRole('/oms-order/crm/series/remove')" @click="delCars(scope.$index, scope.row)" type="text" prop="likeNumber">
            删除
          </el-button>
          <el-button size="small"v-if="searchUserRole('/oms-login/sys/userRole/list')" @click="updateCared(scope.$index, scope.row)" type="text" prop="likeNumber">
            修改
          </el-button>
          <el-button size="small"v-if="searchUserRole('/oms-order/crm/series/change')" @click="changTpye(scope.$index, scope.row)" type="text" prop="likeNumber">
            修改状态
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

    <el-dialog title="新建" :visible.sync="this.addNewCars" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="Car" label-width="120px">
        <p>
          <el-form-item label="车系代码：">
            <el-input
              type="text"
              v-model="Car.code"
              placeholder="设置车系代码"
              style="width: 200px;"
            />
          </el-form-item>
          <span style="color: red;font-size: 20px;line-height: 40px;">*</span>
        </p>
        <p>
          <el-form-item label="车系名称：">
            <el-input
              type="text"
              v-model="Car.series"
              placeholder="请输入车系名称"
              style="width: 200px;"
            />
          </el-form-item>
          <span style="color: red;font-size: 20px;line-height: 40px;">*</span>
        </p>
        <!--<p>-->
          <!--<el-form-item label="是否下发crm：">-->
            <!--<el-select size="small" placeholder="请选择" style="width: 200px;" class="el-select" v-model="Car.send">-->
              <!--<el-option v-for="type in aboutCrm" :label="type.name" :value="type.id" :key="type.id"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<span style="color: red;font-size: 20px;line-height: 40px;">*</span>-->
        <!--</p>-->
      </el-form>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="AddNewCars()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="this.changeOldCars" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="Car" label-width="120px">
        <p>
          <el-form-item label="车系代码：">
            <el-input
              type="text"
              v-model="changeCarA.code"
              placeholder="设置车系代码"
              style="width: 200px;"
            />
          </el-form-item>
          <span style="color: red;font-size: 20px;line-height: 40px;">*</span>
        </p>
        <p>
          <el-form-item label="车系名称：">
            <el-input
              type="text"
              v-model="changeCarA.series"
              placeholder="请输入车系名称"
              style="width: 200px;"
            />
          </el-form-item>
          <span style="color: red;font-size: 20px;line-height: 40px;">*</span>
        </p>
      </el-form>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="updateCar()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看车型" :visible.sync="this.carModle" width="800px" :showClose="false">
      <h2 style="margin: 0;margin-left: 5%;margin-bottom:3%;">车系：{{nowCarModle}}</h2>

      <el-table :data="carsTableList" style="width: 100%;" ref="xTable">
        <el-table-column prop="code" label="车型" align='center'>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.model" placeholder="车型" @blur="onBlue(scope.row)" style="text-align: center"></el-input>
            <span v-else>{{scope.row.model}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="商家代码" align='center'>
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" v-model="scope.row.skuCode" placeholder="商家代码" @blur="onBlue(scope.row)" style="text-align: center"></el-input>
            <span v-else>{{scope.row.skuCode}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="medium" v-if="!scope.row.edit" @click="delModle(scope.row)">删 除</el-button>
              <!--<el-button type="text" size="medium" @click="deleteData(scope.row,scope.$index)">-->
                <!--<i class="el-icon-delete" aria-hidden="true"></i>-->
              <!--</el-button>-->
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" style="margin-top:2%;margin-left: 5%;" icon="el-icon-plus" size="small" v-show="true" v-if="searchUserRole('/oms-order/crm/model/add')" @click="AddNewsCars()">新建车型</el-button>

      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="Cloose()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
  import {SearchAllCars , addCars , DelCars , ChangeCars , searchCarModle , addCarsModle , DelModel} from '@/api/Cars'
  import {SearchUserRole} from '@/api/Role'
  import {exMessage , changeEx , getNewKey} from '@/libs/exJSE.js'
  import {getMenuList , getPathList} from '@/api/Login'
  import {supplementPath} from '@/menu/index.js'
  import store from '@/store/index'
  import {find} from 'lodash'
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  export default {
    components: {ElInput},
    name: 'demotalbe',
    data () {
      return {
        loading: false,
        addNewCars: false,
        changeOldCars: false,
        carModle:false,
        nowCarModle:'',
        tableData: [],
        roleList:[],
        carsTableList:[],
        aboutCrm:[
          {id:-1,name:'请选择'},
          {id:1,name:'下发'},
          {id:0,name:'不下发'}
        ],

        aboutType:[
          {id:0,name:'有效'},
          {id:1,name:'无效'}
        ],

        changeCarA:{
          code: "",
          series: "",
          id:0,
        },

        Cars:{
          series:'',
          model:''
        },
        Car:{
          code: "",
          series: "",
          send: 1,
          valid: 0
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
        this.searchAllCars(pageinfo.currentPage, pageinfo.pageSize);
      },
      Cloose () {
        this.addNewCars = false;
        this.changeOldCars = false;
        this.carModle = false;
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

      getTableData () {
        this.searchAllCars(1, 10);
      },

      searchAllCars(page, size){
        if (changeEx()) {
          this.SearchCars(page, size)
        } else {
          getNewKey();
          setTimeout(function () {
            this.SearchCars(page, size)
          }, 1000)
        }
      },

      SearchCars (pageCount, pageSize) {
        var data1 = {
          current: pageCount,
          size: pageSize,
          series:this.Cars.series,
          model:this.Cars.model
        };
        var data = exMessage(data1);
        SearchAllCars(data).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.page.list.length; i++) {
              if(res.page.list[i].valid == 0){
                res.page.list[i].valid = '有效'
              }else{
                res.page.list[i].valid = '无效'
              }
              if(res.page.list[i].send == 0){
                res.page.list[i].send = '不发送'
              }else{
                res.page.list[i].send = '发送'
              }
            }
            this.tableData = res.page.list;
            this.pageinfo.totalResult = res.page.totalCount;
          }
        })
      },

      searchModellist(index,row){
        this.nowCarModle = row.series;
        this.carModle = true;
        this.addModle = {
          series:row.id,
          model:'',
          skuCode:''
        };
        if (changeEx()) {
          this.searchModle(row.id);
        } else {
          getNewKey();
          setTimeout(function () {
            this.searchModle(row.id);
          }, 1000)
        };
      },

      searchModle(id){
        var obj = {
          series:id
        };
        var data = exMessage(obj);
        searchCarModle(data).then(res => {
          if(res.code == 0){
            this.carsTableList = res.list
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

      delModle(row){
        var list = [row.id];
        var obj = {
          dataArray:list,
        };
        var data = exMessage(obj)
        DelModel(data).then(res => {
          if(res.code == 0){
            this.searchModle(this.addModle.series);
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

      AddNewsCars(){
        this.carsTableList.push({
          edit: true,
        });
      },

      onBlue(row){
        this.addModle.model = row.model;
        this.addModle.skuCode = row.skuCode;
        console.log(this.addModle,this.addModle.model,this.addModle.skuCode);
        if(this.addModle.model && this.addModle.skuCode){
          if (changeEx()) {
            this.addModleCars();
          } else {
            getNewKey();
            setTimeout(function () {
              this.addModleCars();
            }, 1000)
          }
        }
      },

      addModleCars(){
        var data = exMessage(this.addModle);
        addCarsModle(data).then(res => {
          if(res.code == 0){
            this.searchModle(this.addModle.series);
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

      addCars(){
        this.addNewCars = true;
      },

      updateCared(index,row){
        this.changeOldCars = true;
        this.changeCarA.id = row.id;
        this.changeCarA.code = row.code;
        this.changeCarA.series = row.series;
      },

      updateCar(){
        if (changeEx()) {
          this.updateCars()
        } else {
          getNewKey();
          setTimeout(function () {
            this.updateCars()
          }, 1000)
        }
      },

      updateCars(){
        var data = exMessage(this.changeCarA)
        ChangeCars(data).then(res => {
          if(res.code == 0){
            this.$message({
              type: "success",
              message: '修改成功'
            });
            this.changeOldCars = false;
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

      AddNewCars(){
        if (changeEx()) {
          this.AddnewCars()
        } else {
          getNewKey();
          setTimeout(function () {
            this.AddnewCars()
          }, 1000)
        }
      },

      AddnewCars(){
        if(this.Car.code == ''){
          this.$message({
            type: "error",
            message: '请输入车系代码'
          })
        }else if(this.Car.series == ''){
          this.$message({
            type: "error",
            message: '请输入车系名称'
          })
        }else if(this.Car.send == -1){
          this.$message({
            type: "error",
            message: '请选择是否下发CRM'
          })
        }else{
          var obj = this.Car;
          var data = exMessage(obj);
          addCars(data).then(res => {
            if(res.code == 0){
              this.$message({
                type: "success",
                message: '添加成功'
              });
              this.addNewCars = false;
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
        }
      },

      changSend(index,row){
        var send;
        if(row.send == "发送"){
          send = 0;
        }else{
          send = 1;
        }

        if (changeEx()) {
          this.changeSend(send,row.id)
        } else {
          getNewKey();
          setTimeout(function () {
            this.changeSend(send,row.id)
          }, 1000)
        }
      },

      changeSend(type,id){
          console.log(type)
        var obj = {
          id:id,
          send:type
        };
        var data = exMessage(obj);
        ChangeCars(data).then(res => {
          if(res.code == 0){
            this.$message({
              type: "success",
              message: '修改成功'
            });
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

      changTpye(index,row){
        var type;
        if(row.valid == "有效"){
          type = 1
        }else{
          type = 0
        }

        if (changeEx()) {
          this.changeType(type,row.id)
        } else {
          getNewKey();
          setTimeout(function () {
            this.changeType(type,row.id)
          }, 1000)
        }
      },

      changeType(type,id){
        var obj = {
          id:id,
          valid: type
        };
        var data = exMessage(obj);
        ChangeCars(data).then(res => {
          if(res.code == 0){
            this.$message({
              type: "success",
              message: '修改成功'
            });
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

      delCars(index,row){
        if (changeEx()) {
          this.Delcars(row.id)
        } else {
          getNewKey();
          setTimeout(function () {
            this.Delcars(row.id)
          }, 1000)
        }
      },

      Delcars(id){
        var list = [id];
        var obj = {
          dataArray:list,
        };
        var data = exMessage(obj);
        DelCars(data).then(res => {
          if(res.code == 0){
            this.$message({
              type: "success",
              message: '删除成功'
            });
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
        this.Cars = {
          series:'',
          model:'',
          skuCode:''
        },
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
