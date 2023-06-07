/**
 * Created by caomei on 2021/7/28.
 */
import JSEncrypt from 'encryptlong'
import util from '@/libs/util.js'
import {AboutKey} from '@/api/Login.js'


//数据加密
export function exMessage(obj){
  var data = obj;
  var jse = new JSEncrypt();
  jse.setPublicKey(util.cookies.get("publicKey"));
  var base64 = encodeURI(JSON.stringify(data));
  var a = jse.encrypt(base64);
  var json = {
    data: a
  };
  return json;
}

//长数据加密
export function exLongMessage(obj){
  var data = obj;
  var jse = new JSEncrypt();
  jse.setPublicKey(util.cookies.get("publicKey"));
  var base64 = encodeURI(JSON.stringify(data));

  var a = jse.encryptLong(base64);

  var json = {
    data: a
  };
  return json;
}

//数据解密
 export function unMessage(string){
  var jse = new JSEncrypt();
  jse.setPrivateKey("MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBANclHHICKmpQDW1OKVHSGprnbDfgV/BaNNQH3xunbwNzIe8OG5l6DEQxepTTqb7BsZhw9/wMyE5EmO4fK10f4RmHlyXjlQW3dGqO9xnirCApb0JKHUsOgUU6o1mfvUSQ7HkUVzUC069ppvyPbN/wJV5Moqgw9aJN6wk+XkFarQd1AgMBAAECgYABNLS2HDZUpjeNDJ/FVPd6isrb0qbA3XXnrQDzzLpzOyqjhmFijivnbfI78fvE6p0DjQ6MG8jmTL12suIGrEO8uENJtq7qYZTQRY2Tp4iskWJw1/iqxMuE59++qfkHy/BMSJO5h6FRMoxsaecedzByiARzgwtM2vkvkjHXNZLQgQJBAPLFB9AjCagnsq4S/HnDlvfiqYs+p3ICEu0PbSouhqugRRMRVmQQSFi2813NUnkiJKBD12w7njStB2PNbqBpT2UCQQDi3q2pE2RALigO/jiDKYKl7YqFImvEt59x1CEoLkN+Fp5BYiLnHeOs2Jl1yC54PBo4dl/BX3y025havk5B6f7RAkEA3s+Q5SlTMp8EshlA2ax2gZnpS6A8ZDmdDy/qXB2Jgjk9TEvMQ1hiXfHDmOLZ/80jWmgJbg+lmuj3cFTaZKVitQJBAKQE476KI393H0T/rLG/EBKQMwZfxVQ6gQ7Vk4cuM2N0TMPuhFddN55eFkyeBmKs6TQK+N2gAFPtMy/fyEpFNxECQQDCpRukzIhp4SBoq3CPvppgWggwdqyCaNnU/5/LUZAXw7U3VkqgwLFdMQQaqhY0GYjwajomAT3aqpjhZju9QL7y");
  var a = jse.decryptLong(string);
  return a
}

//校验过期时间
 export function changeEx(){
  var date = new Date();
  if (util.cookies.get('expire') > date.getTime()) {
    return true;
  } else {
    return false;
  }
}

//获取新的秘钥信息
export function getNewKey(){
  AboutKey().then(res => {
    if (res.code == 0) {
      util.cookies.set("key", res.key.key);
      util.cookies.set("publicKey", res.key.publicKey);
      util.cookies.set("expire", res.key.expire);
    }
  })
}
