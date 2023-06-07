<template>
	<el-input type="file"
	v-model="fileName"
	ref="el-input"
	@change="change"
	></el-input>
</template>
<script>
	export default {
		name: 'FileInput',
		props: {
			value: {
				required: true,
			}
		},
		data() {
			return {
				fileName: '',
			};
		},
		methods: {
			change() {
				const instance = this.$refs['el-input'];
				const domInput = instance.$refs.input;
				const file = domInput.files[0];
				this.$emit('change', file);
				this.$emit('input', this.fileName);
			},
			clear() {
				// 清空input
				const instance = this.$refs['el-input'];
				const domInput = instance.$refs.input;
				domInput.value = '';
			},
		},
		watch: {
			value(newVal) {
				// console.log('value changed', newVal);
				if(newVal==='') {
					this.clear();
				}
			}
		}
	};

</script>
<style lang="less" scoped>
</style>
