export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '营收统计' })
  : { navigationBarTitleText: '营收统计' }
