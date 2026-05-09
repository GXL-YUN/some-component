export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '宠觅'
    })
  : {
      navigationBarTitleText: '宠觅'
    }
