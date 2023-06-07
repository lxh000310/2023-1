/**
 * Created by caomei on 2021/7/28.
 */
import { request } from './service'

export function SearchPer (data) {
  return request({
    url: 'oms-login/sys/permit/pageVo',
    method: 'get',
    params:data,
  })
}

export function SearchPerTree (data) {
  return request({
    url: 'oms-login/sys/permit/tree',
    method: 'get',
    params:data,
  })
}

export function SearchRolePre (data) {
  return request({
    url: 'oms-login/sys/rolePermit/list',
    method: 'get',
    params:data,
  })
}

export function AddRolePer (data) {
  return request({
    url: 'oms-login/sys/rolePermit/change',
    method: 'post',
    data:data,
  })
}

export function addPer(data) {
  return request({
    url:'oms-login/sys/permit/add',
    method: 'post',
    data:data,
  })
}

export function addPath(data) {
  return request({
    url:'oms-login/sys/path/add',
    method: 'post',
    data:data,
  })
}

export function SearchPath (data) {
  return request({
    url: 'oms-login/sys/path/pageVo',
    method: 'get',
    params:data,
  })
}

export function PathBind(data) {
  return request({
    url:'oms-login/sys/permitPath/add',
    method: 'post',
    data:data,
  })
}

export function PathDel(data) {
  return request({
    url:'oms-login/sys/permit/remove',
    method: 'post',
    data:data,
  })
}


