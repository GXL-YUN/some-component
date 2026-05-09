import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import './index.css'

export default function ProfilePage() {
  const handleNavigateToOrder = () => {
    Taro.navigateTo({ url: '/pages/order-list/index' })
  }

  const handleNavigateToPet = () => {
    Taro.navigateTo({ url: '/pages/pet-list/index' })
  }

  const handleNavigateToAddress = () => {
    Taro.navigateTo({ url: '/pages/address/index' })
  }

  const handleNavigateToCoupon = () => {
    Taro.navigateTo({ url: '/pages/coupon/index' })
  }

  const handleNavigateToMerchantLogin = () => {
    Taro.navigateTo({ url: '/pages/merchant-login/index' })
  }

  const menuItems = [
    {
      icon: '📋',
      title: '我的订单',
      desc: '查看所有订单',
      action: handleNavigateToOrder
    },
    {
      icon: '🐾',
      title: '宠物档案',
      desc: '管理宠物信息',
      action: handleNavigateToPet
    },
    {
      icon: '📍',
      title: '收货地址',
      desc: '管理收货地址',
      action: handleNavigateToAddress
    },
    {
      icon: '🎫',
      title: '优惠券',
      desc: '3张可用',
      action: handleNavigateToCoupon
    },
    {
      icon: '💬',
      title: '在线客服',
      desc: '联系客服',
      action: () => {}
    }
  ]

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 用户信息卡片 */}
      <View className="bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-8">
        <View className="flex items-center gap-4">
          <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Text className="text-3xl">👤</Text>
          </View>
          <View className="flex-1">
            <Text className="block text-xl font-bold text-white mb-1">
              宠觅用户
            </Text>
            <Text className="block text-sm text-orange-100">
              会员ID: 123456
            </Text>
          </View>
          <View className="px-3 py-1 bg-white bg-opacity-20 rounded-full">
            <Text className="text-xs text-white">编辑</Text>
          </View>
        </View>

        {/* 用户数据统计 */}
        <View className="flex items-center justify-around mt-6 pt-6 border-t border-orange-400">
          <View className="text-center">
            <Text className="block text-2xl font-bold text-white">3</Text>
            <Text className="block text-xs text-orange-100 mt-1">订单</Text>
          </View>
          <View className="text-center">
            <Text className="block text-2xl font-bold text-white">2</Text>
            <Text className="block text-xs text-orange-100 mt-1">宠物</Text>
          </View>
          <View className="text-center">
            <Text className="block text-2xl font-bold text-white">3</Text>
            <Text className="block text-xs text-orange-100 mt-1">优惠券</Text>
          </View>
          <View className="text-center">
            <Text className="block text-2xl font-bold text-white">5</Text>
            <Text className="block text-xs text-orange-100 mt-1">收藏</Text>
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="px-4 py-4">
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <View key={index}>
                <View
                  className="flex items-center justify-between p-4"
                  onClick={item.action}
                >
                  <View className="flex items-center gap-3">
                    <View className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Text className="text-xl">{item.icon}</Text>
                    </View>
                    <View>
                      <Text className="block text-base font-medium text-gray-800">
                        {item.title}
                      </Text>
                      <Text className="block text-xs text-gray-500 mt-1">
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-400">{'>'}</Text>
                </View>
                {index < menuItems.length - 1 && (
                  <View className="ml-16">
                    <Separator />
                  </View>
                )}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* 其他功能 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-0">
            <View className="flex items-center justify-between p-4">
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Text className="text-xl">⚙️</Text>
                </View>
                <Text className="block text-base font-medium text-gray-800">
                  设置
                </Text>
              </View>
              <Text className="text-gray-400">{'>'}</Text>
            </View>
            <View className="ml-16">
              <Separator />
            </View>
            <View className="flex items-center justify-between p-4">
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Text className="text-xl">ℹ️</Text>
                </View>
                <Text className="block text-base font-medium text-gray-800">
                  关于我们
                </Text>
              </View>
              <Text className="text-gray-400">{'>'}</Text>
            </View>
          </CardContent>
        </Card>

        {/* 切换为商家入口 */}
        <Card 
          className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
          onClick={handleNavigateToMerchantLogin}
        >
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Text className="text-2xl">🏪</Text>
                </View>
                <View>
                  <View className="flex items-center gap-2">
                    <Text className="block text-lg font-bold text-white">
                      切换为商家
                    </Text>
                    <Badge className="bg-white text-orange-500 text-xs">入驻</Badge>
                  </View>
                  <Text className="block text-sm text-orange-100 mt-1">
                    管理店铺、接单赚钱
                  </Text>
                </View>
              </View>
              <Text className="text-white text-2xl">{'>'}</Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
