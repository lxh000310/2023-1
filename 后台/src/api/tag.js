/**
 * Created by caomei on 2021/9/1.
 */

import { request } from './service'

export function SearchGift (data) {
  return request({
    url: 'oms-order/gift/item/pageVo',
    method: 'get',
    params:data,
  })
}

export function AddGift (data) {
  return request({
    url: 'oms-order/gift/item/add',
    method: 'post',
    data:data,
  })
}

export function updateGift (data) {
  return request({
    url: 'oms-order/gift/item/change',
    method: 'post',
    data:data,
  })
}

export function addTags(data) {
  return request({
    url: 'oms-order/gift/pack/add',
    method: 'post',
    data:data,
  })
}

export function SearchAllTags (data) {
  return request({
    url: 'oms-order/gift/pack/pageVo',
    method: 'get',
    params:data,
  })
}

export function SearchPackItem (data) {
  return request({
    url: 'oms-order/gift/packItem/list',
    method: 'get',
    params:data,
  })
}




