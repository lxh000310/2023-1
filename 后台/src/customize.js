import "lodash";

// console.log('api', [process.env.VUE_APP_API]);
const api = process.env.VUE_APP_API;
let customizeIndex;
let configurable = false;
if (api.includes("参数配置")) {
  // 站点内展示参数配置页面（只对我们自己可见）
  configurable = true;
}
if (api.includes("荣威")) {
  customizeIndex = 0;
} else if (api.includes("极度")) {
  customizeIndex = 1;
} else if (api.includes("智己")) {
  customizeIndex = 2;
}

// 判断，并对参数进行格式化
function checkParam(obj, key) {
  let formatted;
  if (!obj[key] || typeof obj[key] !== "object") {
    formatted = false;
  } else {
    if (
      obj[key].default !== undefined &&
      typeof obj[key].specifics === "object"
    ) {
      formatted = true;
    } else {
      formatted = false;
    }
  }
  if (!formatted) {
    formateParam(obj, key);
  }
}
// 格式化参数
function formateParam(obj, key) {
  obj[key] = {
    default: obj[key],
    specifics: {}
  };
}
// 读参数
function getParam(obj, key, date) {
  checkParam(obj, key);
  // 已格式化
  if (!date) {
    return obj[key].default;
  } else {
    let special = obj[key].specifics[date];
    if (special === undefined) {
      return;
    } else {
      return special;
    }
  }
}
// 写参数，不修改参数本身，只返回修改后的参数
function setParam(obj, key, val, date) {
  checkParam(obj, key);
  const param = JSON.parse(JSON.stringify(obj[key]));
  if (!date) {
    // 更新默认值
    param.default = val==='' ? null : val;
  } else {
    // 更新特定的某一天
    if (val === "") {
      delete param.specifics[date];
    } else {
      param.specifics[date] = val;
    }
  }
  return param;
}
// 混入某个参数对应的get、set函数以及双向绑定的字段
function mixin(key) {
  // console.log('mixin-this', this);
  return {
    ["_" + key]: null, // 用来双向绑定
    [key + "_get"]: function(date) {
      return getParam(this, key, date);
    },
    [key + "_set"]: function(val, date) {
      return setParam(this, key, val, date);
    }
  };
}

// 恢复为本地原始数据
function recover() {
  const origin = {
    configurable, // 本地配置，不传线上，也不被线上覆盖
    customizeIndex,
    index: {
      title: ["荣威", "极度", "智己"][customizeIndex],
      downloadMobileBySite: [
        {
          stayMin: 300,
          stayMax: 3600
        },
        {
          stayMin: 300,
          stayMax: 3600
        },
        {
          stayMin: 300,
          stayMax: 3600
        }
      ][customizeIndex],
      visible: true // 是否在首页菜单中对用户可见
    },
    site: {
      tab1: {
        section1: {
          downloadingKeyModelsBtn: {
            exist: [true, true, false][customizeIndex],
            minStay: [10, 100, 100][customizeIndex]
          },
          stayMin: [
            {
              value: 30,
              text: "30秒"
            },
            {
              value: 300,
              text: "30秒"
            },
            {
              value: 300,
              text: "5分钟"
            }
          ][customizeIndex],
          stayMax: [
            {
              value: 3600,
              text: "60分钟"
            },
            {
              value: 3600,
              text: "60分钟"
            },
            {
              value: 3600,
              text: "60分钟"
            }
          ][customizeIndex]
        },
        section2: {
          getPartitionCount: {
            minStay: [10, 100, 10][customizeIndex]
          }
        },
        section3: {
          fakeDailyTab1ChartData: null,
          ...mixin("fakeDailyTab1ChartData")
        },
        section4: {
          downloadMobile: [
            {
              stayMin: 300,
              stayMax: 3600
            },
            {
              stayMin: 300,
              stayMax: 3600
            },
            {
              stayMin: 300,
              stayMax: 3600
            }
          ][customizeIndex]
          // 和section2.getPartitionCount保持一致
          /* downloadPartitionCount: {
          minStay: [10, 10, 10][customizeIndex],
        } */
        }
      },
      tab2: {
        getHeatMap: {
          minStay: [10, 100, 250][customizeIndex],
          ...mixin("minStay")
        }
      },
      tab4: {
        exist: [true, true, false][customizeIndex]
      }
    }
  };
  Object.assign(customizeOption, origin);
}

const customizeOption = {};
recover();

// 函数的json化
// 不允许使用函数的简写形式，但可以使用箭头函数
function stringify(obj) {
  try {
    return JSON.stringify(obj, (k, v) => {
      if (typeof v === "function") {
        return `FUNCTION_FLAG ${v}`;
      } else {
        return v;
      }
    });
  } catch (error) {
    console.log(error);
    return "出错了";
  }
}
// 对应的解析
function parse(jsonStr) {
  try {
    return JSON.parse(jsonStr, function(key, value) {
      console.log(this, key, value);
      if (value && typeof value === "string") {
        if (value.indexOf("FUNCTION_FLAG") > -1) {
          return new Function(`return ${value.replace("FUNCTION_FLAG", "")}`)();
        } else {
          return value;
        }
      }
      return value;
    });
  } catch (error) {
    console.log(error);
    return "出错了";
  }
}

function getRealSurveillanceVideoUrl(surveillanceVideo) {
  let url;
  let option;
  try {
    const obj = JSON.parse(surveillanceVideo);
    url = obj[0];
    option = obj[1];
  } catch (error) {
    url = surveillanceVideo;
    option = null;
  }
  return { url, option };
}

export default customizeOption;
export { getRealSurveillanceVideoUrl, stringify, parse, checkParam, recover };
