/**
 * Created by caomei on 2021/9/23.
 */
import { request } from './service'

export function SearchAllAct (data) {
  return request({
    url: 'oms-order/order/active/pageVo',
    method: 'get',
    params:data,
  })
}

export function addActive (data) {
  return request({
    url: 'oms-order/order/active/add',
    method: 'post',
    data:data,
  })
}
