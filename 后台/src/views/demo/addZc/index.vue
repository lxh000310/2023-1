<template>
  <d2-container>

    <el-button size="small" class="backIndex" @click="backIndex">返回上层</el-button>
    <hr>
    <div class="aboutTitle">基本信息</div>

    <div style="width: 100%;height: 270px;">
      <span class="From-text" style="margin-left: 5%;width: 40%;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">政策名称：</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px" />
      </span>

      <span class="From-text" style="margin-left: 4%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">市场活动名称：</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px;" />
      </span>

      <span class="From-text" style="margin-left: 5%;width: 40%;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">政策有效时间：</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px" />
      </span>

      <span class="From-text" style="margin-left: 4%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">市场活动代码：</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px;" />
      </span>

      <span class="From-text" style="margin-left: 5%;width: 40%;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">限定下单时间：</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px" />
      </span>

      <span class="From-text" style="margin-left: 4%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">是否管理小程序：</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable" style="width: 200px;margin-left: 2%;" class="el-select" >
          <el-option v-for="type in stageList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
      </span>

      <span class="From-text" style="margin-left: 5%;width: 40%;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">限定核销时间：</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px" />
      </span>

      <span class="From-text" style="margin-left: 4%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">是否需要审核：</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable" style="width: 200px;margin-left: 2%;" class="el-select" >
          <el-option v-for="type in typeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
      </span>

      <span class="From-text" style="margin-left: 5%;width: 40%;">
        <span style="color: red;font-size: 15px"></span>
        <span style="margin-left: 2%;width: 120px;">限定开票时间：</span>
        <el-input type="text" placeholder="请输入平台商品ID" :disabled="aboutDisable" style="width: 200px" />
      </span>

      <span class="From-text" style="margin-left: 4%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 2%;width: 120px;">选择审核人员：</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable" style="width: 200px;margin-left: 2%;" class="el-select" >
          <el-option v-for="type in stateList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
      </span>

    </div>
    <div class="aboutTitle">商品信息</div>
      <div style="margin-left: 5%;">
        <span style="color: red">*</span>
        <span>关联政策商品</span>
        <el-button size="small" type="primary" class="addNewShop" @click="addShop">选择商品</el-button>
      </div>
    <el-table :data="tableData" style="width: 100%;" ref="xTable">
      <el-table-column prop="id" label="序号" align='center'>
      </el-table-column>
      <el-table-column prop="series" label="车系" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small" @click="changeShop(scope.$index, scope.row)" type="text" prop="likeNumber">
            编 辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="aboutTitle">权益信息</div>
      <p style="margin-left: 5%;">
        <span>请选择需要关联的权益包：</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable"class="el-select" >
        <el-option v-for="type in stateList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
        <el-button size="small" type="primary" style="margin-left: 10px;" @click="backIndex">添 加</el-button>
      </p>

      <p style="margin-left: 5%;">
        <span>关联的权益包：</span>
      </p>
    <el-table :data="tableData" style="width: 100%;" ref="xTable">
      <el-table-column prop="id" label="权益包名称" align='center'>
      </el-table-column>
      <el-table-column prop="series" label="权益包编码" align='center'>
      </el-table-column>
      <el-table-column prop="state" label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small" @click="changeShop(scope.$index, scope.row)" type="text" prop="likeNumber">
            编 辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="aboutTitle">商家编码</div>
      <p>
        <span style="margin-left: 5%">商家编码：</span>
        <el-input type="text" v-model="inputCode" placeholder="请输入商家编码" :disabled="aboutDisable" style="width: 200px;margin-left: 10px;" />
        <el-button size="small" style="margin-left: 10px;" @click="addCode">添 加</el-button>
      </p>


    <div class="Tips" v-for="(tips,i) in TipsList">
      <div >{{tips.name}}</div>
      <button v-on:click="delThis(i)" class="Tipsbutton" >X</button>
    </div>



    <div style="float:right;text-align: right; margin: 0;margin-top:70px;">
      <el-button size="small"  @click="backIndex">取 消</el-button>
      <el-button size="small" type="primary" @click="addNewShop">确 定</el-button>
    </div>

    <el-dialog title="选择商品" :visible.sync="this.carSelectState" width="800px" :showClose="false">

      <table>
        <tr style="font-size: 15px;font-weight: bolder">
          <td style="width: 50%;"><div style="width: 100%;text-align: center;">所有商品</div></td>
          <td style="width: 200px;" valign="middle"></td>
          <td style="width: 50%;"><div style="width: 100%;text-align: center;">选中商品</div></td>
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
        TipsList:[],
        carSelectState:false,
        aboutDisable:'',
        inputCode:'',
        aboutID:'',
        allList:[], // 等待选中的
        selectedList:[],//
        stageList:[
          {id:-1,name:'请选择'},

        ],
        typeList:[
          {id:-1,name:'请选择'},

        ],
        stateList:[
          {id:-1,name:'请选择'},

        ],

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

      },
      backIndex(){
        var tagName = this.current;
        this.close({tagName})
      },

      addShop(){
        this.carSelectState = true;
      },
      addCode(){
        var findThis = false;

        for(var i = 0 ; i < this.TipsList.length; i++ ){
            if(this.TipsList[i].name == this.inputCode){
              findThis = true;
            }
        }
        if(!findThis){
          var obj = {name:this.inputCode}
          this.TipsList.push(obj)
        }else{
          this.$message({
            type: "info",
            message: '请勿重复添加相同的商家编码'
          })
        }
      },

      delThis(index){
        this.TipsList.splice(index,1);
        console.log(this.TipsList)
      }
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
    text-align: center;
    font-size: 12px;
    height: 40px;
    margin-top: 10px;
    line-height: 40px;
  }

  .tipSt{
    color: #999999;
    margin-left: 2%;
  }

  .addNewShop{
    margin-left: 10px;
  }

  .Tips{
    width: 100px;height: 40px;position: relative;top:0;left:0;display:flex;float:left;
    cursor: pointer;
    line-height: 40px;
    margin-left: 10px;
    margin-bottom: 10px
  }

  .Tips > div{
    width: 100%;
    text-align: center;
    background-color: #f4f7f8;
  }

  .Tips > button{
    cursor: pointer;
    display: none;
  }

  .Tips:hover .Tipsbutton{
    display: block;
  }

  .Tipsbutton{
    border: 0px;transform: translate(430%, -50%);position: absolute;top: 0;left: 0;background-color: rgba(0,0,0,0)
  }

</style>
