<template>
	<el-dialog class="uiot-dialog" width="900px" :visible.sync="isShow" :before-close="beforeClose" :close-on-click-modal="false" :title="12342" @open="open">
		<el-table :data="propTableData.col.filter(data => handleAdd || data.name.toLowerCase().includes(handleAdd.toLowerCase()))" highlight-current-row border>
			<el-table-column label="No." type="index" align="center" width="50"></el-table-column>
			<el-table-column :label="1234">
				<template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-input size="mini" v-model="scope.row.code"></el-input>
					</span>
					<span v-else>{{ scope.row.code }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="12341234">
				<template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-input size="mini" v-model="scope.row.name"></el-input>
					</span>
					<span v-else>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="33222">
				<template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-input size="mini" v-model="scope.row.minValue"></el-input>
					</span>
					<span v-else>{{ scope.row.minValue }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="5553">
				<template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-input size="mini" v-model="scope.row.maxValue"></el-input>
					</span>
					<span v-else>{{ scope.row.maxValue }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="1111">
				<template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-select size="mini" v-model="scope.row.valueType" :placeholder="555">
							<el-option v-for="item in valTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</span>
					<span v-else>{{ scope.row.valueType }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="2222">
				<template slot-scope="scope">
					<span v-if="scope.row.isSet">
						<el-select v-model="scope.row.warning" size="mini">
							<el-option v-for="item in warnOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</span>
					<span v-else>{{ scope.row.warning===true?'是':'否' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="170px">
				<template slot="header" slot-scope="scope">
					<el-button v-model="handleAdd" size="mini" type="success" round plain @click="handleAdd(scope.$index, scope.row)">{{ 666 }}</el-button>
				</template>
				<template slot-scope="scope">
					<el-button size="mini" type="primary" round plain v-if="!scope.row.isSet" @click="valChange(scope.row,scope.$index,true)">{{ 999 }}</el-button>
					<el-button size="mini" type="primary" round plain v-else @click="valChange(scope.row,scope.$index,true)">{{ 888 }}</el-button>
					<el-button size="mini" type="danger" round plain v-if="!scope.row.isSet" @click="handleDelete(scope.$index, scope.row)">{{ 777 }}</el-button>
					<el-button size="mini" type="danger" round plain v-else @click="valChange(scope.row,scope.$index,false)">{{ 666 }}</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>
<script>
	const defaultProp = {
		code: '',
		maxValue: '',
		minValue: '',
		name: '',
		valueType: 'String',
		id: '',
		typeId: '',
		warning: false
	}

	export default {
		props: {
			oneRow: {
				type: Array,
				default: function() {
					return [defaultProp, defaultProp]
				}
			}
		},
		data() {
			return {
				isShow: true,
				propTableData: {
					sel: null, // 选中行
					col: []
				},
				warnOptions: [{
						value: true,
						label: '是'
					},
					{
						value: false,
						label: '否'
					}
				],
				valTypeOptions: [{
						value: 'String',
						label: 'String'
					},
					{
						value: 'Int',
						label: 'Int'
					},
					{
						value: 'Double',
						label: 'Double'
					},
					{
						value: 'Boolean',
						label: 'Boolean'
					},
					{
						value: 'Date',
						label: 'Date'
					}
				]
			}
		},
		created() {},
		methods: {
			open() {
				this.propTableData.col = this.oneRow
				this.propTableData.col.map(i => {
					i.isSet = false
				})
				console.log('open', this.propTableData.col)
			},
			// 添加
			handleAdd() {
				for (let i of this.propTableData.col) {
					if (i.isSet) {
						return this.Message(
							1234,
							'warning'
						)
					}
				}
				let row = {
					code: '',
					maxValue: '',
					minValue: '',
					name: '',
					valueType: 'String',
					id: '',
					typeId: '',
					warning: false,
					isSet: true
				}
				this.propTableData.col.push(row)
				this.propTableData.sel = row
			},
			//修改
			valChange(row, index, qx) {
				console.log('edit', this.propTableData)
				//点击修改，判断是否已经保存所有操作
				for (let i of this.propTableData.col) {
					console.log('i.isSet', i.isSet, i.id, row.id)
					if (i.isSet && i.id != row.id) {
						this.Message(999, 'warning')
						return false
					}
				}
				//是否是取消操作
				if (!qx) {
					console.log('qx', this.propTableData.sel.id)
					if (!this.propTableData.sel.id) {
						this.propTableData.col.splice(index, 1)
					}
					return (row.isSet = !row.isSet)
				}
				//提交数据
				if (row.isSet) {
					console.log('this.propTableData.sel', this.propTableData.sel)
					const v = this.propTableData.sel
					// 必填项判断
					if (v.code == '' || v.name == '') {
						this.Message(555, 'warning')
					} else {
						this.$emit('confirm', this.propTableData.sel)
						row.isSet = false
					}
				} else {
					this.propTableData.sel = row
					row.isSet = true
				}
			},
			// 删除
			handleDelete(index, row) {
				this.$emit('delete', row.id)
			},
			beforeClose() {
				this.$emit('cancel')
			},
			Message(msg, type) {
				this.$message({ type: type ? type : 'info', message: msg })
			}
		}
	}

</script>
<style lang="scss">
</style>
