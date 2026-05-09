export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '门店设置' })
  : { navigationBarTitleText: '门店设置' }
