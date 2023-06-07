/**
 * Created by caomei on 2021/8/12.
 */
import { request } from './service'

export function SearchAllCars (data) {
  return request({
    url: 'oms-order/crm/series/page',
    method: 'get',
    params:data,
  })
}

export function SearchAllCarsList (data) {
  return request({
    url: 'oms-order/crm/series/list',
    method: 'get',
    params:data,
  })
}

export  function searchCarModle (data) {
  return request({
    url:'oms-order/crm/model/list',
    method:'get',
    params:data,
  })
}

export function addCars (data) {
  return request({
    url: 'oms-order/crm/series/add',
    method: 'post',
    data:data,
  })
}

export function addCarsModle (data) {
  return request({
    url: 'oms-order/crm/model/add',
    method: 'post',
    data:data,
  })
}

export function DelCars (data) {
  return request({
    url: 'oms-order/crm/series/remove',
    method: 'post',
    data:data,
  })
}

export function DelModel (data) {
  return request({
    url: 'oms-order/crm/model/remove',
    method: 'post',
    data:data,
  })
}

export function ChangeCars (data) {
  return request({
    url: 'oms-order/crm/series/change',
    method: 'post',
    data:data,
  })
}
