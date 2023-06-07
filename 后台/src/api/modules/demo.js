import { map, random } from 'lodash'
// import { forEach } from 'core-js/fn/array'
export default ({ request, faker, mock, tools, requestForMock }) => ({
  treeDad: ['1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'],
  treeChild: ['1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010'],
  treeids: { id: '', parentId: '' },
  DEMO_BUSINESS_TABLE_1_LIST (params = {}) {
    // 模拟数据
    mock
      .onAny('/demo/business/table/1/fetch')
      .reply(config => tools.responseSuccess({
        page: {
          total: 600
        },
        list: map(Array(config.params.pageSize), () => ({
          id: faker.random.uuid(),
          sex: faker.random.boolean() === true ? '男' : '女',
          age: faker.random.number(65),
          address: faker.address.streetName() + faker.address.streetAddress(),
          key: faker.random.uuid(),
          value: [10, 100, 200, 500][random(0, 3)],
          enabled: faker.random.boolean(),
          name: {
            name: faker.name.firstName() + faker.name.lastName(),
            type: 's' + faker.random.number(100),
            link: faker.random.number(15)
          },
          admin: faker.random.words(),
          front: faker.random.words(),
          lastModifiedDate: faker.date.past(),
          ldap: faker.random.boolean(),
          dateTimeUse: faker.date.past(),
          email: faker.name.firstName() + '@' + faker.name.lastName() + '.com ',
          password: faker.random.uuid(),
          accountNonLocked: faker.random.boolean(),
          accountNonExpired: faker.random.boolean(),
          organizationCode: 'CV' + faker.random.number(9) + faker.random.number(9),
          organizationName: '上汽大通' + faker.name.firstName() + '科技有限公司',
          organizationEnglishName: faker.random.words(1),
          organizationType: '类型' + faker.random.number(2),
          organizationAbbreviation: faker.name.firstName() + faker.name.firstName() + faker.name.firstName(),
          abbreviationCode: '11' + faker.random.number(1) + faker.random.number(1),
          personName: faker.name.firstName() + faker.name.firstName() + faker.name.firstName(),
          personType: faker.random.boolean() === true ? '离职' : '在职',
          fox: faker.random.number(9),
          fiexdPhone: faker.random.number(10000) + '-' + faker.random.number(1000000),
          mobilePhone: '1' + faker.random.number(1000000000),
          systemName: faker.random.words(1),
          isTrue: faker.random.boolean() === true ? '是' : '否',
          number: faker.random.number(100),
          type: '类型' + faker.random.number(2),
          children: [
            {
              id: 31,
              organizationCode: 'CV41',
              organizationName: '上汽大通房车科技有限公司',
              organizationEnglishName: 'test',
              organizationType: '类型3-1',
              organizationAbbreviation: '王小虎',
              abbreviationCode: '1102-1',
              children: [
                {
                  id: 311,
                  organizationCode: 'CV41-1',
                  organizationName: '上汽大通房车科技有限公司',
                  organizationEnglishName: 'test',
                  organizationType: '类型3-1-1',
                  organizationAbbreviation: '王小虎',
                  abbreviationCode: '1102-1-1'
                }
              ]
            },
            {
              id: 32,
              organizationCode: 'CV42',
              organizationName: '上汽大通房车科技有限公司',
              organizationEnglishName: 'test',
              organizationType: '类型3-2',
              organizationAbbreviation: '王小虎',
              abbreviationCode: '1102-2'
            }
          ]
        }))
      }))
    // 接口请求
    return requestForMock({
      url: '/demo/business/table/1/fetch',
      method: 'get',
      params
    })
  },
  DEMO_get_apqp (params = {}) {
    // 模拟数据
    mock
      .onAny('/demo/table/1/fetchA')
      .reply(config => tools.responseSuccess({
        page: {
          total: 200
        },
        list: map(Array(config.params.pageSize), () => ({
          tempindex: {
            id: faker.random.number(600),
            popuptype: 'TEMP',
            tempid: 'APQP-TEMP' + faker.random.number(600)
          },
          templateCode: 'APQP-TEMP' + faker.random.number(600),
          templateName: faker.commerce.productName(),
          templateType: faker.random.number(3).toString(),
          templateStatus: faker.random.number(2).toString(),
          templateDesc: faker.lorem.sentence()
        }))
      }))
    // 接口请求
    return requestForMock({
      url: '/demo/table/1/fetchA',
      method: 'get',
      params
    })
  },
  DEMO_get_tree (params = {}) {
    // 模拟数据
    mock
      .onAny('/demo/table/2/fetchA')
      .reply(config => tools.responseSuccess({
        page: {
          total: 50
        },
        list: map(Array(100), () => ({
          // id: this.treeids.id,
          // parentId: this.treeids.parentId,
          children: [
            {
              treeid: this.treeBuild(),
              taskname: faker.name.findName(),
              tasktype: ['A', 'B', 'C', 'D'][random(0, 2)],
              taskdes: faker.lorem.word(),
              keytask: faker.lorem.word(),
              fixedpoint: random(0, 1) === 0 ? '是' : '否',
              Startmeeting: random(0, 1) === 0 ? '' : '已开',
              gr1: random(0, 1) === 0 ? '完成' : '',
              gr2: random(0, 1) === 0 ? '' : '完成',
              gr3: random(0, 1) === 0 ? '完成' : '',
              gr4: random(0, 1) === 0 ? '' : '完成',
              sortnum: random(0, 9)
            },
            {
              treeid: this.treeBuild(),
              taskname: faker.name.findName(),
              tasktype: ['A', 'B', 'C', 'D'][random(0, 2)],
              taskdes: faker.lorem.word(),
              keytask: faker.lorem.word(),
              fixedpoint: random(0, 1) === 0 ? '是' : '否',
              Startmeeting: random(0, 1) === 0 ? '' : '已开',
              gr1: random(0, 1) === 0 ? '完成' : '',
              gr2: random(0, 1) === 0 ? '' : '完成',
              gr3: random(0, 1) === 0 ? '完成' : '',
              gr4: random(0, 1) === 0 ? '' : '完成',
              sortnum: random(0, 9)
            },
            {
              treeid: this.treeBuild(),
              taskname: faker.name.findName(),
              tasktype: ['A', 'B', 'C', 'D'][random(0, 2)],
              taskdes: faker.lorem.word(),
              keytask: faker.lorem.word(),
              fixedpoint: random(0, 1) === 0 ? '是' : '否',
              Startmeeting: random(0, 1) === 0 ? '' : '已开',
              gr1: random(0, 1) === 0 ? '完成' : '',
              gr2: random(0, 1) === 0 ? '' : '完成',
              gr3: random(0, 1) === 0 ? '完成' : '',
              gr4: random(0, 1) === 0 ? '' : '完成',
              sortnum: random(0, 9)
            }
          ],
          treeid: this.treeBuild(),
          taskname: faker.name.findName(),
          tasktype: ['A', 'B', 'C', 'D'][random(0, 2)],
          taskdes: faker.lorem.word(),
          keytask: faker.lorem.word(),
          fixedpoint: random(0, 1) === 0 ? '是' : '否',
          Startmeeting: random(0, 1) === 0 ? '' : '已开',
          gr1: random(0, 1) === 0 ? '完成' : '',
          gr2: random(0, 1) === 0 ? '' : '完成',
          gr3: random(0, 1) === 0 ? '完成' : '',
          gr4: random(0, 1) === 0 ? '' : '完成',
          sortnum: random(0, 9)
        }))
      }))
    // 接口请求
    return requestForMock({
      url: '/demo/table/2/fetchA',
      method: 'get',
      params
    })
  },
  /**
   * @description 错误日志示例 请求一个不存在的地址
   */
  DEMO_LOG_AJAX () {
    // 接口请求
    return request({
      url: '/invalid-url',
      method: 'get'
    })
  },
  treeBuild () {
    if (random(0, 9) === 0) {
      // 父级模拟
      if (this.treeDad.length !== 0) {
        return this.treeDad.pop()
      } else {
        return this.treeChild[random(0, 9)] + [random(100, 999)]
      }
    } else {
      return this.treeChild[random(0, 9)] + [random(100, 999)]
    }
  }

})
