export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '需求详情'
    })
  : {
      navigationBarTitleText: '需求详情'
    }
