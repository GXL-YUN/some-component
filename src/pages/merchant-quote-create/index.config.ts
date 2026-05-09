export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '创建报价'
    })
  : {
      navigationBarTitleText: '创建报价'
    }
