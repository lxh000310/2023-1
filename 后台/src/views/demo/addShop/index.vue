<template>
  <d2-container>

    <el-button size="small" class="backIndex" @click="backIndex">返回上层</el-button>
    <hr>
    <div class="aboutTitle">基本信息</div>

    <div style="width: 100%;height: 180px;">
      <span class="From-text" style="margin-left: 20%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;">平 台</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable" style="width: 200px;margin-left: 2%;" class="el-select" v-model="aboutInfo.stage">
          <el-option v-for="type in stageList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
      </span>

      <span class="From-text" style="margin-left: 4%;width: 45%;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;">平台商品ID</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px;margin-left: 2%;" v-model="aboutInfo.code"/>
        <span class="tipSt">商品ID需要与淘宝保持一致</span>
      </span>

      <span class="From-text" style="margin-left: 18.3%;margin-top: 10px;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;">商品类型</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable" style="width: 200px;margin-left: 2%;" class="el-select" v-model="aboutInfo.type">
          <el-option v-for="type in typeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
      </span>

      <span class="From-text" style="margin-left: 6.6%;width: 45%;margin-top: 10px;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;">商品名称</span>
        <el-input type="text" placeholder="请输入平台商品ID" style="width: 200px;margin-left: 2%;" v-model="aboutInfo.name"/>
        <span class="tipSt">商品名称可自定义，不需要与淘宝一致</span>
      </span>
      <span class="From-text" style="margin-left: 16.3%;margin-top: 10px;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;">是否线索下发</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable" style="width: 200px;margin-left: 2%;" class="el-select" v-model="aboutInfo.send">
          <el-option v-for="type in stateList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
      </span>
    </div>
    <div class="aboutTitle">车辆信息
      <span>确定后，车系车型只能新增不能删除修改，如需删除或修改则需要新建商品</span>
    </div>
    <el-button size="small" type="primary" class="addNewCar" @click="addCars">选择车辆</el-button>

    <el-table :data="tableData" style="width: 100%;" ref="xTable">
      <el-table-column prop="id" label="序号" align='center'>
      </el-table-column>
      <el-table-column prop="series" label="车系" align='center'>
      </el-table-column>
      <el-table-column prop="model" label="车型" align='center'>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin: 0;margin-top:30px;">
      <el-button size="small"  @click="backIndex">取 消</el-button>
      <el-button size="small" type="primary" @click="addNewShop">确 定</el-button>
    </div>

    <el-dialog title="选择车辆" :visible.sync="this.carSelectState" width="800px" :showClose="false">

      <el-select size="small" placeholder="请选择车系" style="width: 200px;" @change="resectList" class="el-select" v-model="findCarID">
        <el-option v-for="type in carList" :label="type.series" :value="type.id" :key="type.id"></el-option>
      </el-select>

      <el-button size="small" type="primary" style="margin-left: 3%;" @click="findCars">搜 索</el-button>

      <table style="margin-top: 20px;">
        <tr style="font-size: 15px;font-weight: bolder">
          <td style="width: 50%;"><div style="width: 100%;text-align: center;">所有车型</div></td>
          <td style="width: 200px;" valign="middle"></td>
          <td style="width: 50%;"><div style="width: 100%;text-align: center;">选中车型</div></td>
        </tr>
        <tr class="item-default">
          <td align="right">
            <select id="sel_all_area" size="10" style="width:100%;height: 400px" v-model="addSelect">
              <option v-for="api in allList" :value="api.id" @dblclick="selectOne" style="text-align: center;">{{api.model}}({{api.skuCode}})</option>
            </select>
          </td>
          <td style="width: 200px;" valign="middle">
            <button type="button" v-on:click="selectAll" style="width: 100%;"><i class="fa fa-angle-double-right" aria-hidden="true"></i></button>
            <button type="button" v-on:click="selectOne" style="width: 100%;margin-top: 10px;"><i class="fa fa-angle-right" aria-hidden="true"></i></button>
            <button type="button" v-on:click="removeOne" style="width: 100%;margin-top: 10px;"><i class="fa fa-angle-left" aria-hidden="true"></i></button>
            <button type="button" v-on:click="removeAll" style="width: 100%;margin-top: 10px;"><i class="fa fa-angle-double-left" aria-hidden="true"></i></button>
          </td>
          <td>
            <select id="sel_selected_areas" size="10" style="width:100%;;height: 400px" v-model="removeSelect">
              <option v-for="api in selectedList" :value="api.id" @dblclick="removeOne" style="text-align: center;">{{api.model}}({{api.skuCode}})</option>
            </select>
          </td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td>
            <div style="text-align: right; margin: 0;margin-top:30px;">
              <el-button size="small"  @click="Cloose">取 消</el-button>
              <el-button size="small" type="primary"  @click="getSelectAllCars">确 定</el-button>
            </div>
          </td>
        </tr>

      </table>

    </el-dialog>

  </d2-container>
