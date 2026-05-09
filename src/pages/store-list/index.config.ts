export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '门店列表'
    })
  : {
      navigationBarTitleText: '门店列表'
    }
