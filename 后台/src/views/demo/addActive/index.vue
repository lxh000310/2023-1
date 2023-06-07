<template>
  <d2-container>

    <el-button size="small" class="backIndex" @click="backIndex">返回上层</el-button>
    <hr>
    <div class="aboutTitle">活动信息</div>
    <div style="width: 100%;height: 180px;">
      <p class="From-text" style="margin-left: 5%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 0.5%;">活动名称：</span>
        <el-input type="text" placeholder="请输入活动名称" v-model="actInfo.name" style="width: 30%;max-width: 200px;"></el-input>
      </p>

      <p class="From-text" style="margin-left:5%;margin-top: 10px;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 0.5%;">平 台：</span>
        <el-select size="small" placeholder="请选择" :disabled="aboutDisable" style="width: 100px;margin-left: 20px;" v-model="actInfo.stage" class="el-select">
          <el-option v-for="type in typeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
      </p>

      <p class="From-text" style="margin-left: 5%;margin-top: 10px;">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 0.5%;">活动时间：</span>
        <el-date-picker
          v-model="aboutTimes"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </p>

      <p class="From-textarea">
        <span>备注：</span>
        <textarea v-model="actInfo.remark"></textarea>
      </p>

    </div>
    <div class="aboutTitle">活动规则</div>
      <p class="From-text" style="margin-left: 5%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 0.5%;">条件1：订单姓名是否和开票姓名一致</span>
        <el-radio v-model="actInfo.checkName" label="1" style="margin-left: 20px;">是</el-radio>
        <el-radio v-model="actInfo.checkName" label="0">否</el-radio>
      </p>

      <p class="From-text" style="margin-left: 5%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 0.5%;">条件2：订单时间是否早于开票时间</span>
        <el-radio v-model="actInfo.checkTime" label="1" style="margin-left: 20px;">是</el-radio>
        <el-radio v-model="actInfo.checkTime" label="0">否</el-radio>
      </p>

      <p class="From-text" style="margin-left: 5%">
        <span style="color: red;font-size: 15px">*</span>
        <span style="margin-left: 0.5%;">条件3：核销经销商是否和开票经销商一致</span>
        <el-radio v-model="actInfo.checkDealer" label="1" style="margin-left: 20px;">是</el-radio>
        <el-radio v-model="actInfo.checkDealer" label="0">否</el-radio>
      </p>

      <textarea v-model="actInfo.rules" class="rules"></textarea>

      <el-button @click="backIndex" size="small" style="margin-left: 5%;">保 存</el-button>
      <el-button @click="saveNewAct" size="small" type="primary" style="margin-left: 5%;">确 定</el-button>


  </d2-container>
</template>

<script>
  import {addActive} from '@/api/aboutAct.js'
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
        aboutDisable:'',
        aboutTimes:'',
        typeList:[
          {id:0,name:'天猫'},
          {id:1,name:'京东'},
        ],
        actInfo:{
          stage:'',
          name:'',
          activeBegin:'',
          activeDeadline:'',
          checkName:'',
          checkTime:'',
          checkDealer:'',
          releaseState:'',
          remark:'',
          rules:''
        },
        pickerOptions: {
          disabledDate(v) {
            return v.getTime() < new Date().getTime() - 86400000;
          }
        },
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
//            this.getTableData();
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

      backIndex(){
        var tagName = this.current;
        this.close({tagName})
      },

      saveNewAct(){
        console.log(this.actInfo)

        //加提示
        if(this.actInfo.name == ""){

        }else if(this.actInfo.stage == ""){

        }else if(this.aboutTimes == ''){

        }else if(this.checkName == ""){

        }else if(this.checkTime == ""){

        }else if(this.checkDealer == ""){

        }else{
          this.actInfo.activeBegin = this.aboutTimes[0].getTime();
          this.actInfo.activeDeadline = this.aboutTimes[1].getTime();
          this.actInfo.releaseState = 1;
          console.log(this.actInfo)
          if(changeEx()){
              this.addNewAct();
          }else{
              getNewKey();
              setTimeout(function () {
                this.addNewAct();
              },1000)
          }
        }
      },

      addNewAct(){
          var data = exLongMessage(this.actInfo);

        addActive(data).then(res => {
          console.log(res)
        })
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
    font-size: 12px;
    height: 40px;
    line-height: 40px;
  }

  .From-textarea{
    position: absolute;
    top: 105px;
    margin-left: 50%;
    width: 45%;
    font-size: 12px;
  }

  .From-textarea > span{
    position: absolute;
    top: 10px;
    left: 0px;
    width: 40px;
  }

  .From-textarea > textarea{
    width: 75%;
    height: 140px;
    resize: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-left: 40px;
    max-width: 400px;
  }

  .tipSt{
    color: #999999;
    margin-left: 2%;
  }

  .addNewCar{
    margin-top: 20px;
    margin-left: 60px;
  }

  .rules{
    width: 90% !important;
    height: 140px;
    resize: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-left: 5%;
  }
</style>
