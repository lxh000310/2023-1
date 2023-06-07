<template>
	<d2-container>
		<el-alert :title="activeInfo" type="success" effect="dark" :closable="false" style="margin-bottom: .7em;">
		</el-alert>
		<!-- query form -->
		<el-form :inline="true" class="form1">
			<div class="item1">
				<div class="left">
					<!-- <el-form-item label="昵称">
						<el-input placeholder="昵称" class="input" prefix-icon="el-icon-search" v-model="query.nick">
						</el-input>
					</el-form-item> -->
					<el-form-item label="订单编号">
						<el-input placeholder="订单编号" class="input" prefix-icon="el-icon-search" v-model="query.oid">
						</el-input>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input placeholder="姓名" class="input" prefix-icon="el-icon-search" v-model="query.fullName">
						</el-input>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="手机号" class="input" prefix-icon="el-icon-search" v-model="query.fullPhone">
						</el-input>
					</el-form-item>
					<el-form-item label="发货状态">
						<el-select v-model="query.hasDelivery" placeholder="请选择">
							<el-option :value="null">全部</el-option>
							<el-option v-for="item in [
							{label:'已发货',value:true},
							{label:'待发货',value:false},
							]" :key="item.label" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发货单号">
						<el-input placeholder="发货单号" class="input" prefix-icon="el-icon-search" v-model="query.deliveryno">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="" type="primary" @click="query={};getTableDataPage1();">清空</el-button>
						<el-button icon="el-icon-refresh" type="primary" @click="getTableDataPage1">查询</el-button>
					</el-form-item>
				</div>
				<!-- <el-button icon="el-icon-plus" type="primary" @click="dialogActive._openState = true">创建活动</el-button> -->
			</div>
			<el-form-item>
				<el-button icon="el-icon-download" @click="downloadAll()" type="primary">导出全部数据</el-button>
				<el-button icon="el-icon-download" @click="downloadAll(false)" type="primary">导出未发货数据</el-button>
			</el-form-item>
			<el-form-item>
				<!-- <label style="display: flex;">
					<input ref="input" type="file" @change="fileChange" style="width: 0;height: 0;opacity: 0;"></input>
					<div style="outline:solid; width: 5em;height: 5em;display: flex;justify-content: center;align-items: center;">
						<i class="el-icon-plus" style="font-size: 2em;" v-if="!file"></i>
						<p v-else style="line-height: 1.5;">{{file.name}}</p>
					</div>
				</label> -->
				<FileInput v-model="fileName" @change="fileChange" ref="file-input"
				style="width: 0;height: 0;opacity: 0;visibility: hidden;"
				></FileInput>
				<el-button icon="" @click="$refs['file-input'].$el.querySelector('input').click()" type="primary">导入发货信息</el-button>
			</el-form-item>
		</el-form>
		<!-- <el-dvider></el-dvider> -->
		<el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
			<!-- <el-table-column prop="id" label="序号" align='center'>
			</el-table-column> -->
			<el-table-column prop="fullName" label="姓名" align='center'>
			</el-table-column>
			<el-table-column prop="fullPhone" label="手机号" align='center'>
			</el-table-column>
			<el-table-column prop="name" label="奖品名称" align='center'>
			</el-table-column>
			<el-table-column prop="oid" label="订单编号" align='center'>
			</el-table-column>
			<el-table-column prop="" label="地址信息" align='center'>
				<template #default="{row}">
					<p style="margin: 0;">{{`${row.fullProvince}-${row.fullCity}-${row.fullCounty}`}}</p>
					<p style="margin: 0;">{{row.fullAddress}}</p>
				</template>
			</el-table-column>
			<el-table-column prop="created" label="中奖时间" align='center'>
			</el-table-column>
			<el-table-column prop="deliveryno" label="发货状态" align='center' :formatter="(row, column, cellValue)=>cellValue ? '已发货' : '待发货'">
			</el-table-column>
			<el-table-column prop="deliverycompany" label="发货公司" align='center' :formatter="(row, column, cellValue)=>cellValue ? cellValue : '_'">
			</el-table-column>
			<el-table-column prop="deliveryno" label="发货单号" align='center' :formatter="(row, column, cellValue)=>cellValue ? cellValue : '_'">
			</el-table-column>
			<el-table-column prop="deliverytime" label="发货时间" align='center' :formatter="(row, column, cellValue)=>cellValue ? cellValue : '_'">
			</el-table-column>
			<el-table-column prop="" label="操作" align='center'>
				<template slot-scope="scope">
					<el-button type="primary" @click="tapChangeDelivery(scope.row)">更改快递信息</el-button>
				</template>
			</el-table-column>
		</el-table>
		<template slot="footer">
			<vxe-pager align="right" size="small" :current-page.sync="pageinfo.currentPage" :page-size.sync="pageinfo.pageSize" :total="pageinfo.totalResult" @page-change="handlePageChange">
			</vxe-pager>
		</template>
		<!-- 更改单号对话框 -->
		<el-dialog title="更改快递信息" :visible.sync="dialogChange._openState" width="80%">
			<div>
				<el-form :inline="true" class="">
					<el-form-item label="发货公司">
						<el-select v-model="dialogChange.deliverycompany" placeholder="请选择">
							<el-option v-for="item in ['圆通速递', '顺丰速运', '京东物流', ]" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="快递单号">
						<el-input v-model="dialogChange.deliveryno"></el-input>
					</el-form-item>
					<el-form-item label="发货时间">
						<el-date-picker v-model="dialogChange.deliverytime" type="datetime" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<!-- <el-form-item label="快递单号">
						<el-date-picker v-model="dialogChange.deliveryno" type="datetimerange" :picker-options="dialogActive._pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="有效下单时间">
						<el-date-picker v-model="dialogActive.orderDuration" type="datetimerange" :picker-options="dialogActive._pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="有效核销时间">
						<el-date-picker v-model="dialogActive.signDuration" type="datetimerange" :picker-options="dialogActive._pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
						</el-date-picker>
					</el-form-item> -->
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
				<!-- <el-button @click="newActive(0);" :loading="dialogActive._fetching">保存</el-button> -->
				<el-button type="primary" @click="changeDelivery" :loading="dialogChange._fetching">确认更改</el-button>
			</span>
		</el-dialog>
	</d2-container>
