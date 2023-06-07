<template>
	<d2-container>
		<el-alert :title="activeInfo" type="success" effect="dark" :closable="false" style="margin-bottom: .7em;">
		</el-alert>
		<!-- query form -->
		<el-form :inline="true" class="form1" v-loading="loading">
			<div class="item1">
				<div class="left">
					<!-- <el-input placeholder="淘宝昵称" class="input" prefix-icon="el-icon-search" v-model="query.nick">
					</el-input> -->
					<!-- <el-button icon="" type="primary" @click="query={};getTableDataPage1();">清空</el-button> -->
				</div>
				<!-- <el-button icon="el-icon-download" @click="downloadAll" type="primary">导出全部</el-button> -->
			</div>
			<div class="list">
				<div style="display: flex;justify-content: space-between;align-items: center;">
					<h3>上传图片</h3>
					<el-button icon="el-icon-refresh" type="primary" @click="clickRefresh">刷新</el-button>
				</div>
				<h4 style="color:red;margin: 0;">图片上传尺寸说明：请上传JPG PNG 格式的图片,且不大于1M的图片</h4>
				<div class="item" v-for="(item, index) in imgConfs" v-show="index!==1 && index!==2 && index!==3">
					<div class="title">{{item.title}}</div>
					<template v-for="(ele, i) in item.inputArr">
						<FileInputImg ref="file-input-img" :icon="ele.icon" @change="fileInputChange(index, i, $event[0], item.ratio)" v-model="ele.fileName"></FileInputImg>
					</template>
					<div class="warning">{{item.warning}}</div>
				</div>
				<h3>上传文字</h3>
				<div class="item" v-for="(item, index) in textConfs">
					<div class="title" style="width: initial;">{{item.title}}</div>
					<template v-if="item.type==='text'">
						<el-input v-model="item.value"></el-input>
					</template>
					<template v-else-if="item.type==='textarea'">
						<el-input type="textarea" v-model="item.value" :rows="3"></el-input>
					</template>
				</div>
			</div>
		</el-form>
		<!-- <el-dvider></el-dvider> -->
		<template slot="footer">
			<!-- <vxe-pager align="right" size="small" :current-page.sync="pageinfo.currentPage" :page-size.sync="pageinfo.pageSize" :total="pageinfo.totalResult" @page-change="handlePageChange">
			</vxe-pager> -->
			<div style="text-align: center;">
				<el-button type="primary" :loading="loading" @click="clickConfirm">确认修改</el-button>
			</div>
		</template>
		<!-- 编辑对话框 -->
		<!-- <el-dialog title="编辑奖品" v-for="(row) in [dialogEdit]" :visible.sync="row._openState" width="80%" :before-close="dialogEditClose" @close="row.file=null;row._inputValue=null;$refs['input-file'][0].value='';">
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
					<el-form-item label="类型">
						<el-input v-model="row.type"></el-input>
					</el-form-item>
					<el-form-item label="图标">
						<label>
							<input type="file" accept="image/*" style="" ref="input-file" @change="fileInputChange">
							<div style="outline:solid; width: 5em;height: 5em;display: flex;justify-content: center;align-items: center;">
								<img class="el-upload-list__item-thumbnail" :src="fileUrl" style="width: 100%;height: 100%;object-fit: contain;" v-if="row.file">
								<img class="el-upload-list__item-thumbnail" :src="row.icon" style="width: 100%;height: 100%;object-fit: contain;" v-else-if="row.icon">
								<i class="el-icon-plus" style="font-size: 2em;" v-else></i>
							</div>
						</label>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer" style="display: flex; justify-content: center;">
				<el-button type="primary" @click="editPrize();" :loading="row._fetching">确认</el-button>
			</span>
		</el-dialog> -->
	</d2-container>
