export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '领养详情',
      enableShareAppMessage: true,
      enableShareTimeline: true,
    })
  : {
      navigationBarTitleText: '领养详情',
    }
