export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我发布的' })
  : { navigationBarTitleText: '我发布的' }
