export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '会员管理' })
  : { navigationBarTitleText: '会员管理' }
