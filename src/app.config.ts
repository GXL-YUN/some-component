export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/demand/index',
    'pages/grooming/index',
    'pages/profile/index',
    'pages/demand-detail/index',
    'pages/quote-list/index',
    'pages/quote-gallery/index',
    'pages/quote-detail/index',
    'pages/pet-gallery/index',
    'pages/chat/index',
    'pages/store-list/index',
    'pages/store-detail/index',
    'pages/appointment/index',
    'pages/order-list/index',
    'pages/order-detail/index',
    'pages/pet-list/index',
    'pages/pet-detail/index',
    'pages/pet-record/index',
    'pages/pet-shop-detail/index',
    'pages/coupon/index',
    'pages/address/index',
    'pages/adoption-list/index',
    'pages/adoption-detail/index',
    'pages/adoption-publish/index',
    'pages/my-adoptions/index',
    'pages/merchant-login/index',
    'pages/merchant-home/index',
    'pages/merchant-certification/index',
    'pages/merchant-demands/index',
    'pages/merchant-quote-create/index',
    'pages/merchant-quotes/index',
    'pages/merchant-quote-detail/index',
    'pages/merchant-certificate/index',
    'pages/merchant-orders/index',
    'pages/merchant-order-detail/index',
    'pages/merchant-stats/index',
    'pages/merchant-todos/index',
    'pages/merchant-appointments/index',
    'pages/grooming-store/index',
    'pages/grooming-services/index',
    'pages/grooming-appointments/index',
    'pages/grooming-verify/index',
    'pages/grooming-members/index',
    'pages/grooming-revenue/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '宠觅',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#9ca3af',
    selectedColor: '#ff6b35',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/demand/index',
        text: '报价大厅',
        iconPath: './assets/tabbar/heart.png',
        selectedIconPath: './assets/tabbar/heart-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
