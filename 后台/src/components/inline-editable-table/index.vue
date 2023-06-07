<template>
	<div class="inline-editable-table-container">
		<el-table :data="data" style="width: 100%" :row-class-name="({row, rowIndex})=>row._index=rowIndex" @row-click="rowClick" :highlight-current-row="true" ref="table">
			<!-- <el-table-column label="商品类型" prop="type">
				<template #default="{row, $index}">
					<span v-if="$index!==editingRowIndex">{{row.type}}</span>
					<el-select v-else v-model="row.type" placeholder="请选择商品类型">
						<el-option v-for="item in ['0','1']" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column> -->
			<el-table-column label="商品ID" prop="sid">
				<template #default="{row, $index}">
					<span v-if="$index!==editingRowIndex">{{row.sid}}</span>
					<el-input v-else v-model="row.sid" placeholder="请输入商品ID"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="商品名称" prop="name">
				<template #default="{row, $index}">
					<span v-if="$index!==editingRowIndex">{{row.name}}</span>
					<el-input v-else v-model="row.name" placeholder="请输入商品名称"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="商品图" prop="_url">
				<template #default="{row, $index}">
					<img :src="row.__url || row._url" v-show="$index!==editingRowIndex" class="img-box">
					<FileInputImg v-show="$index===editingRowIndex" :icon="row._url" v-model="row.fileName" @change="changeImg(row, $event)"></FileInputImg>
				</template>
			</el-table-column>
			<el-table-column align="right">
				<template #header="scope">
					<el-button type="primary" icon="el-icon-plus" @click="startAdding">新增商品</el-button>
				</template>
				<template #default="scope">
					<el-button v-if="!(scope.$index===data.length-1 && adding)" type="primary" icon="el-icon-minus" @click.stop="remove(scope.row, scope.$index)"></el-button>
					<el-button v-else type="primary" @click.stop="stopAdding">撤销(Esc)</el-button>
				</template>
			</el-table-column>

			<template #append>
				<div ref="last" style="height: 0;opacity: 0;visibility: hidden;">last row</div>
			</template>
		</el-table>
	</div>
</template>
<script>
	import FileInputImg from '@/components/file-input-img';

	export default {
		name: 'InlineEditableTable',
		components: {
			FileInputImg,
		},
		props: {
			data: {
				type: Array,
				required: true,
			},
			skuItem: {
				type: Object,
				required: true,
			}
		},
		data() {
			return {
				editingRowIndex: -1,
				adding: false,
				addTimer: null,
			};
		},
		methods: {
			console_log(...args) {
				console.log(...args);
			},
			setTimeoutPro(duration) {
				return new Promise(resolve => setTimeout(resolve, duration));
			},
			changeImg(row, [file, url]) {
				console.log(row, file, url);
				row.file = file;
				row.__url = url;
			},
			remove(row, index) {
				// console.log(row, index);
				if (row.id) {
					this.$emit('remove', [row, index]);
				} else {
					// 删除的新商品
					this.data.splice(index, 1);
				}
				this.clearCurrent(null); // 清空当前选中的行
			},
			startAdding() {
				if (this.adding) {
					return;
				} else {
					this.adding = true;
					this.editingRowIndex = this.data.length;
					this.data.push(this.skuItem);
					this.$refs.table.setCurrentRow(this.skuItem); // 将新增行作为选中行
					this.$nextTick(()=>this.$refs.last.scrollIntoView()); // 滚动使最后一行可见
				}
			},
			stopAdding() {
				if (!this.adding) {
					return;
				} else {
					this.adding = false;
					this.editingRowIndex = -1;
					this.data.pop();
					this.clearSkuItem();
				}
			},
			add() {
				console.log('add');
				this.skuItem.type = 0; // 固定type为0
				this.skuItem._url = this.skuItem.__url; // 新增数据时需要给一个假icon
				this.skuItem._file = this.skuItem.file; // 新增数据的file是必填项，所以保存一个和icon对应的文件到 _file，请求时优先使用file，没有则使用_file
				this.$emit('add'); // 向外抛出add事件（让skuItem的数据push进skuArr，skuArrAdded作废，因为从skuArr和id足够判断出新增的数据，且skuArrAdded已失去响应性）
				this.adding = false;
				this.editingRowIndex = -1;
				this.data.splice(-2, 1); // 将skuItem所在行删除
				this.clearSkuItem();
			},
			clearSkuItem() {
				Object.assign(this.skuItem, {
					type: null,
					sid: null,
					name: null,
					file: null,
					_url: null,
					__url: null,
					fileName: '',
				});
			},
			rowClick(row, column, e) {
				console.log('row-click');
				const index = row._index;
				if (!this.adding) {
					if (this.editingRowIndex === -1) {
						this.editingRowIndex = index;
					} else {
						const row = this.data[this.editingRowIndex];
						const { sid, name } = row;
						if (!sid) {
							this.$message('商品ID不能为空');
						} else if (!name) {
							this.$message('商品名称不能为空');
						} else {
							this.editingRowIndex = index;
						}
					}
				}
			},
			clearCurrent(type) {
				console.log(type);
				if (this.adding) {
					if (type === 'click') {
						return;
					} else if (type === 'esc') {
						this.adding = false;
						this.editingRowIndex = -1;
						this.data.pop();
						this.clearSkuItem();
					}
				} else {
					if (this.editingRowIndex !== -1) {
						const row = this.data[this.editingRowIndex];
						const { type, sid, name } = row;
						if (!sid) {
							this.$message('商品ID不能为空');
						} else if (!name) {
							this.$message('商品名称不能为空');
						} else {
							this.editingRowIndex = -1;
							this.$refs.table.setCurrentRow();
						}
					}
				}
			}
		},
		watch: {
			skuItem: {
				handler(val) {
					const { type, sid, name, file } = val;
					console.log(type, sid, name, file);
					clearTimeout(this.addTimer);
					// 不再校验type
					if (/*typeof(type) === 'string' && */sid && sid.trim() && name && name.trim() && file) {
						this.addTimer = setTimeout(this.add, 1000);
					}
				},
				deep: true,
			}
		},
		/**
		 * 生命周期
		 */
		updated() {
			console.log('===================updated===================');
		},
	};

</script>
<style lang="less" scoped>
	img.img-box {
		display: block;
		width: 5em;
		height: 5em;
		object-fit: contain;
	}

</style>
