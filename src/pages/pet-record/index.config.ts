export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '添加记录' })
  : { navigationBarTitleText: '添加记录' }
