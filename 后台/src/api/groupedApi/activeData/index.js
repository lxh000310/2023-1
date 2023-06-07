import { requests } from '../../service';

export function ActiveData_downloadAllMobile() {
	return requests({
		url: '/sys/activeData/downloadAllMobile',
		method: 'get',
		responseType: 'arraybuffer'
	});
}

export function ActiveData_downloadMobile(params) {
	return requests({
		url: '/sys/activeData/downloadMobile',
		method: 'get',
		params,
		responseType: 'arraybuffer'
	});
}

export function ActiveData_downloadMobileBySite(params) {
	return requests({
		url: '/sys/activeData/downloadMobileBySite',
		method: 'get',
		params,
		responseType: 'arraybuffer'
	});
}

export function ActiveData_downloadKeyModels(params) {
	return requests({
		url: '/sys/activeData/downloadKeyModels',
		method: 'get',
		params,
		responseType: 'arraybuffer'
	});
}

export function ActiveData_downloadPartitionCount(params) {
	return requests({
		url: '/sys/activeData/downloadPartitionCount',
		method: 'get',
		params,
		responseType: 'arraybuffer'
	});
}

export function ActiveData_getHeatMap(params) {
	return requests({
		url: '/sys/activeData/getHeatMap',
		method: 'get',
		params,
	});
}

export function ActiveData_getStatisticsByData(params) {
	return requests({
		url: '/sys/activeData/getStatisticsByData',
		method: 'get',
		params,
	});
}

export function ActiveData_getStayStatisticsByData(params) {
  return requests({
    url: '/sys/activeData/getStatisticsByData',
    method: 'get',
    params,
  });
}

export function ActiveData_getOutsideStatisticsByTime(params) {
	return requests({
		url: '/sys/activeData/getOutsideStatisticsByTime',
		method: 'get',
		params,
	});
}

export function ActiveData_getOutsideStatisticsByDate(params) {
  return requests({
    url: '/sys/activeData/getOutsideStatisticsByDate',
    method: 'get',
    params,
  });
}

export function ActiveData_getStatisticsByTime(params) {
  return requests({
    url: '/sys/activeData/getStatisticsByTime',
    method: 'get',
    params,
  });
}

export function ActiveData_getPartitionCount(params) {
	return requests({
		url: '/sys/activeData/getPartitionCount',
		method: 'get',
		params,
	});
}

