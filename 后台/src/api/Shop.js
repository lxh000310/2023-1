/**
 * Created by caomei on 2021/9/17.
 */
import { request } from './service'

export function searchAllShop (data) {
  return request({
    url: 'oms-order/order/sku/pageVo',
    method: 'get',
    params:data,
  })
}

export function AddNewShop (data) {
  return request({
    url: 'oms-order/order/sku/add',
    method: 'post',
    data:data,
  })
}

export function updateShop (data) {
  return request({
    url: 'oms-order/order/sku/change',
    method: 'post',
    data:data,
  })
}

export function searchCarByShop (data) {
  return request({
    url: 'oms-order/order/skuModel/list',
    method: 'get',
    params:data,
  })
}

export function updateShopCar (data) {
  return request({
    url: 'oms-order/order/skuModel/change',
    method: 'post',
    data:data,
  })
}


