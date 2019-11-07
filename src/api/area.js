import request from '@/utils/request'

export function getArea(data) {
  return request({
    url: '/area/getAllList',
    method: 'post',
    data: data
  })
}
