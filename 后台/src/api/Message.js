/**
 * Created by caomei on 2021/8/3.
 */

import { request } from './service'

export function SearchAllMessage (data) {
  return request({
    url: 'oms-logger/sys/message/page',
    method: 'get',
    params:data,
  })
}

export function SearchNoReadMessage (data) {
  return request({
    url: 'oms-logger/sys/message/page',
    method: 'get',
    params:data,
  })
}

export function sendMessage (data) {
  return request({
    url: 'oms-logger/sys/logger/add',
    method: 'post',
    data:data,
  })
}
