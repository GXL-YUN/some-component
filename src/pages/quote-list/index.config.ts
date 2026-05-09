export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '报价列表'
    })
  : {
      navigationBarTitleText: '报价列表'
    }
