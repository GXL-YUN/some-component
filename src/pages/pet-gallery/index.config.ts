export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '宠物广场'
    })
  : {
      navigationBarTitleText: '宠物广场'
    }
