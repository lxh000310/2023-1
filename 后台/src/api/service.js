import axios from 'axios'
import md5 from 'js-md5';
import Adapter from 'axios-mock-adapter'
import { get } from 'lodash'
import util from '@/libs/util'
import { errorLog, errorCreate } from './tools';
import { mapActions } from 'vuex';
import { Root } from '@/main.js';
import { Message } from 'element-ui';


/**
 * @description 创建请求实例
 */
function createService() {
  // 创建一个 axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    config => config,
    error => {
      // 发送失败
      console.log(error)
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      // dataAxios 是 axios 返回数据中的 data
      const dataAxios = response.data
      // console.log('dataAxios', dataAxios);
      // 这个状态码是和后端约定的
      // const { errorCode } = dataAxios
      // 根据 errorCode 进行判断
      if (/* errorCode === undefined */ false) {
        // 如果没有 errorCode 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
        return dataAxios
      } else {
        const data = dataAxios;
        console.log('data', data);
        if (data.code === 501) {
          // 统一处理token失效
          new Promise(onClose => {
            Message({
              type: 'error',
              message: 'token已失效，请重新登录',
              onClose,
            })
          }).then(() => {
            Root.logout();
          });
          return Promise.reject();
        } else if (data.code === 0) {
          return data;
        } else {
          console.error(data.msg); // 调试
          return data;
        }
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400:
          error.message = '请求错误';
          break
        case 401:
          error.message = '未授权，请登录';
          break
        case 403:
          error.message = '拒绝访问';
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break
        case 408:
          error.message = '请求超时';
          break
        case 500:
          error.message = '服务器内部错误';
          break
        case 501:
          error.message = '服务未实现';
          break
        case 502:
          error.message = '网关错误';
          break
        case 503:
          error.message = '服务不可用';
          break
        case 504:
          error.message = '网关超时';
          break
        case 505:
          error.message = 'HTTP版本不受支持';
          break
        default:
          break
      }
      errorLog(error)
      return Promise.reject(error)
    }
  )
  return service
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequestFunction(service) {
  return function(config) {
    var sing;
    var timestamp;
    if (config.url == "oms-login/sys/sessionKey/getPubVo") {
      var date = new Date();
      sing = '';
      timestamp = date.getTime()
    } else if (config.data == undefined && config.params == undefined) {
      var date = new Date();
      sing = md5(date.getTime() + util.cookies.get('key'));
      timestamp = date.getTime()
    } else {
      var date = new Date();
      timestamp = date.getTime();
      if (config.params == undefined) {
        sing = md5(config.data.data + date.getTime() + util.cookies.get('key'));
      } else if (config.data == undefined) {
        sing = md5(config.params.data + date.getTime() + util.cookies.get('key'));
      }
    }
    const token = util.cookies.get('token');
    const configDefault = {
      headers: {
        "sign": sing.slice(8, 24),
        "token": token,
        "timestamp": timestamp,
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 1000*60,
      baseURL: process.env.VUE_APP_API,
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}

// 不加解密
function createRequestFunctions(service) {
  return function(config) {
    const token = util.cookies.get('token');
    const configDefault = {
      headers: {
        "token": token,
        "zljphfUid": "1",
        'Content-Type': get(config, 'headers.Content-Type', 'application/json')
      },
      timeout: 1000*60*10,
      baseURL: process.env.VUE_APP_API.split(';')[0],
      data: {}
    }
    return service(Object.assign(configDefault, config))
  }
}

// 用于真实网络请求的实例和请求方法
export const service = createService();
export const request = createRequestFunction(service);
export const requests = createRequestFunctions(service);

// // 用于模拟网络请求的实例和请求方法
// export const serviceForMock = createService()
// export const requestForMock = createRequestFunction(serviceForMock)
//
// // 网络请求数据模拟工具
// export const mock = new Adapter(serviceForMock)