</template>

<script>
  import {SearchAllCarsList , searchCarModle} from '@/api/Cars'
  import {AddNewShop , searchAllShop , updateShop , searchCarByShop , updateShopCar} from '@/api/Shop'
  import { mapState, mapActions } from 'vuex'
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
      ElInput
    },
    name: 'demotalbe',
    data () {
      return {
        tableData: [],
        carMap:'',
        carSelectState:false,
        addSelect:'',
        removeSelect:'',
        findCarID:'',
        aboutDisable:'',
        aboutID:'',
        allList:[], // 等待选中的
        selectedList:[],//
        carList:[],
        stageList:[
          {id:-1,name:'请选择'},
          {id:0,name:'天猫订单'},
          {id:1,name:'京东订单'},
          {id:2,name:'京东线索平台'},
          {id:3,name:'其他'},
        ],
        typeList:[
          {id:-1,name:'请选择'},
          {id:0,name:'整车订金'},
          {id:1,name:'日常试驾'},
          {id:2,name:'其他'}
        ],
        stateList:[
          {id:-1,name:'请选择'},
          {id:0,name:'否'},
          {id:1,name:'是'},
        ],
        aboutInfo:{
          stage:-1,
          send:1,
          type:-1,
          code:'',
          name:'',
          valid:1,
          models:[]
        }
      }
    },
    computed: {
      ...mapState('d2admin/page', [
        'opened',
        'current'
      ]),
    },
    watch: {},
    // 方法集合
    methods: {
      ...mapActions('d2admin/page', [
        'close'
      ]),
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

      //获取左侧菜单栏
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

      Cloose () {
        this.carSelectState = false;
        this.selectedList = [];
        this.allList = [];
        this.findCarID = ''
      },
      resectList(){
        this.allList = [];
        this.selectedList = [];
      },

      findCars(){
        if(changeEx()){
          this.getCar();
        }else{
          getNewKey();
          setTimeout(function () {
            this.getCar();
          })
        }
      },

      getCar(){
          if(this.findCarID == ''){
            this.$message({
              type: "error",
              message: "请联先选择"
            })
          }else{
            var obj = {
              series:this.findCarID
            };
            var data = exMessage(obj);
            searchCarModle(data).then(res => {
              if(res.code == 0){
                this.allList = res.list;
              }else if (res.code == 501) {
                if (res.msg == "Token expire") {
                  this.$router.push('/login');
                }
              } else {
                this.$message({
                  type: "error",
                  message: "系统异常，请联系管理员"
                })
              }
            })
          }
      },
      //左右选择
      selectAll(){
        this.selectedList = this.allList;
        this.allList = [];
      },
      selectOne(){
        for(let i=0;i<this.allList.length;i++){
          if(this.allList[i].id == this.addSelect){
            this.selectedList.push(this.allList[i])
            this.allList.splice(i,1);
          }
        }
      },
      removeOne(){
        for(let i=0;i<this.selectedList.length;i++){
          if(this.selectedList[i].id == this.removeSelect){
            this.allList.push(this.selectedList[i])
            this.selectedList.splice(i,1);
          }
        }
      },
      removeAll(){
        this.allList = this.selectedList;
        this.selectedList = [];
      },

      getSelectAllCars(){
        for(var i = 0;i < this.selectedList.length;i++){
          var json = {
            id:this.selectedList[i].id,
            series:this.carMap.get(this.selectedList[i].series),
            model:this.selectedList[i].model
          }
          this.tableData.push(json)
        }

        this.Cloose();
      },

      getTableData () {
        if(changeEx()){
          console.log(this.aboutID)

          if(this.aboutID != "" ){
            this.findShopInfo(this.aboutID);
            this.searchByCar(this.aboutID);
          }

          this.searchAllcar();
        }else{
          getNewKey();
          setTimeout(function () {
            if(this.aboutID != "" ){
              this.findShopInfo(this.aboutID);
              this.searchByCar(this.aboutID);
            }
            this.searchAllcar();
          })
        }
      },

      searchByCar(id){
        var obj = {
          skuId:id
        };
        var data = exLongMessage(obj);
        searchCarByShop(data).then(res => {
          if(res.code == 0){
            for(var  i = 0; i < res.skuModelList[0].modelList.length; i++){
              var json = {
                id:res.skuModelList[0].modelList[i].id,
                series:res.skuModelList[0].modelList[i].series.series,
                model:res.skuModelList[0].modelList[i].model
              };
              this.tableData.push(json);
            }
          }
        })
      },

      findShopInfo(id){
        var obj = {
            id:id,
          current:1,
          size:1000000
        };
        var data = exLongMessage(obj);
        searchAllShop(data).then(res => {
          console.log(res)

          if(res.code == 0){
              this.aboutInfo = res.page.list[0]
          }
        })
      },

      searchAllcar(){
        var obj = {
          send:1,
          valid:0
        };
        var data = exLongMessage(obj);
        SearchAllCarsList(data).then(res => {
          if(res.code == 0){
            this.carList = res.list;
            var map = new Map();
            for(var i = 0; i < res.list.length; i++){
              map.set(res.list[i].id,res.list[i].series)
            }
            this.carMap = map;
          }
        })
      },

      backIndex(){
        var tagName = this.current;
        this.close({tagName})
      },

      addCars(){
        this.carSelectState = true;
      },

      addNewShop(){
        if(changeEx()){
          if(this.aboutID == ''){
            this.saveNewShop();
          }else{
            this.updateCar();
          }
        }else{
          getNewKey();
          setTimeout(function () {
            this.$message({
              type: "error",
              message: "服务器异常，请重试"
            })
          },1000)
        }
      },

      saveNewShop(){
        if(this.aboutInfo.stage == -1){
          this.$message({
            type: "error",
            message: "请选择对应的平台"
          })
        }else if(this.aboutInfo.code == ''){
          this.$message({
            type: "error",
            message: "请输入平台商品ID"
          })
        }else if(this.aboutInfo.type == -1){
          this.$message({
            type: "error",
            message: "请选择商品类型"
          })
        }else if(this.aboutInfo.name == ''){
          this.$message({
            type: "error",
            message: "请输入商品名称"
          })
        }else if(this.aboutInfo.send == -1){
          this.$message({
            type: "error",
            message: "请选择是否进行CRM下发"
          })
        }else if(this.tableData.length < 1){
          this.$message({
            type: "error",
            message: "请选择需要关联的车辆"
          })
        }else{
          for(var i = 0; i < this.tableData.length; i++){
            this.aboutInfo.models.push(this.tableData[i].id)
          }
          var obj = this.aboutInfo;
          var data = exLongMessage(obj);
          AddNewShop(data).then(res => {
            if(res.code == 0){
              var tagName = this.current;
              this.close({tagName})
              this.$message({
                type: "success",
                message: "创建成功"
              })
            }
          })
        }
      },

      updateCar(){
        if(this.aboutInfo.name == ''){
          this.$message({
            type: "error",
            message: "商品名称不能为空"
          })
        }else{
          var obj = {
            id:this.aboutID,
            name:this.aboutInfo.name,
          }
          var data = exLongMessage(obj);

          updateShop(data).then(res => {
            if(res.code == 0){
              var obj = {
                dataArray:[]
              };
              for(var i = 0; i < this.tableData.length; i++){
                var json = {
                  id1:this.aboutID,
                  id2:'',
                };
                json.id2 = this.tableData[i].id;
                obj.dataArray.push(json);
              }
              var data = exLongMessage(obj);
              updateShopCar(data).then(res => {
                if(res.code == 0){
                  var tagName = this.current;
                  this.close({tagName})
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  })
                }
              })
            }
          })
        }
      },


    },
// 生命周期 - 创建完成（可以访问当前this实例）
    created () {
      console.log(this.$route.query.aboutID);
      if(this.$route.query.aboutID == undefined){
        this.aboutDisable = false;
      }else{
        this.aboutID = this.$route.query.aboutID
        this.aboutDisable = true;
      }

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
  .backIndex{
    line-height: 0;
  }
  .aboutTitle{
    background-color:#f4f7f8;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    font-weight: bolder;
    padding-left: 15px;
    margin: 10px;
  }

  .aboutTitle > span{
    font-size: 12px;
    color:red;
    margin-left: 50px;
  }

  .From-text{
    display: flex;
    float: left;
    font-size: 12px;
    width: 30%;
    height: 40px;
    line-height: 40px;
  }

  .tipSt{
    color: #999999;
    margin-left: 2%;
  }

  .addNewCar{
    margin-top: 20px;
    margin-left: 60px;
  }

</style>
