<template>
	<div>
		<InlineEditableTable @remove="$emit('remove', $event)"></InlineEditableTable>
	</div>
</template>
<script>
	import InlineEditableTable from './';
	import FileInput from '../file-input';
	import FileInputImg from '../file-input-img';

	export default {
		name: 'test',
		components: {
			InlineEditableTable,
			FileInput,
			FileInputImg,
		},
		data() {
			return {
				name: '',
				name2: '',
				name3: '',
			};
		},
		methods: {
			imgChange(file) {
				console.log(file);
			},
		}
	};

</script>
