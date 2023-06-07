<template>
  <d2-container>

    <span style="margin-left: 30px;">
      <span class="aboutTitle">权益类型：</span>
      <el-select size="small" placeholder="请选择" style="width: 100px;" class="el-select" v-model="Tag.type">
        <el-option v-for="type in tagState" :label="type.name" :value="type.id" :key="type.id"></el-option>
      </el-select>
    </span>

    <span style="margin-left: 30px;">
      <span class="aboutTitle">权益名称：</span>
      <el-input
        type="text"
        v-model="Tag.name"
        placeholder="请输入权益名称"
        style="width: 200px;"
      />
    </span>

    <span style="margin-left: 30px;">
      <span class="aboutTitle">零件号：</span>
      <el-input
        type="text"
        v-model="Tag.partNum"
        placeholder="请输入零件号"
        style="width: 200px;"
      />
    </span>

    <span style="margin-left: 30px;">
      <span class="aboutTitle">仓库礼品id：</span>
      <el-input
        type="text"
        v-model="Tag.iid"
        placeholder="请输入仓库礼品id"
        style="width: 200px;"
      />
    </span>

    <el-button type="primary" size="small" v-show="true" style="margin-left: 20px;" @click="serachBY()">查询</el-button>
    <el-button type="primary" size="small" v-show="true" @click="clearBY()">重置</el-button>
    <!---->
    <el-button type="primary" size="small" v-show="true" v-if="searchUserRole('/oms-order/gift/item/add')" @click="addTag()">新建权益</el-button>
    <hr>
    <el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
      <el-table-column prop="type" label="权益类型" align='center'>
      </el-table-column>
      <el-table-column prop="partNum" label="零件号" align='center'>
      </el-table-column>
      <el-table-column prop="iid" label="仓库礼品ID" align='center' show-overflow-tooltip :render-header="renderHeader">
      </el-table-column>
      <el-table-column prop="name" label="权益名称" align='center'>
      </el-table-column>
      <!--<el-table-column prop="num" label="数量" align='center' sortable="custom">-->
      <!--</el-table-column>-->
      <el-table-column prop="remark" label="备注" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small"v-if="searchUserRole('/oms-order/gift/item/change')" @click="changeCubes(scope.$index, scope.row)" type="text" prop="likeNumber">
            编辑
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

    <el-dialog title="新建" :visible.sync="this.addNewGifts" width="600px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="NewTag" label-width="120px">
        <p style="text-align: center">
          <span class="aboutTitle">权益类型：</span>
          <el-select size="small" placeholder="请选择" style="width: 200px;" class="el-select" v-model="NewTag.type">
            <el-option v-for="type in tagState" :label="type.name" :value="type.id" :key="type.id"></el-option>
          </el-select>
        </p>
        <p style="text-align: center" v-if="NewTag.type == 1">
          <span class="aboutTitle" style="margin-left: 18px;">仓库礼品id：</span>
          <el-input type="text" v-model="NewTag.iid" placeholder="请输入仓库礼品id" style="width: 200px;"/>
          <el-tooltip effect="light" content="具体id请参阅仓库的礼品id">
            <i class="el-icon-question" style="font-size: 20px;margin-left: 10px;"/>
          </el-tooltip>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle">权益名称：</span>
          <el-input type="text" v-model="NewTag.name" placeholder="请输入权益名称" style="width: 200px;"/>
        </p>
        <p style="text-align: center" v-if="NewTag.type == 1">
          <span class="aboutTitle" style="margin-left: 12px;">零件号：</span>
          <el-input type="text" v-model="NewTag.partNum" placeholder="请输入零件号" style="width: 200px;"/>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle" style="margin-left: 30px;position: relative;top: -60px;">备注：</span>
          <textarea v-model="NewTag.remark" style="width: 200px;height: 70px;resize:none;border:1px solid #DCDFE6;border-radius: 4px;"></textarea>
        </p>
      </el-form>
      <div style="text-align: right; margin: 0;margin-top:30px;">
        <el-button type="primary" size="small" @click="AddNewTag()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改" :visible.sync="this.changeXN" width="600px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="xn" label-width="120px">
        <p style="text-align: center">
          <span class="aboutTitle">权益类型：</span>
          <el-input type="text" v-model="xn.type" disabled placeholder="请输入权益名称" style="width: 200px;"/>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle">权益名称：</span>
          <el-input type="text" v-model="xn.name" placeholder="请输入权益名称" style="width: 200px;"/>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle" style="margin-left: 30px;position: relative;top: -60px;">备注：</span>
          <textarea v-model="xn.remark" style="width: 200px;height: 70px;resize:none;border:1px solid #DCDFE6;border-radius: 4px;"></textarea>
        </p>
      </el-form>
      <div style="text-align: right; margin: 0;margin-top:30px;">
        <el-button type="primary" size="small" @click="updateTag()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog title="修改" :visible.sync="this.changeSW" width="600px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="sw" label-width="120px">
        <p style="text-align: center">
          <span class="aboutTitle">权益类型：</span>
          <el-input type="text" v-model="sw.type" disabled placeholder="请输入仓库礼品id" style="width: 200px;"/>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle" style="margin-left: -11px;">仓库礼品id：</span>
          <el-input type="text" v-model="sw.iid" disabled placeholder="请输入仓库礼品id" style="width: 200px;"/>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle">权益名称：</span>
          <el-input type="text" v-model="sw.name" disabled placeholder="请输入权益名称" style="width: 200px;"/>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle" style="margin-left: 12px;">零件号：</span>
          <el-input type="text" v-model="sw.partNum" disabled placeholder="请输入零件号" style="width: 200px;"/>
        </p>
        <p style="text-align: center">
          <span class="aboutTitle" style="margin-left: 30px;position: relative;top: -60px;">备注：</span>
          <textarea v-model="sw.remark" style="width: 200px;height: 70px;resize:none;border:1px solid #DCDFE6;border-radius: 4px;"></textarea>
        </p>
      </el-form>
      <div style="text-align: right; margin: 0;margin-top:30px;">
        <el-button type="primary" size="small" @click="updateTag()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
  import {SearchGift , AddGift , updateGift} from '@/api/tag'
  import {SearchUserRole} from '@/api/Role'
  import {exMessage , changeEx , getNewKey , exLongMessage} from '@/libs/exJSE.js'
  import {getMenuList , getPathList} from '@/api/Login'
  import {supplementPath} from '@/menu/index.js'
  import store from '@/store/index'
  import {find} from 'lodash'
  import util from '@/libs/util.js'
  import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
  export default {
    components: {ElInput},
    name: 'demotalbe',
    data () {
      return {
        loading: false,
        addNewGifts: false,
        changeSW:false,
        changeXN:false,
        tableData: [],
        tagState:[
          {id:0,name:'虚拟权益'},
          {id:1,name:'实物权益'},
        ],
        Tag:{
          iid:'',
          name:'',
          partNum:'',
          type:''
        },
        xn:{
          id:'',
          name:'',
          type:'',
          remark:''
        },
        sw:{
          id:'',
          name:'',
          type:'',
          remark:'',
          iid:'',
          partNum:''
        },
        NewTag:{
          iid: '',
          name: "",
          num: 1,
          partNum: "",
          remark: "",
          type: -1,
          unit: '默认单位'
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
        this.searchAllCubes(pageinfo.currentPage, pageinfo.pageSize);
      },
      Cloose () {
        this.changeXN = false;
        this.changeSW = false;
        this.addNewGifts = false;
      },

      renderHeader(h,{column , $index}){
          return[
            column.label,
            h('el-tooltip',{props:{content:(function () {return 'ccccccccccccccccccc'})(),placement:'top'}}, [h('span',{class:{'el-icon-question':true}})])
          ]
      },

      //查询按钮级别的权限
      searchUserRole(string){
        for(var i = 0; i < UserRole.length; i++){
          if(UserRole[i] == string){
            return true;
          }
        }
      },

      changeCubes(index,row){
        this.xn = {id:'',name:'',type:'',remark:''};
        this.sw = {id:'',name:'',type:'',remark:'',iid:'', partNum:''};
        console.log(index,row);
        if(row.type == "虚拟"){
          this.xn.id = row.id;
          this.xn.name = row.name;
          this.xn.type = row.type;
          this.xn.remark = row.remark;
          this.changeXN = true;
        }else{
          this.sw.id = row.id;
          this.sw.name = row.name;
          this.sw.type = row.type;
          this.sw.remark = row.remark;
          this.sw.partNum = row.partNum;
          this.sw.iid = row.iid;
          this.changeSW = true;
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
        this.pageinfo = {
          currentPage: 1,
            pageSize: 10,
            totalResult: 600
        };
        this.searchAllCubes(1, 10);
      },

      searchAllCubes(page, size){
        if (changeEx()) {
          this.SearchCubes(page, size)
        } else {
          getNewKey();
          setTimeout(function () {
            this.SearchCubes(page, size)
          }, 1000)
        }
      },

      SearchCubes (pageCount, pageSize) {
        var data1 = {
          current: pageCount,
          size: pageSize,
          type:this.Tag.type,
          iid:this.Tag.iid,
          name:this.Tag.name,
          partNunm:this.Tag.partNum
        };
        var data = exLongMessage(data1);
        SearchGift(data).then(res => {
            console.log(res)
          if (res.code == 0) {
            for(var i = 0; i < res.page.list.length; i++){
              if(res.page.list[i].type == 1){
                res.page.list[i].type = "实物";
              }else{
                res.page.list[i].type = "虚拟";
              }
            }
            this.tableData = res.page.list;
            this.pageinfo.totalResult = res.page.totalCount;
          }
        })
      },

      AddNewTag(){
        console.log(this.NewTag);
        if(this.NewTag.type == -1){
          this.$message({
            type: "error",
            message: "请选择权益类型"
          })
        }else if(this.NewTag.name == ''){
          this.$message({
            type: "error",
            message: "请输入权益名称"
          })
        }else if(this.NewTag.num == ''){
          this.$message({
            type: "error",
            message: "请输入数量"
          })
        }else if(this.NewTag.unit == ''){
          this.$message({
            type: "error",
            message: '请输入单位'
          })
        }else{
          var data = exLongMessage(this.NewTag);
          //新增权益
          AddGift(data).then(res => {
            if(res.code == 0){
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.addNewGifts = false;
              this.getTableData();
            }else{
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          })
        }
      },

      addTag(){
        this.NewTag = {iid: '',name: "",num: 1,partNum: "",remark: "",type: '',unit: "默认单位"}
        this.addNewGifts = true;
      },

      updateTag(){
        if(this.sw.id == ""){
          var obj = {
            id:this.xn.id,
            name:this.xn.name,
            remark:this.xn.remark
          };
          var data = exLongMessage(obj);
        }else{
          var obj = {
            id:this.sw.id,
            remark:this.sw.remark
          };
          var data = exLongMessage(obj);
        }

        updateGift(data).then(res => {
          if(res.code == 0){
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.changeXN = false;
            this.changeSW = false;
            this.searchAllCubes(this.pageinfo.currentPage, this.pageinfo.pageSize);
          } else{
            this.$message({
              type: "error",
              message: res.msg
            });
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
        console.log(this.Tag)
        this.getTableData();
      },
      clearBY(){
        this.Tag = {
          iid:'',
            name:'',
            partNum:'',
            type:''
        };
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
