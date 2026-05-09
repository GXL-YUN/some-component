export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '核销管理' })
  : { navigationBarTitleText: '核销管理' }
