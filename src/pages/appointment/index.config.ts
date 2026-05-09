export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '预约'
    })
  : {
      navigationBarTitleText: '预约'
    }
