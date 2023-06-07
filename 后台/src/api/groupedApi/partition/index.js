import { requests } from "../../service";

export function Partition_list(params) {
  return requests({
    url: "/sys/partition/list",
    method: "get",
    params,
  });
}