</template>
<script>
	import { mapActions } from 'vuex';
	import * as APIs from '@/api/groupedApi';
	import { menuHeader, menuAside } from '@/menu';
	import FileInputImg from '@/components/file-input-img';
	import * as Utils from '@/utils';

	export default {
		name: 'page-imgConf',
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
				/*dialogEdit: {
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
					_inputValue: null,
				},*/
				imgConfs: [{
						title: 'loading页',
						inputArr: [{ icon: '', file: null }],
						warning: '要求宽高比为 9:10',
						ratio: 9 / 10,
					},
					{
						title: '主页背景图',
						inputArr: [{ icon: '', file: null }],
						warning: '',
					},
					{
						title: '活动弹窗背景图',
						inputArr: [{ icon: '', file: null }],
						warning: '要求宽高比为 3:4',
						ratio: 3 / 4,
					},
					{
						title: '购买页提示文字',
						inputArr: [{ icon: '', file: null }],
						warning: '',
					},
					{
						title: '广告图',
						inputArr: [
							{ icon: '', file: null },
							{ icon: '', file: null },
							{ icon: '', file: null },
							{ icon: '', file: null },
						],
						warning: '要求宽高比为 5:2',
						ratio: 5 / 2,
					},
					{
						title: '活动规则图',
						inputArr: [{ icon: '', file: null }],
						warning: '无要求',
					}
				],
				textConfs: [{
						title: '分享标题',
						type: 'text',
						value: '',
						_value: '', // 旧值
						id: null,
					},
					{
						title: '分享描述',
						type: 'text',
						value: '',
						_value: '',
						id: null,
					},
					{
						title: '分享图链接（必须在阿里特定可信域名下）',
						type: 'text',
						value: '',
						_value: '',
						id: null,
					},
					{
						title: '抽奖页标题',
						type: 'text',
						value: '',
						_value: '',
						id: null,
					},
					{
						title: '购买页提示文字',
						type: 'textarea',
						value: '',
						_value: '',
						id: null,
					},
				]
			}
		},
		computed: {
			fileUrl() {
				return URL.createObjectURL(this.dialogEdit.file);
			},
		},
		watch: {},
		// 方法集合
		methods: {
			clickConfirm() {
				console.log('confirm');
				this.loading = true;
				const proAll = Promise.all([
						this.setTextConf(),
						this.setImgConf(),
					]).then(() => this.$message.success('修改成功'))
					.finally(() => this.loading = false)
			},
			clickRefresh() {
				Promise.all([
					this.getTextConf(),
					this.getImgConf(),
				]).finally(() => this.loading = false);
			},
			clearAllImgInput() {
				// 清空所有 FileInputImg 组件的input，并清空对应的file数据
				this.$refs['file-input-img'].forEach(obj => obj.clearInput());
				this.imgConfs.forEach(item => item.inputArr.forEach(ele => ele.file = null));
			},
			getImgConf() {
				this.loading = true;
				// 查询type 1~7 的图片配置
				const aid = APIs.getActiveId();
				const fnArr = [1, 2, 3, 4, 5, 6].map(type => () => APIs.Img_page({
					aid,
					type,
					current: 1,
					size: 10,
				}).then(res => {
					if (res.code === 0) {
						if (res.page.list.length === 0) {
							// 当前type无图
							console.log('type:', type);
							this.imgConfs[type - 1].inputArr[0].icon = '';
							return;
						} else if (type !== 5) {
							// 单图的
							console.log('单图');
							const { picture } = res.page.list[0];
							this.imgConfs[type - 1].inputArr[0].icon = picture;
						} else {
							// 多图的
							/*const pictures = res.page.list.map(item => item.picture);
							pictures.forEach((item, index) => {
								this.imgConfs[type - 1].inputArr[index].icon = item;
							});*/

							res.page.list.forEach(item => {
								this.imgConfs[type - 1].inputArr[+item.title - 1].icon = item.picture;
							});
						}
					} else {
						throw type;
					}
				}));
				return Utils.serialPromise(fnArr).finally(() => {
					// this.loading = false;
					this.clearAllImgInput();
				});
			},
			setImgConf() {
				this.loading = true;
				// 提交所有图片数据
				const aid = APIs.getActiveId();
				// 未扁平化处理过的数组
				const fnArrOrigin = this.imgConfs.map(({ inputArr }, typeIndex) =>
					inputArr.map((input, titleIndex) => () => {
						if (!input.file) {
							// input没有更改，则传入空promise
							return Promise.resolve().then(() => console.log(typeIndex + 1, titleIndex + 1));
						} else {
							const formData = new FormData();
							formData.append('file', input.file);
							if (!input.icon) {
								// 无图，需要创建
								return APIs.Img_add(formData, {
									aid,
									type: typeIndex + 1,
									title: titleIndex + 1,
								}).then(res => {
									// console.log(res);
									if (res.code === 0) {
										return res.img.picture;
									} else {
										this.$message.error(res.msg);
										throw 1;
									}
								});
							} else {
								// 有图，需要修改
								return APIs.Img_page({
									aid,
									type: typeIndex + 1,
									title: titleIndex + 1,
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
									});
								});
							}
						}
					})
				);
				const fnArrFlatted = fnArrOrigin.flat(2);
				return Utils.serialPromise(fnArrFlatted).then(() => {
					this.getImgConf();
				}).finally(() => {
					// this.loading = false;
				});
			},
			fileInputChange(typeIndex, titleIndex, file, ratio) {
				if (file && typeof(ratio) === 'number') {
					// 检查图片宽高比
					// console.log(ratio);
					const type = typeIndex + 1; // 图片真正的type
					const localUrl = URL.createObjectURL(file);
					// console.log(localUrl);
					const image = new Image();
					const imageLoaded = new Promise(resolve => {
						image.onload = () => resolve();
					});
					imageLoaded.then(() => {
						const { width, height } = image;
						console.log('img-loaded', width, height);
						const wh = width / height;
						if (wh >= 0.95 * ratio && wh <= 1.05 * ratio) {
							console.log('图片符合要求');
							this.imgConfs[typeIndex].inputArr[titleIndex].file = file;
						} else {
							console.log('ratio:', ratio);
							console.log('w/h:', width / height);
							this.$alert('所选图片宽高比与要求相差过大，请重新修改后再上传');
							this.imgConfs[typeIndex].inputArr[titleIndex].fileName = '';
						}
						URL.revokeObjectURL(localUrl); // 清除生成的本地文件
					});
					image.src = localUrl;
				} else {
					this.imgConfs[typeIndex].inputArr[titleIndex].file = file;
				}
			},
			getTextConf() {
				this.loading = true;
				// 查询type 0~1 的文字配置
				const aid = APIs.getActiveId();
				const fnArr = [0, 1, 2, 3, 4].map(type => () => APIs.Text_page({
					aid,
					type,
					current: 1,
					size: 10,
				}).then(res => {
					if (res.code === 0) {
						if (res.page.list.length === 0) {
							// 当前type未创建
							this.textConfs[type].value = '';
							return;
						} else {
							const { value, id } = res.page.list[0];
							this.textConfs[type].value = value;
							this.textConfs[type].id = id;
							this.textConfs[type]._value = value; // 记录旧值
						}
					} else {
						throw type;
					}
				}));
				return Utils.serialPromise(fnArr).finally(() => {
					// this.loading = false;
				});
			},
			setTextConf() {
				this.loading = true;
				// 查询type 0~1 的图片配置
				const aid = APIs.getActiveId();

				const fnArr = this.textConfs.map((item, type) => () => {
					if (!item.value) {
						// input里无值
						return Promise.resolve().then(() => console.log(`type ${type}空`));
					} else if (item.value === item._value) {
						// 文字未更新
						return Promise.resolve().then(() => console.log(`type ${type}未更新`));
					} else {
						if (item.id === null) {
							// id===null，说明未创建
							return APIs.Text_add({
								aid,
								type,
								value: item.value,
							}).then(res => {
								if (res.code === 0) {

								} else {
									this.$message.error(res.msg);
									throw 1;
								}
							});
						} else {
							// 已创建
							return APIs.Text_change({
								id: item.id,
								value: item.value,
							}).then(res => {
								if (res.code === 0) {

								} else {
									this.$message.error(res.msg);
									throw 1;
								}
							});
						}
					}
				});
				return Utils.serialPromise(fnArr).then(() => {
					// 更改完成，刷新文字配置
					this.getTextConf();
				}).finally(() => {
					// this.loading = false;
				});
			},
			/*tapEdit(scope) {
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
					this.$message.error('请选择奖品图标');
					return;
				} else if (typeof probability !== 'number' || probability < 0 || probability > 100 * 10000) {
					this.$message.error('概率格式不正确');
					return;
				}
				this.dialogEdit._fetching = true; // 上锁

				// 根据type和title查询图片url
				const getImgInfo = title => {
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
					}).catch(err => this.$message({
						type: 'error',
						message: err,
					})).finally(() => {
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
									return '图片信息';
								} else {
									this.$message.error(res.msg);
									throw 1;
								}
							}).then(() => getImgInfo())
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
									return '图片信息';
								} else {
									throw 1;
								}
							})
						}).then(() => getImgInfo()).then(data => {
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
			},*/
			/*downloadAll() {
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
			},*/
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
			// this.getTableData();
			Promise.all([
				this.getImgConf(),
				this.getTextConf(),
			]).finally(() => this.loading = false);

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

	.list {
		display: block;

		&>p {
			color: #999;
		}

		.item {
			display: flex;
			flex-wrap: wrap;
			margin: 0.7em 0;
			align-items: center;

			.title {
				margin-right: 0.7em;
				width: 8em;
			}

			.file-input-img-container {
				margin-right: .7em;
			}

			.warning {
				color: #aaa;

			}
		}
	}

</style>
