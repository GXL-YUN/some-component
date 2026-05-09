import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.css'

interface MerchantInfo {
  phone: string
  type: 'breeder' | 'grooming' | 'both'
  loggedIn: boolean
}

export default function MerchantHomePage() {
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null)

  useEffect(() => {
    loadMerchantInfo()
  }, [])

  const loadMerchantInfo = () => {
    const info = Taro.getStorageSync('merchantInfo')
    if (!info || !info.loggedIn) {
      Taro.redirectTo({ url: '/pages/merchant-login/index' })
      return
    }
    setMerchantInfo(info)
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出商家账号吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('merchantInfo')
          Taro.redirectTo({ url: '/pages/merchant-login/index' })
        }
      }
    })
  }

  const handleSwitchToUser = () => {
    Taro.switchTab({ url: '/pages/home/index' })
  }

  // 繁育商家功能
  const breederFeatures = [
    {
      icon: '📋',
      title: '需求大厅',
      desc: '查看买家需求',
      count: 12,
      url: '/pages/merchant-demands/index'
    },
    {
      icon: '💰',
      title: '我的报价',
      desc: '管理报价记录',
      count: 5,
      url: '/pages/merchant-quotes/index'
    },
    {
      icon: '📦',
      title: '订单管理',
      desc: '处理买家订单',
      count: 3,
      url: '/pages/merchant-orders/index'
    },
    {
      icon: '📊',
      title: '数据统计',
      desc: '查看经营数据',
      url: '/pages/merchant-stats/index'
    }
  ]

  // 洗护商家功能
  const groomingFeatures = [
    {
      icon: '📅',
      title: '预约管理',
      desc: '处理洗护预约',
      count: 8,
      url: '/pages/grooming-appointments/index'
    },
    {
      icon: '🏪',
      title: '门店设置',
      desc: '编辑门店信息',
      url: '/pages/grooming-store/index'
    },
    {
      icon: '💇',
      title: '服务管理',
      desc: '设置服务项目',
      url: '/pages/grooming-services/index'
    },
    {
      icon: '✅',
      title: '核销管理',
      desc: '扫码核销服务',
      url: '/pages/grooming-verify/index'
    },
    {
      icon: '👥',
      title: '会员管理',
      desc: '查看会员信息',
      url: '/pages/grooming-members/index'
    },
    {
      icon: '📈',
      title: '营收统计',
      desc: '查看经营数据',
      url: '/pages/grooming-revenue/index'
    }
  ]

  // 根据商家类型获取功能列表
  const getFeatures = () => {
    if (merchantInfo?.type === 'breeder') return breederFeatures
    if (merchantInfo?.type === 'grooming') return groomingFeatures
    // 综合商家 - 显示全部功能
    return [...breederFeatures, ...groomingFeatures]
  }

  const getTypeName = () => {
    switch (merchantInfo?.type) {
      case 'breeder': return '繁育商家'
      case 'grooming': return '洗护商家'
      case 'both': return '综合商家'
      default: return '商家'
    }
  }

  const getTypeIcon = () => {
    switch (merchantInfo?.type) {
      case 'breeder': return '🐾'
      case 'grooming': return '✨'
      case 'both': return '🏪'
      default: return '🏪'
    }
  }

  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url })
  }

  if (!merchantInfo) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      {/* 商家信息头部 */}
      <View className="bg-gradient-to-br from-orange-500 to-orange-600 px-4 py-8">
        <View className="flex items-center justify-between mb-4">
          <View className="flex items-center gap-4">
            <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Text className="text-3xl">{getTypeIcon()}</Text>
            </View>
            <View>
              <View className="flex items-center gap-2 mb-1">
                <Text className="text-xl font-bold text-white">
                  {getTypeName()}
                </Text>
                <Badge className="bg-white text-orange-500 text-xs">已认证</Badge>
              </View>
              <Text className="block text-sm text-orange-100">
                {merchantInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
              </Text>
            </View>
          </View>
        </View>

        {/* 今日数据 */}
        <View className="flex items-center justify-around mt-4 pt-4 border-t border-orange-400">
          <View className="text-center">
            <Text className="block text-2xl font-bold text-white">3</Text>
            <Text className="block text-xs text-orange-100 mt-1">待处理</Text>
          </View>
          <View className="text-center">
            <Text className="block text-2xl font-bold text-white">¥1,280</Text>
            <Text className="block text-xs text-orange-100 mt-1">今日收入</Text>
          </View>
          <View className="text-center">
            <Text className="block text-2xl font-bold text-white">4.9</Text>
            <Text className="block text-xs text-orange-100 mt-1">店铺评分</Text>
          </View>
        </View>
      </View>

      {/* 快捷入口 */}
      <View className="px-4 py-4">
        <View className="flex items-center justify-between mb-3">
          <Text className="block text-base font-semibold text-gray-800">
            快捷功能
          </Text>
        </View>

        <View className="grid grid-cols-4 gap-3">
          {getFeatures().map((feature, index) => (
            <View 
              key={index}
              className="flex flex-col items-center"
              onClick={() => handleNavigate(feature.url)}
            >
              <View className="relative w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-2">
                <Text className="text-2xl">{feature.icon}</Text>
                {feature.count && feature.count > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    <Text className="text-white text-xs">{feature.count}</Text>
                  </View>
                )}
              </View>
              <Text className="block text-xs text-gray-700">{feature.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 待办事项 */}
      <View className="px-4 py-2">
        <View className="flex items-center justify-between mb-3">
          <Text className="block text-base font-semibold text-gray-800">
            待办事项
          </Text>
          <View onClick={() => Taro.navigateTo({ url: '/pages/merchant-todos/index' })}>
            <Text className="block text-sm text-orange-500">查看全部 {'>'}</Text>
          </View>
        </View>

        {/* 洗护商家只显示今日预约 */}
        {merchantInfo.type === 'grooming' && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <View 
                className="flex items-center gap-3"
                onClick={() => Taro.navigateTo({ url: '/pages/grooming-appointments/index' })}
              >
                <View className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Text className="text-xl">📅</Text>
                </View>
                <View className="flex-1">
                  <Text className="block text-sm font-medium text-gray-800">
                    今日预约
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-1">
                    今天有 8 个预约待处理
                  </Text>
                </View>
                <Badge className="bg-teal-500 text-white">8</Badge>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 繁育商家显示需求和订单 */}
        {merchantInfo.type === 'breeder' && (
          <>
            <Card className="bg-white shadow-sm mb-3">
              <CardContent className="p-4">
                <View 
                  className="flex items-center gap-3"
                  onClick={() => Taro.navigateTo({ url: '/pages/merchant-demands/index' })}
                >
                  <View className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <Text className="text-xl">🔔</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm font-medium text-gray-800">
                      新需求提醒
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      有 3 个新需求等待您报价
                    </Text>
                  </View>
                  <Badge className="bg-red-500 text-white">3</Badge>
                </View>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <View 
                  className="flex items-center gap-3"
                  onClick={() => Taro.navigateTo({ url: '/pages/merchant-orders/index' })}
                >
                  <View className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Text className="text-xl">📦</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm font-medium text-gray-800">
                      订单待确认
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      有 2 个订单等待确认
                    </Text>
                  </View>
                  <Badge className="bg-orange-500 text-white">2</Badge>
                </View>
              </CardContent>
            </Card>
          </>
        )}

        {/* 综合商家显示全部 */}
        {merchantInfo.type === 'both' && (
          <>
            <Card className="bg-white shadow-sm mb-3">
              <CardContent className="p-4">
                <View 
                  className="flex items-center gap-3"
                  onClick={() => Taro.navigateTo({ url: '/pages/merchant-demands/index' })}
                >
                  <View className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <Text className="text-xl">🔔</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm font-medium text-gray-800">
                      新需求提醒
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      有 3 个新需求等待您报价
                    </Text>
                  </View>
                  <Badge className="bg-red-500 text-white">3</Badge>
                </View>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm mb-3">
              <CardContent className="p-4">
                <View 
                  className="flex items-center gap-3"
                  onClick={() => Taro.navigateTo({ url: '/pages/merchant-orders/index' })}
                >
                  <View className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Text className="text-xl">📦</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm font-medium text-gray-800">
                      订单待确认
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      有 2 个订单等待确认
                    </Text>
                  </View>
                  <Badge className="bg-orange-500 text-white">2</Badge>
                </View>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <View 
                  className="flex items-center gap-3"
                  onClick={() => Taro.navigateTo({ url: '/pages/grooming-appointments/index' })}
                >
                  <View className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Text className="text-xl">📅</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm font-medium text-gray-800">
                      今日预约
                    </Text>
                    <Text className="block text-xs text-gray-500 mt-1">
                      今天有 5 个预约待处理
                    </Text>
                  </View>
                  <Badge className="bg-teal-500 text-white">5</Badge>
                </View>
              </CardContent>
            </Card>
          </>
        )}
      </View>

      {/* 底部操作 */}
      <View className="px-4 py-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            <View 
              className="flex items-center justify-between p-4"
              onClick={handleSwitchToUser}
            >
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Text className="text-xl">👤</Text>
                </View>
                <Text className="block text-base font-medium text-gray-800">
                  切换为用户
                </Text>
              </View>
              <Text className="text-gray-400">{'>'}</Text>
            </View>
            <View className="ml-16">
              <View className="h-px bg-gray-100" />
            </View>
            <View 
              className="flex items-center justify-between p-4"
              onClick={handleLogout}
            >
              <View className="flex items-center gap-3">
                <View className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Text className="text-xl">🚪</Text>
                </View>
                <Text className="block text-base font-medium text-gray-800">
                  退出登录
                </Text>
              </View>
              <Text className="text-gray-400">{'>'}</Text>
            </View>
          </CardContent>
        </Card>
      </View>

      <View className="h-8" />
    </ScrollView>
  )
}
