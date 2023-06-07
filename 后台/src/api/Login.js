/**
 * Created by caomei on 2020/6/29.
 */

import { requests } from './service'


export function Login (data) {
  return requests({
    url: '/sys/account/login',
    method: 'post',
    data,
  });
}

export function ChangePassword (data) {
  return requests({
    url: '/sys/account/updatePassword',
    method: 'post',
    data: data
  })
}

export function getInfo (data) {
  return request({
    url: 'oms-login/sys/admin/getVo',
    method: 'get'
  })
}

export function getCap (data) {
  return request({
    url: 'oms-login/sys/admin/getCaptcha',
    method: 'get'
  })
}

export function AboutKey () {
  return request({
    url: 'oms-login/sys/sessionKey/getPubVo',
    method: 'get',
  })
}

export function getPermitList () {
  return request({
    url: 'oms-login/sys/admin/getPermitList',
    method: 'get',
  })
}

export function getPathList () {
  return request({
    url: 'oms-login/sys/admin/getPathList',
    method: 'get',
  })
}

export function getMenuList () {
  return request({
    url: 'oms-login/sys/admin/getMenuTree',
    method: 'get',
  })
}

export function getUserInfoS() {
  return request({
    url: 'oms-login/sys/admin/getVo',
    method: 'get',
  })
}