</template>
<script>
	import { mapActions } from 'vuex';
	import * as APIs from '@/api/groupedApi';
	import { menuHeader, menuAside } from '@/menu';
	import FileInputImg from '@/components/file-input-img';
	import FileInput from '@/components/file-input';

	export default {
		name: 'page-prize',
		components: {
			FileInputImg,
			FileInput,
		},
		data() {
			return {
				file: null,
				fileName: null,
				activeInfo: '',
				activeTab: '1',
				loading: false,
				tableData: [],
				query: {
					nick: null,
					oid: null,
					fullName: null,
					fullPhone: null,
					hasDelivery: null,
					deliveryno: null,
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
				dialogChange: {
					_openState: false,
					id: null,
					deliverycompany: null,
					deliveryno: null,
					deliverytime: null,
				},
			}
		},
		computed: {},
		watch: {},
		// 方法集合
		methods: {
			tapChangeDelivery(row) {
				console.log(row);
				Object.assign(this.dialogChange, {
					...row,
					deliverytime: row.deliverytime ? new Date(row.deliverytime) : null,
				});
				this.dialogChange._openState = true;
			},
			changeDelivery() {
				const { id, deliverycompany, deliveryno, deliverytime } = this.dialogChange;
				if (!deliverycompany) {
					this.$message('发货公司不能为空');
				} else if (!deliveryno) {
					this.$message('快递单号不能为空');
				} else if (!deliverytime) {
					this.$message('发货时间不能为空');
				} else {
					this.dialogChange._fetching = true;
					APIs.Delivery_change({
						id,
						deliverycompany,
						deliveryno,
						deliverytime: +deliverytime,
					}).then(res => {
						if (res.code === 0) {
							console.log(1, res);
							this.$message.success('更改成功');
							this.dialogChange._openState = false;
							this.getTableDataPage1();
						} else {
							this.$message.error(res.msg);
							throw 1;
						}
					}).finally(() => {
						this.dialogChange._fetching = false;
					})
				}
			},
			delivery() {
				if (!this.file) {
					this.$message('请选择文件');
					return;
				}
				const formData = new FormData();
				formData.append('file', this.file);
				APIs.Delivery_upload(formData).then(res => {
					if (res.code === 0) {
						this.$message.success('导入成功');
						this.getTableDataPage1();
					} else {
						this.$message.error(res.msg);
						throw 1;
					}
				}).finally(()=>{
					this.fileName = '';
				});
			},
			fileChange(file) {
				console.log(this.file);
				this.file = file;
				if(file) {
					this.delivery();
				}
			},
			downloadAll(hasDelivery = undefined) {
				if (this.pageinfo.totalResult === 0) {
					// return;
				}
				APIs.ActiveData_downloadDrawRecord({
					aid: APIs.getActiveId(),
					hasDelivery,
					current: 1,
					size: this.pageinfo.totalResult,
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
				// const { nick, oid, fullName, type } = this.query;
				this.loading = true;
				APIs.ActiveData_pageDrawRecord({
					aid: APIs.getActiveId(),
					...this.query,
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
