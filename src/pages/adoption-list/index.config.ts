export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '领养广场',
      enableShareAppMessage: false,
      enableShareTimeline: false,
    })
  : {
      navigationBarTitleText: '领养广场',
    }
