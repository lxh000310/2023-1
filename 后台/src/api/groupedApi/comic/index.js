import { requests } from '../../service';

export function Comic_download(params) {
	return requests({
		url: '/sys/comic/download',
		method: 'get',
		params,
		responseType: 'arraybuffer'
	});
}

export function Comic_listComic(params) {
	return requests({
		url: '/sys/comic/listComic',
		method: 'get',
		params,
	});
}

export function Comic_page(params) {
	return requests({
		url: '/sys/comic/page',
		method: 'get',
		params,
	});
}

export function Comic_update(data) {
	return requests({
		url: '/sys/comic/update',
		method: 'post',
		data,
	});
}
