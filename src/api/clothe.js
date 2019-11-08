import request from '@/utils/request'

/**
 * 查询列表
 * @param query
 * @returns {AxiosPromise}
 */
export function listShoe(query) {
  return request({
    url: '/clothe/getList',
    method: 'get',
    params: query
  })
}

/**
 * 新增
 * @param data
 * @returns {AxiosPromise}
 */
export function addModel(data) {
  return request({
    url: '/clothe/add',
    method: 'post',
    data: data
  })
}

/**
 * 获取一条记录
 * @param id
 * @returns {AxiosPromise}
 */
export function getModel(id) {
  return request({
    url: '/clothe/getOne?id=' + id,
    method: 'get'
  })
}

/**
 * 更新一条记录
 * @param data
 * @returns {AxiosPromise}
 */
export function updateModel(data) {
  return request({
    url: '/clothe/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除一条记录
 */
export function delModel(data) {
  return request({
    url: '/clothe/del',
    method: 'post',
    data: data
  })
}
