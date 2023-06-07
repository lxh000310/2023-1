/**
 * Created by caomei on 2021/7/27.
 */

import { request } from './service'

export function SearchAllRole (data) {
  return request({
    url: 'oms-login/sys/role/pageVo',
    method: 'get',
    params:data,
  })
}

export function SearchUserRole (data) {
  return request({
    url: 'oms-login/sys/userRole/list',
    method: 'get',
    params:data,
  })
}

export function addUserRole (data) {
  return request({
    url: 'oms-login/sys/userRole/add',
    method: 'post',
    data:data,
  })
}

export function addRole (data) {
  return request({
    url: 'oms-login/sys/role/add',
    method: 'post',
    data:data,
  })
}

export function delRole (data) {
  return request({
    url: 'oms-login/sys/role/remove',
    method: 'post',
    data:data,
  })
}
