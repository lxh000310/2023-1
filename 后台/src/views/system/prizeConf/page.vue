<template>
	<d2-container>
		<el-alert title="第一条固定为默认奖品" type="warning" center show-icon style="margin-bottom: .7em;">
		</el-alert>
		<el-alert :title="activeInfo" type="success" effect="dark" :closable="false" style="margin-bottom: .7em;">
		</el-alert>
		<!-- query form -->
		<el-form :inline="true" class="form1">
			<div class="item1">
				<div class="left">
					<!-- <el-input placeholder="淘宝昵称" class="input" prefix-icon="el-icon-search" v-model="query.nick">
					</el-input> -->
					<!-- <el-button icon="" type="primary" @click="query={};getTableDataPage1();">清空</el-button> -->
					<h4 style="color: red;margin-right: 1em;display: inline;">请上传小于1M的图片，并使图片之间宽高比保持一致</h4>
				</div>
				<el-button icon="el-icon-refresh" type="primary" @click="getTableDataPage1">刷新</el-button>
			</div>
		</el-form>
		<!-- <el-dvider></el-dvider> -->
		<el-table :data="tableData" v-loading="loading" style="width: 100%;" ref="xTable">
			<!-- <el-table-column prop="id" label="id" align='center'>
			</el-table-column> -->
			<!-- <el-table-column prop="type" label="奖品类型" align='center'>
			</el-table-column> -->
			<el-table-column prop="name" label="名称" align='center'>
			</el-table-column>
			<el-table-column prop="" label="图片" align='center'>
				<template #default="{row}">
					<img :src="row.icon" v-if="row.icon" style="width: 5em;">
					<span v-else>-</span>
				</template>
			</el-table-column>
			<el-table-column prop="probability" label="概率(%)" align='center' :formatter="row=>row.probability/10000">
			</el-table-column>
			<el-table-column prop="stock" label="库存" align='center'>
			</el-table-column>
			<el-table-column prop="delState" label="是否为默认奖品" align='center' :formatter="(row, column, cell, index)=>{
				return index=== 0 ? '是' : '否';
			}">
			</el-table-column>
			<el-table-column prop="created" label="创建时间" align='center'>
			</el-table-column>
			<el-table-column prop="updated" label="更新时间" align='center'>
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
			<el-table-column prop="" label="操作" align='center' fixed="right">
				<template #default="scope">
					<el-button-group>
						<el-button type="primary" size="small" icon="el-icon-edit" style="margin-bottom: .7em;" @click="tapEdit(scope)">编辑奖品</el-button>
						<!-- <el-button size="small" icon="el-icon-arrow-right" type="primary" @click="getIntoActivity(scope.$index, scope.row)">进入活动</el-button> -->
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<template slot="footer">
			<vxe-pager align="right" size="small" :current-page.sync="pageinfo.currentPage" :page-size.sync="pageinfo.pageSize" :total="pageinfo.totalResult" @page-change="handlePageChange">
			</vxe-pager>
		</template>
		<!-- 编辑对话框 -->
		<el-dialog title="编辑奖品" v-for="(row) in [dialogEdit]" :visible.sync="row._openState" width="80%" :before-close="dialogEditClose" @close="row.file=null;row._inputValue=null;row._fileName='';">
			<div>
				<el-form :inline="true" class="">
					<el-form-item label="奖品名称">
						<el-input v-model="row.name"></el-input>
					</el-form-item>
					<el-form-item label="概率(%)">
						<el-input v-model="row.probability" type="number" max="100" min="0"></el-input>
					</el-form-item>
					<el-form-item label="库存">
						<el-input v-model="row.stock" type="number"></el-input>
					</el-form-item>
					<!-- <el-form-item label="类型">
						<el-input v-model="row.type"></el-input>
					</el-form-item> -->
					<el-form-item label="图片">
						<FileInputImg @change="fileInputChange"
						:icon="row.icon" v-model="row._fileName"
						></FileInputImg>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
				<!-- <el-button @click="newActive(0);" :loading="row._fetching">保存</el-button> -->
				<el-button type="primary" @click="editPrize();" :loading="row._fetching">确认</el-button>
			</span>
		</el-dialog>
	</d2-container>
