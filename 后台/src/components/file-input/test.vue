<template>
	<div>
		<FileInput @change="fileChange"
		v-model="fileName"
		></FileInput>
	</div>
</template>
<script>
	import FileInput from './index.vue';
	export default {
		name: 'test',
		components: {
			FileInput,
		},
		data() {
			return {
				fileName: '',
				file: null,
			};
		},
		methods: {
			fileChange(file) {
				console.log(file);
			},
			console_log(...args) {
				console.log(...args);
			}
		},
	};

</script>
