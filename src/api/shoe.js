import request from '@/utils/request'

/**
 * 查询列表
 * @param query
 * @returns {AxiosPromise}
 */
export function fetchList(query) {
  return request({
    url: '/shoe/getList',
    method: 'get',
    params: query
  })
}
