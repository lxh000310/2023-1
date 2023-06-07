import { requests } from "../../service";

export function Site_page(params) {
  return requests({
    url: "/sys/site/page",
    method: "get",
    params: {
      current: 1,
      size: 1000,
      ...params,
    }
  });
}

export function Site_getDevices() {
  return requests({
    url: "/sys/site/getDevices",
    method: "get",
  });
}

export function Site_listSiteDevices(params) {
  return requests({
    url: "/sys/site/listSiteDevices",
    method: "get",
    params,
  });
}

export function Site_update(data) {
  return requests({
    url: "/sys/site/update",
    method: "post",
    data,
  });
}