<template>
  <d2-container>
    <!-- query form -->
    <el-button @click="addUser()">添加路径</el-button>
    <el-button @click="addUser()">添加权限</el-button>

    <el-divider></el-divider>

    <el-table :data="tableData" v-loading="loading"  style="width: 100%;"  ref="xTable">
      <el-table-column prop="name" label="具体权限" align='center'>
      </el-table-column>
      <el-table-column label="操作" align='center'>

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
  import {exMessage , changeEx , getNewKey} from '@/libs/exJSE.js'
  import {SearchPer} from '@/api/Permit.js'

  import {find} from 'lodash'
  export default {
    name: 'demotalbe',
    data () {
      return {
        loading: false,
        tableData: [],
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
        this.getTableData()
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
      getTableData () {
        this.loading = true;
        this.AllPer(1,10);
      },

      AllPer(pageCount,pageSize){
        var data1 = {
          current: pageCount,
          size: pageSize
        };
        var data = exMessage(data1);
        SearchPer(data).then(res => {
          console.log(res)
          if(res.code == 0){
            this.tableData = res.voPage.list;
            this.loading = false;

          }
        })
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
