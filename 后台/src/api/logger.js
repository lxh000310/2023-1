/**
 * Created by caomei on 2021/7/30.
 */
import { request } from './service'

export function searchLogger(data) {
  return request({
    url: 'oms-logger/sys/logger/page',
    method: 'get',
    params:data,
  })
}

