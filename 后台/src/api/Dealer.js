/**
 * Created by caomei on 2021/8/19.
 */
import { request } from './service'

export function addDeal (data) {
  return request({
    url: 'oms-order/crm/dealer/add',
    method: 'post',
    data:data,
  })
}

export function updateDeal (data) {
  return request({
    url: 'oms-order/crm/dealer/change',
    method: 'post',
    data:data,
  })
}

export function upDeal (data) {
  return request({
    url: 'oms-order/crm/dealer/change',
    method: 'post',
    data:data,
  })
}

export function SearchAllCubes (data) {
  return request({
    url: 'oms-order/crm/dealer/page',
    method: 'get',
    params:data,
  })
}

export function DelCubes (data) {
  return request({
    url: 'oms-order/crm/dealer/remove',
    method: 'post',
    data:data,
  })
}





