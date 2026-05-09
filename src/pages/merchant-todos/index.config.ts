export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '待办事项'
    })
  : {
      navigationBarTitleText: '待办事项'
    }