</template>
<script>
	import { mapActions } from 'vuex';
	import * as APIs from '@/api/groupedApi';
	import { menuHeader, menuAside } from '@/menu';
	import FileInputImg from '@/components/file-input-img';

	export default {
		name: 'page-prizeConf',
		components: {
			FileInputImg,
		},
		data() {
			return {
				activeInfo: '',
				activeTab: '1',
				loading: false,
				tableData: [],
				query: {
					nick: null,
				},
				pageinfo: {
					currentPage: 1,
					pageSize: 10,
					totalResult: 0
				},
				dialogEdit: {
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
					_index: null,
					id: null,
					name: null,
					icon: null,
					probability: null,
					stock: null,
					type: null,
					file: null,
					_fileName: null,
					_inputValue: null,
				},
			}
		},
		computed: {
			/*fileUrl() {
				return URL.createObjectURL(this.dialogEdit.file);
			},*/
		},
		watch: {},
		// 方法集合
		methods: {
			fileInputChange([file, url]) {
				this.dialogEdit.file = file;
				// this.dialogEdit._inputValue = e.target.value;
			},
			tapEdit(scope) {
				console.log(scope);
				this.dialogEdit._openState = true;
				let { name, icon, probability, stock, type, id } = scope.row;
				// console.log({ name, icon, probability, stock, type });
				probability /= 10000;
				Object.assign(this.dialogEdit, {
					name,
					icon, // 不用做参数传递，只用来作为对应图片资源是否已经创建的依据
					probability,
					stock,
					type,
					id,
					_index: scope.$index, // 传递奖品的序号，方便一对一传图
				});
			},
			editPrize() {
				const aid = APIs.getActiveId();
				let { name, icon, probability, stock, type, id, file, _index } = this.dialogEdit;
				probability = parseInt(probability * 10000);
				// 校验
				if (!icon && !file) {
					this.$message.error('请选择奖品图片');
					return;
				}else if(isNaN(+probability)) {
					this.$message.error('请输入正确的概率值');
					return;
				}else if(isNaN(+stock)) {
					this.$message.error('请输入正确的库存');
					return;
				} else if (typeof probability !== 'number' || probability < 0 || probability > 100 * 10000) {
					this.$message.error('概率格式不正确');
					return;
				}
				this.dialogEdit._fetching = true; // 上锁

				// 根据type和title查询图片url
				const getImgInfo = () => {
					return APIs.Img_page({
						aid,
						type: 0,
						title: _index + 1 + '',
						current: 1,
						size: 10,
					}).then(res => {
						return res.page.list[0].picture;
					});
				};
				// 提交新的奖品配置，然后关闭对话框
				const changeDrawConfg = icon => {
					APIs.DrawConf_change({
						id,
						name,
						icon,
						probability,
						stock,
						type,
					}).then(res => {
						if (res.code === 0) {
							this.$message.success('修改成功');
							this.dialogEdit._openState = false;
							this.getTableData();
						} else {
							throw res.msg;
						}
					}).catch(err => {
						if (err === 'Draw probability overflow') {
							err = '设置失败！总抽奖概率不能大于100%'
						}
						this.$message({
							type: 'error',
							message: err,
						})
					}).finally(() => {
						this.dialogEdit._fetching = false; // 开锁
					});
				};
				const formData = new FormData();
				formData.append('file', file);
				// 判断icon是否存在，有则先改图片再改抽奖配置，无则先新建图片再改抽奖配置
				const ifInputFile = () => {
					if (!icon) {
						// 新建图片
						return APIs.Img_add(formData, {
								aid,
								type: 0,
								title: _index + 1 + '',
							}).then(res => {
								console.log(res);
								if (res.code === 0) {
									return res.img.picture;
								} else {
									this.$message.error(res.msg);
									throw 1;
								}
							}) /*.then(() => getImgInfo())*/
							.then(data => {
								// 图片新建完成，改抽奖配置
								changeDrawConfg(data);
							})
					} else {
						// 根据type和tilte查询出唯一的图片id
						return APIs.Img_page({
							aid,
							type: 0,
							title: _index + 1 + '',
							current: 1,
							size: 10,
						}).then(res => {
							const { id } = res.page.list[0];
							return id;
						}).then(id => {
							return APIs.Img_change(formData, { id }).then(res => {
								if (res.code === 0) {
									return res.img.picture;
								} else {
									throw 1;
								}
							})
						}) /*.then(() => getImgInfo())*/ .then(data => {
							// 图片更改完成，改抽奖配置
							changeDrawConfg(data);
						});
					}
				};
				if (file) {
					ifInputFile().finally(() => {
						this.dialogEdit._fetching = false; // 开锁
					});
				} else {
					// 没有file，只需修改其他参数
					changeDrawConfg(null);
				}
			},
			downloadAll() {
				APIs.ActiveData_downloadCustomer({
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
			dialogEditClose(done) {
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
				const { nick } = this.query;
				this.loading = true;
				APIs.DrawConf_page({
					aid: APIs.getActiveId(),
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
