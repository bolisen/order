import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    userId: '@increment',
    name: 'YEEZY 350',
    clotheTypeId: '@increment',
    shopType: '@integer(1, 3)',
    Size: 41,
    buyPrice: 1000.00,
    salePrice: 2000.00,
    'shipNum|1': +Mock.Random.date('T'),
    shipFee: 10.00,
    saleTime: '@datetime'
  }))
}

export default [
  {
    url: '/shoe/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10, sort } = config.query

      let mockList = List.filter(item => {
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          rows: pageList
        }
      }
    }
  }
]
