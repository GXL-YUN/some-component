import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration?: number
  is_available: boolean
}

interface StoreDetail {
  id: string
  name: string
  logo_url?: string
  photos?: string[]
  rating: number
  reviews_count: number
  distance: number
  opening_hours: string
  is_open: boolean
  address: string
  phone?: string
  description?: string
  services?: Service[]
}

export default function StoreDetailPage() {
  const router = useRouter()
  const storeId = router.params.storeId
  
  const [store, setStore] = useState<StoreDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (storeId) {
      loadStoreDetail()
    }
  }, [storeId])

  const loadStoreDetail = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/stores/${storeId}`,
        method: 'GET'
      })

      if (res.data) {
        setStore(res.data)
      }
    } catch (error) {
      console.error('加载门店详情失败:', error)
      // 使用模拟数据
      setStore({
        id: storeId || '1',
        name: '萌宠洗护中心',
        rating: 4.9,
        reviews_count: 256,
        distance: 1.2,
        opening_hours: '09:00-21:00',
        is_open: true,
        address: '朝阳区建国路88号',
        phone: '010-12345678',
        description: '专业宠物洗护服务，拥有多年经验的美容师团队，为您的爱宠提供最优质的服务。',
        services: [
          {
            id: 's1',
            name: '基础洗护套餐',
            description: '洗澡、吹干、梳理',
            price: 68,
            duration: 60,
            is_available: true
          },
          {
            id: 's2',
            name: '精洗套餐',
            description: '洗澡、吹干、梳理、修剪指甲、清洁耳道',
            price: 98,
            duration: 90,
            is_available: true
          },
          {
            id: 's3',
            name: '造型修剪',
            description: '洗澡、吹干、专业造型修剪',
            price: 168,
            duration: 120,
            is_available: true
          },
          {
            id: 's4',
            name: 'SPA护理',
            description: '药浴、按摩、美容全套服务',
            price: 268,
            duration: 180,
            is_available: true
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = (serviceId: string) => {
    Taro.navigateTo({ 
      url: `/pages/appointment/index?storeId=${storeId}&serviceId=${serviceId}` 
    })
  }

  const handleCall = () => {
    if (store?.phone) {
      Taro.makePhoneCall({ phoneNumber: store.phone })
    }
  }

  if (loading || !store) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-sm text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="pb-24">
        {/* 门店封面 */}
        <View className="w-full h-48 bg-gradient-to-br from-orange-100 to-teal-100 flex items-center justify-center">
          <Text className="text-6xl">🏠</Text>
        </View>

        {/* 门店基本信息 */}
        <Card className="bg-white shadow-sm -mt-4 mx-4 relative z-10">
          <CardContent className="p-4">
            <Text className="block text-xl font-bold text-gray-800 mb-2">
              {store.name}
            </Text>
            
            <View className="flex items-center gap-3 mb-3">
              <View className="flex items-center gap-1">
                <Text className="text-sm text-orange-500">⭐</Text>
                <Text className="text-sm font-medium text-gray-700">
                  {store.rating}
                </Text>
                <Text className="text-xs text-gray-400">
                  ({store.reviews_count}条评价)
                </Text>
              </View>
              <Badge variant={store.is_open ? 'default' : 'secondary'} className="text-xs">
                {store.is_open ? '营业中' : '已打烊'}
              </Badge>
            </View>
            
            <View className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Text>📍 {store.address}</Text>
            </View>
            
            <View className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Text>🕐 {store.opening_hours}</Text>
            </View>
            
            <View className="flex items-center gap-2 text-sm text-gray-500">
              <Text>📞 {store.phone || '暂无电话'}</Text>
            </View>
          </CardContent>
        </Card>

        {/* 门店介绍 */}
        {store.description && (
          <Card className="bg-white shadow-sm mt-4 mx-4">
            <CardContent className="p-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">
                门店介绍
              </Text>
              <Text className="block text-sm text-gray-600">
                {store.description}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* 服务项目 */}
        <View className="mt-4 mx-4">
          <Text className="block text-base font-semibold text-gray-800 mb-3">
            服务项目
          </Text>
          
          {store.services?.map((service) => (
            <Card key={service.id} className="bg-white shadow-sm mb-3">
              <CardContent className="p-4">
                <View className="flex items-start justify-between">
                  <View className="flex-1">
                    <View className="flex items-center gap-2 mb-2">
                      <Text className="block text-base font-medium text-gray-800">
                        {service.name}
                      </Text>
                      {service.duration && (
                        <Badge variant="outline" className="text-xs">
                          {service.duration}分钟
                        </Badge>
                      )}
                    </View>
                    
                    {service.description && (
                      <Text className="block text-sm text-gray-500 mb-2">
                        {service.description}
                      </Text>
                    )}
                    
                    <Text className="block text-lg font-bold text-orange-500">
                      ¥{service.price}
                    </Text>
                  </View>
                  
                  <Button
                    size="sm"
                    disabled={!service.is_available || !store.is_open}
                    onClick={() => handleBookNow(service.id)}
                    className="bg-orange-500 hover:bg-orange-600 ml-3"
                  >
                    {service.is_available && store.is_open ? '预约' : '暂不可约'}
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* 用户评价 */}
        <Card className="bg-white shadow-sm mt-4 mx-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-3">
              <Text className="block text-sm font-medium text-gray-700">
                用户评价
              </Text>
              <Text className="text-sm text-orange-500">查看全部</Text>
            </View>
            
            <View className="space-y-3">
              <View className="pb-3 border-b border-gray-100">
                <View className="flex items-center gap-2 mb-2">
                  <View className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Text className="text-sm">👤</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-700">用户***</Text>
                  <View className="flex items-center gap-1 ml-auto">
                    <Text className="text-xs text-orange-500">⭐⭐⭐⭐⭐</Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-600">
                  服务很好，美容师很专业，狗狗洗完很漂亮！
                </Text>
              </View>
              
              <View>
                <View className="flex items-center gap-2 mb-2">
                  <View className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Text className="text-sm">👤</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-700">爱宠达人</Text>
                  <View className="flex items-center gap-1 ml-auto">
                    <Text className="text-xs text-orange-500">⭐⭐⭐⭐⭐</Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-600">
                  环境干净整洁，价格合理，下次还会来！
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 底部操作栏 */}
      <View 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e7eb',
          zIndex: 50
        }}
      >
        <View style={{ flex: 1 }}>
          <Button variant="outline" className="w-full" onClick={handleCall}>
            致电门店
          </Button>
        </View>
        <View style={{ flex: 2 }}>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={() => handleBookNow(store.services?.[0]?.id || '')}
          >
            <Text className="text-white font-medium">立即预约</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}
