export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '宠物档案'
    })
  : { navigationBarTitleText: '宠物档案' }
