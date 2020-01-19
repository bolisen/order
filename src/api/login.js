import request from '@/utils/request'

// 登录
export function doLogin(data) {
  return request({
    url: '/back/login/doLogin',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/back/login/getInfo',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/back/login/logout',
    method: 'post'
  })
}
