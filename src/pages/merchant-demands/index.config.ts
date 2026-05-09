export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '需求广场'
    })
  : {
      navigationBarTitleText: '需求广场'
    }
