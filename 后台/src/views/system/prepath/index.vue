<template>
  <d2-container>
    <!-- query form -->
    <el-button @click="addPath()">添加路径</el-button>
    <el-button @click="addPer()">添加权限</el-button>

    <el-divider></el-divider>

    <el-table :data="tableData" v-loading="loading"  style="width: 100%;"  ref="xTable">
      <el-table-column prop="name" label="具体权限" align='center'>
      </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small" @click="bindPath(scope.$index, scope.row)" type="text" prop="likeNumber">
            绑定路径
          </el-button>

          <el-button size="small" @click="DelPath(scope.$index, scope.row)" type="text" prop="likeNumber">
            删除
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


    <el-dialog title="权限" :visible.sync="this.Prem" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="premAdd" label-width="120px">
        <p>
          <el-form-item label="icon：">
            <el-input
              type="text"
              v-model="premAdd.icon"
              placeholder="请输入用户名"
              style="width: 200px;"
            />
          </el-form-item>
        </p>
        <p>
          <el-form-item label="设置名字：">
            <el-input
              type="text"
              v-model="premAdd.name"
              placeholder="请输入账号"
              style="width: 200px;"
            />
          </el-form-item>
        </p>
        <p>
          <el-form-item label="pid：">
            <el-input
              type="number"
              v-model="premAdd.pid"
              placeholder="请输入密码"
              style="width: 200px;"
            />
          </el-form-item>
        </p>
      </el-form>

      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="addNewP()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="路径" :visible.sync="this.Path" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" :model="pathAdd" label-width="120px">
        <p>
          <el-form-item label="icon：">
            <el-input
              type="text"
              v-model="pathAdd.module"
              placeholder="请输入账号"
              style="width: 200px;"
            />
          </el-form-item>
        </p>

        <p>
          <el-form-item label="菜单名称：">
            <el-input
              type="text"
              v-model="pathAdd.name"
              placeholder="请输入菜单名称"
              style="width: 200px;"
            />
          </el-form-item>
        </p>

        <p>
          <el-form-item label="url：">
            <el-input
              type="text"
              v-model="pathAdd.url"
              placeholder="请输入密码"
              style="width: 200px;"
            />
          </el-form-item>
        </p>
      </el-form>

      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="small" @click="addNewPath()">确定</el-button>
        <el-button size="small" @click="Cloose()">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog title="绑定路径" :visible.sync="this.bind" width="800px" :showClose="false">
      <el-form :inline="true" class="ep-form" label-width="120px">
        <p>
          <el-form-item label="设置角色：">
            <el-select size="small" placeholder="请选择"
                       style="width: 200px;"
                       class="el-select" v-model="aboutBind.id2">
              <el-option v-for="type in roleList" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
        </p>
        <div style="text-align: right; margin: 0">
          <el-button type="primary" size="small" @click="BindPathS()">确定</el-button>
          <el-button size="small" @click="Cloose()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>


  </d2-container>
</template>

<script>
  import {exLongMessage , changeEx , getNewKey} from '@/libs/exJSE.js'
  import {SearchPer , addPer , addPath , SearchPath , PathBind , PathDel} from '@/api/Permit.js'

  import {find} from 'lodash'
  export default {
    name: 'demotalbe',
    data () {
      return {
        loading: false,
        tableData: [],
        Prem:false,
        Path:false,
        bind:false,

        roleList:[],

        premAdd:{
          icon: "",
          name: "",
          pid: -1,
          type: 1
        },

        pathAdd:{
          module: "",
          name: "",
          type: 1,
          url: ""
        },

        aboutBind:{
          id1:-1,
          id2:-1
        },

        pageinfo: {
          currentPage: 1,
          pageSize: 10,
          totalResult: 600
        },
        ActId:0,
        queryinfo: {
          type: 2
        },
        // 数据, 注意需要小写
        Active: [{label:'请选择活动',value:0}]

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
        const pageinfo = this.pageinfo
        pageinfo.currentPage = currentPage
        pageinfo.pageSize = pageSize
        this.AllPer(pageinfo.currentPage,pageinfo.pageSize);
      },
      selectChangeEvent ({checked, records}) {
        this.records = records
//        console.log(checked ? '勾选事件' : '取消事件', records)
      },
      getSelectEvent () {
        const selectRecords = this.$refs.xTable.getCheckboxRecords()
        this.$XModal.alert(selectRecords.length)
      },
      exportDataEvent () {
        this.$refs.xTable.exportData({type: 'csv'})
      },
      exportSelectEvent () {
        this.$refs.xTable.exportData({
          data: this.$refs.xTable.getCheckboxRecords()
        })
      },
      importDataEvent () {
        this.$refs.xTable.importData()
      },
      openExportEvent () {
        this.$refs.xTable.openExport({isPrint: false})
      },
      selectAllEvent ({checked, records}) {
//        console.log(checked ? '所有勾选事件' : '所有取消事件', records)
      },

      Cloose(){
        this.Prem = false;
        this.Path = false;
        this.bind = false;
      },

      getTableData () {
        this.loading = true;
        this.AllPer(1,10);
      },

      AllPer(pageCount,pageSize){
        var data1 = {
          current: pageCount,
          size: pageSize,
          type:1
        };
        var data = exLongMessage(data1);
        SearchPer(data).then(res => {
          console.log(res)
          if(res.code == 0){
            this.tableData = res.voPage.list;
            this.pageinfo.totalResult = res.voPage.totalCount;
            this.loading = false;
            var data1 = {
              current: 1,
              size: 100000,
              type:1
            };
            var data = exLongMessage(data1);
            SearchPath(data).then(res => {
                console.log(res)
              this.roleList = res.voPage.list
            })
          }
        })
      },

      addNewP(){
        var data = exLongMessage(this.premAdd);
        addPer(data).then(res => {
            console.log(res)
          this.Cloose()
          this.getTableData()
        })
      },

      addNewPath(){
          console.log(this.pathAdd)
        var data = exLongMessage(this.pathAdd);
        addPath(data).then(res => {
            console.log(res)
          this.Cloose()
          this.getTableData()

        })
      },

      bindPath(index,row){
        console.log(row.id);
        this.aboutBind.id1 = row.id;
        this.bind = true;

      },

      BindPathS(){
        var obj = {
          dataArray:[this.aboutBind]
        }
        console.log(obj)
        var data = exLongMessage(obj);
        PathBind(data).then(res => {
          console.log(res);
          this.Cloose()
          this.getTableData()
        })
      },

      DelPath(index,row){
        var obj = {
            id:row.id
        };
        console.log(obj)
        var data = exLongMessage(obj);

        PathDel(data).then(res => {
          console.log(res)
          this.Cloose()
          this.getTableData()
        })
      },

      addPath(){
        this.Path=true
      },

      addPer(){
        this.Prem =true;
      }
    },
    // 生命周期 - 创建完成（可以访问当前this实例）
    created () {
      this.getTableData()
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

</style>
