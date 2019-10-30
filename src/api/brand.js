import request from '@/utils/request'

/**
 * 查询列表
 * @param query
 * @returns {AxiosPromise}
 */
export function fetchList(query) {
  return request({
    url: '/brand/getList',
    method: 'get',
    params: query
  })
}

export function addModel(data) {
  return request({
    url: '/brand/add',
    method: 'post',
    data: data
  })
}
