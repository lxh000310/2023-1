<template>
	<div>
		<hr>
		<FileInputImg :icon="icons[i]"
		@change="fileChange"
		v-model="fileName"
		></FileInputImg>
		<button @click="i=(i+1)%2" style="margin-left: 1em;">切换icon有无</button>
	</div>
</template>

<script>
	import FileInputImg from './index.vue';
	export default {
		components: {
			FileInputImg,
		},
		data() {
			return {
				icons: [
					'https://www.baidu.com/img/flexible/logo/pc/result.png',
					'',
					// 'https://vv-cdn.webjia.net/java/img/20211004_182545_141_10.jpg',
					// 'https://vv-cdn.webjia.net/java/img/20211002_174319_922_9.jpg',
					// 'https://vv-cdn.webjia.net/java/img/20211002_174124_619_7.jpg',
				],
				i: 0,
				fileName: '',
			};
		},
		methods: {
			fileChange(file) {
				console.log(file);
			},
		},
	};
</script>