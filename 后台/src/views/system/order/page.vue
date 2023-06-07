<template>
	<d2-container>
		<el-alert :title="activeInfo" type="success" effect="dark" :closable="false" style="margin-bottom: .7em;">
		</el-alert>
		<!-- query form -->
		<el-form :inline="true" class="form1">
			<div class="item1">
				<div class="left">
					<el-input placeholder="订单编号" class="input" prefix-icon="el-icon-search" v-model="query.oid">
					</el-input>
					<el-input placeholder="用户昵称" class="input" prefix-icon="el-icon-search" v-model="query.nick">
					</el-input>
					
					<el-button icon="" type="primary" @click="query={};getTableDataPage1();">清空</el-button>
					<el-button icon="el-icon-refresh" type="primary" @click="getTableDataPage1">查询</el-button>
				</div>
				<!-- <el-button icon="el-icon-plus" type="primary" @click="dialogActive._openState = true">创建活动</el-button> -->
				<!-- <el-button icon="el-icon-download" @click="downloadAll" type="primary">导出全部</el-button> -->
			</div>
		</el-form>
		<!-- <el-dvider></el-dvider> -->
		<el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
			<el-table-column prop="oid" label="订单编号" align='center'>
			</el-table-column>
			<el-table-column prop="nick" label="用户昵称" align='center'>
			</el-table-column>
			<el-table-column prop="sid" label="商品ID" align='center'>
			</el-table-column>
			<el-table-column prop="skuName" label="商品名称" align='center'>
			</el-table-column>
			<el-table-column prop="orderStateStr" label="是否核销" align='center'>
				<template #default="{row}">
					{{ row.orderStateStr==='TRADE_FINISHED' ? '是' : '否'}}
				</template>
			</el-table-column>
			<el-table-column prop="num" label="购买数量" align='center'>
			</el-table-column>
			<!-- <el-table-column prop="signTime" label="核销时间" align='center'>
			</el-table-column> -->
			<el-table-column prop="created" label="下单时间" align='center'>
			</el-table-column>
			
			
			<!-- <el-table-column prop="" label="活动开始结束时间" align='center'>
				<template slot-scope="scope">
					<p style="margin: 0;">{{scope.row.activeBegin}}</p>
					至
					<p style="margin: 0;">{{scope.row.activeDeadline}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="" label="下单开始结束时间" align='center'>
				<template slot-scope="scope">
					<p style="margin: 0;">{{scope.row.orderBegin}}</p>
					至
					<p style="margin: 0;">{{scope.row.orderDeadline}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="" label="核销开始结束时间" align='center'>
				<template slot-scope="scope">
					<p style="margin: 0;">{{scope.row.signBegin}}</p>
					至
					<p style="margin: 0;">{{scope.row.signDeadline}}</p>
				</template>
			</el-table-column> -->
			<!-- <el-table-column prop="drawIdDef" label="默认奖励id" align='center'>
			</el-table-column>
			<el-table-column prop="drawStrategy" label="抽奖方案" align='center'>
			</el-table-column>
			<el-table-column prop="" label="操作" align='center' fixed="right">
				<template #default="scope">
					<el-button-group>
						<el-button size="small" icon="el-icon-edit" style="margin-bottom: .7em;">编辑活动</el-button>
						<el-button size="small" icon="el-icon-arrow-right" type="primary" @click="getIntoActivity(scope.$index, scope.row)">进入活动</el-button>
					</el-button-group>
				</template>
			</el-table-column> -->
		</el-table>
		<template slot="footer">
			<vxe-pager align="right" size="small" :current-page.sync="pageinfo.currentPage" :page-size.sync="pageinfo.pageSize" :total="pageinfo.totalResult" @page-change="handlePageChange">
			</vxe-pager>
		</template>
		<!-- 创建活动对话框 -->
	</d2-container>
</template>
<script>
	import { mapActions } from 'vuex';
	import * as APIs from '@/api/groupedApi';
	import { menuHeader, menuAside } from '@/menu';

	export default {
		name: 'page-order',
		data() {
			return {
				activeInfo: '',
				activeTab: '1',
				loading: false,
				tableData: [],
				query: {
					nick: null,
					oid: null,
				},
				pageinfo: {
					currentPage: 1,
					pageSize: 10,
					totalResult: 0
				},
				dialogActive: {
					_fetching: false,
					_openState: false,
					_pickerOptions: {
						shortcuts: [{
							text: '最近一周',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '最近一个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
								picker.$emit('pick', [start, end]);
							}
						}, {
							text: '最近三个月',
							onClick(picker) {
								const end = new Date();
								const start = new Date();
								start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
								picker.$emit('pick', [start, end]);
							}
						}]
					},
					_skuItem: {
						type: null,
						sid: null,
						name: null,
						file: null,
						_url: null,
						_previewOpen: false,
					},
					name: null,
					activeDuration: null,
					orderDuration: null,
					signDuration: null,
					skuArr: [],
				},
			}
		},
		computed: {},
		watch: {},
		// 方法集合
		methods: {
			downloadAll() {
				APIs.ActiveData_downloadOrder({
					aid: APIs.getActiveId(),
				}).then(resp => {
					console.log(7, resp);
					let blob = new Blob([resp], {
						type: 'application/vnd.ms-excel'
					}); // 转化为blob对象
					let filename = new Date().toLocaleString() + '数据.xls'; // 判断是否使用默认文件名
					if (typeof window.navigator.msSaveBlob !== 'undefined') {
						window.navigator.msSaveBlob(blob, filename);
					} else {
						var blobURL = window.URL.createObjectURL(blob); // 将blob对象转为一个URL
						var tempLink = document.createElement('a'); // 创建一个a标签
						tempLink.style.display = 'none';
						tempLink.href = blobURL;
						tempLink.setAttribute('download', filename); // 给a标签添加下载属性
						if (typeof tempLink.download === 'undefined') {
							tempLink.setAttribute('target', '_blank');
						}
						document.body.appendChild(tempLink); // 将a标签添加到body当中
						tempLink.click(); // 启动下载
						document.body.removeChild(tempLink); // 下载完毕删除a标签
						window.URL.revokeObjectURL(blobURL);
					}
				});
			},
			// 更新活动名称提示
			updateActiveInfo() {
				APIs.Active_page({
					id: APIs.getActiveId(),
					current: 1,
					size: 10,
				}).then(res => {
					console.log(1, res.page.list[0].name);
					if (res.code === 0) {
						this.activeInfo = `当前活动：${res.page.list[0].name}`;
					}
				});
			},
			// 进入活动
			getIntoActivity(index, row) {
				const id = row.id;
				this.chooseActivity(id);
			},
			clickTab(tab, event) {
				this.getTableDataPage1(); // 刷新表格
			},
			dialogActivityClose(done) {
				/*this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});*/
				done();
			},
			...mapActions('d2admin/page', ['closeAll']),
			closeAllTabs() {
				this.$confirm('此操作将关闭其他打开的页面, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(
					res => this.closeAll(),
					err => err,
				);
			},
			chooseActivity(id) {
				console.log(id);
				// 判断当前是否已进入活动
				if (APIs.getActiveId() === null) {
					// 当前未进入活动
					APIs.setActiveId(id);

				} else if (APIs.getActiveId() === id) {
					// 重复进入当前活动
					// 跳转到当前活动主页

				} else {
					// 进入新的活动
					this.$confirm('是否要离开当前活动，并进入新活动？此操作会关闭所有的其他页面并进入新活动页，确认继续？').then(res => {
						this.closeAllTabs();

					}, err => {

					});
				}

				this.$store.commit('d2admin/menu/headerSet', menuHeader);
				this.$store.commit('d2admin/menu/asideSet', menuAside);
			},
			handlePageChange({ currentPage, pageSize }) {
				const pageinfo = this.pageinfo;
				pageinfo.currentPage = currentPage
				pageinfo.pageSize = pageSize
				this.getTableData();
			},
			Close() {
				this.slogan = '';
				this.healthyPhotoUrl = '';
				this.photoUrl = "";
			},
			reset() {
				this.teamId = -1;
				this.userIds = [];
				this.getTableData();
			},
			console_log(...args) {
				console.log(...args);
			},
			getTableDataPage1() {
				this.pageinfo.currentPage = 1;
				this.getTableData();
			},
			getTableData() {
				const { currentPage: current, pageSize: size } = this.pageinfo;
				const { nick, oid } = this.query;
				this.loading = true;
				APIs.ActiveData_pageOrder({
					aid: APIs.getActiveId(),
					nick,
					oid,
					current,
					size,
				}).then(res => {
					console.log(res);
					if (res.code === 0) {
						this.tableData = res.page.list;
						this.pageinfo.totalResult = res.page.totalCount;
						this.loading = false;
					}
				})
			},

			SearchUser(pageCount, pageSize) {
				this.pageinfo = {
					currentPage: pageCount,
					pageSize,
				};
				this.tableData = [];
			}

		},
		// 生命周期 - 创建完成（可以访问当前this实例）
		created() {
			this.updateActiveInfo();
			this.getTableData();
		},
		// 生命周期 - 挂载完成（可以访问DOM元素）
		mounted() {},
		beforeCreate() {}, // 生命周期 - 创建之前
		beforeMount() {}, // 生命周期 - 挂载之前
		beforeUpdate() {}, // 生命周期 - 更新之前
		updated() {}, // 生命周期 - 更新之后
		beforeDestroy() {}, // 生命周期 - 销毁之前
		destroyed() {}, // 生命周期 - 销毁完成
		activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
	};

</script>
<style lang='less' scoped>
	// @import url(); 引入公共css类
	.ep-input {
		width: 80%;
		position: absolute;
		right: 5%;
	}

	.ep-select {
		position: absolute;
		left: 15%;
	}

	.form1 {
		.item1 {
			display: flex;
			justify-content: space-between;

			.left {
				flex: auto;

				.input {
					max-width: 20em;
					margin-right: .7em;
				}
			}
		}
	}

	.upload {
		transform-origin: 0 0;
		transform: scale(.5);

		.btn-box {
			transform: scale(2);
		}
	}

	.sku-item {
		display: flex;
		justify-content: center;
		align-items: center;

		.input {
			max-width: 10em;
			margin-right: .7em;

			&:nth-of-type(3) {
				max-width: initial;
			}
		}
	}

</style>
