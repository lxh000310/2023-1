<template>
	<label style="display: inline-flex;" class="file-input-img-container">
		<input type="file" accept="image/*" style="width: 0;height: 0;opacity: 0;" ref="input-file" @change="fileInputChange"
		>
		<div class="box">
			<img class="el-upload-list__item-thumbnail" :src="fileUrl" style="width: 100%;height: 100%;object-fit: contain;" v-if="file">
			<img class="el-upload-list__item-thumbnail" :src="icon" style="width: 100%;height: 100%;object-fit: contain;" v-else-if="icon">
			<i class="el-icon-plus" style="font-size: 2em;" v-else></i>
		</div>
	</label>
</template>
<script>
	export default {
		props: {
			icon: {
				type: String,
				default: ()=>'',
			},
			value: {
				required: true,
			},
		},
		data() {
			return {
				file: null,
			};
		},
		computed: {
			fileUrl() {
				console.log('computed');
				if(this.file) {
					return URL.createObjectURL(this.file);
				}else {
					return null;
				}
			},
		},
		methods: {
			fileInputChange(e) {
				this.file = e.target.files[0];
				this.$emit('change', [this.file, this.fileUrl]); // 抛出change事件，并把file传递出去
				this.$emit('input', this.$refs['input-file'].value); // 向 v-model 绑定的数据赋值
			},
			clearInput() {
				// 清空input
				this.$refs['input-file'].value = '';
				this.file = null;
			},
			revoke(oldVal=this.fileUrl) {
				console.log(`revoke ${oldVal}`);
				URL.revokeObjectURL(oldVal); // 撤销旧的url，清除文件缓存
			},
		},
		watch: {
			value(newVal) {
				// console.log('value changed', newVal);
				if(newVal==='') {
					this.clearInput();
				}
			},
			fileUrl(newVal, oldVal) {
				console.log('fileUrl changed. from ' + `${oldVal} to ${newVal}`);
				this.revoke(oldVal);
			},
		},
		destroyed() {
			console.log('====================destroyed====================');
			this.revoke();
		}
	};

</script>
<style lang="less" scoped>
	.file-input-img-container {
		.box {
			width: 5em;
			height: 5em;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid;
			border-radius: .3em;
			color: #ccc;
			&:hover {
				color: #409EFF;
			}
		}
	}

</style>
