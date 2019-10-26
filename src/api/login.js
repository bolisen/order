import request from '@/utils/request'

export function doLogin(data) {
  return request({
    url: '/login/doLogin',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/login/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
