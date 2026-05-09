export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '宠物详情' })
  : { navigationBarTitleText: '宠物详情' }
