# usage

- 监听 `change` 事件，以获取文件对象
- 双向绑定一个字符串（必传）
	1. 主动赋值为空字符串时会清空input，其他赋值无效果
	2. input中有文件时，字符串为文件名