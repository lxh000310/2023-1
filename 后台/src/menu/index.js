import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
export function supplementPath(menu) {
	return menu.map(e => ({
		...e,
		path: e.path || uniqueId('d2-menu-empty-'),
		...e.children ? {
			children: supplementPath(e.children)
		} : {}
	}))
}

export const menuHeader = supplementPath([
	// { title: '首页', icon: 'home', path: '/index' },
]);

export const menuAside = supplementPath([
	{ title: '首页', icon: 'home', path: '/index' },
	/* {
		title: '活动配置',
		icon: 'cog',
		children: [
			// { path: '/goodsConf', title: '商品配置', icon: 'shopping-bag' },
			// { path: '/textConf', title: '文本配置', icon: 'file-text-o' },
			{ path: '/activeConf', title: '编辑活动', icon: 'pencil-square-o' },
			{ path: '/prizeConf', title: '抽奖配置', icon: 'pie-chart' },
			{ path: '/imgConf', title: '图文配置', icon: 'file-picture-o' },
		]
	},
	{
		title: '活动信息',
		icon: 'info-circle',
		children: [
			{ path: '/user', title: '用户信息', icon: 'user' },
			{ path: '/order', title: '订单信息', icon: 'cubes' },
			{ path: '/prize', title: '中奖信息', icon: 'gift' },
		]
	}, */
]);
