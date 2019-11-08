import request from '@/utils/request'

/**
 * 获取省市区列表
 * @returns {AxiosPromise}
 */
export function getArea() {
  return request({
    url: '/area/getList',
    method: 'post'
  })
}
