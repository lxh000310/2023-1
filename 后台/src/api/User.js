/**
 * Created by caomei on 2021/7/23.
 */
import { request } from './service'

export function SearchAllUser (data) {
  return request({
    url: 'oms-login/sys/user/pageVo',
    method: 'get',
    params:data,
  })
}

export function addUser (data) {
  return request({
    url: 'oms-login/sys/user/add',
    method: 'post',
    data:data,
  })
}

export function delUser (data) {
  return request({
    url: 'oms-login/sys/user/remove',
    method: 'post',
    data:data,
  })
}

export function updateUser (data) {
  return request({
    url: 'oms-login/sys/user/change',
    method: 'post',
    data:data,
  })
}
