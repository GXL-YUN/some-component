export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '商家中心'
    })
  : {
      navigationBarTitleText: '商家中心'
    }
