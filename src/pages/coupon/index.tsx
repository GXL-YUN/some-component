import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Ticket, Clock, Check, X, Sparkles, PawPrint, Zap } from 'lucide-react-taro'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.css'

interface Coupon {
  id: string
  name: string
  type: 'grooming' | 'pet_purchase' | 'demand_urgent'
  discount: number
  discount_type: 'amount' | 'percent'
  min_amount: number
  valid_from: string
  valid_to: string
  status: 'available' | 'used' | 'expired'
  description: string
}

export default function CouponPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    setLoading(true)
    try {
      // 使用模拟数据
      const mockCoupons: Coupon[] = [
        {
          id: '1',
          name: '洗护专享券',
          type: 'grooming',
          discount: 30,
          discount_type: 'amount',
          min_amount: 100,
          valid_from: '2024-01-01',
          valid_to: '2024-12-31',
          status: 'available',
          description: '洗护服务满100元可用'
        },
        {
          id: '2',
          name: '购宠抵扣券',
          type: 'pet_purchase',
          discount: 200,
          discount_type: 'amount',
          min_amount: 3000,
          valid_from: '2024-01-01',
          valid_to: '2024-12-31',
          status: 'available',
          description: '购买宠物满3000元可用'
        },
        {
          id: '3',
          name: '需求加急券',
          type: 'demand_urgent',
          discount: 1,
          discount_type: 'percent',
          min_amount: 0,
          valid_from: '2024-01-01',
          valid_to: '2024-12-31',
          status: 'available',
          description: '发布需求可加急曝光一次'
        },
        {
          id: '4',
          name: '洗护新人券',
          type: 'grooming',
          discount: 50,
          discount_type: 'amount',
          min_amount: 150,
          valid_from: '2024-01-01',
          valid_to: '2024-06-30',
          status: 'expired',
          description: '新用户洗护专享优惠'
        },
        {
          id: '5',
          name: '购宠折扣券',
          type: 'pet_purchase',
          discount: 5,
          discount_type: 'percent',
          min_amount: 5000,
          valid_from: '2024-01-01',
          valid_to: '2024-12-31',
          status: 'used',
          description: '购买宠物享受5%折扣'
        }
      ]
      setCoupons(mockCoupons)
    } catch (error) {
      console.error('加载优惠券失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCoupons = coupons.filter(coupon => {
    if (activeTab === 'all') return true
    if (activeTab === 'available') return coupon.status === 'available'
    if (activeTab === 'used') return coupon.status === 'used'
    if (activeTab === 'expired') return coupon.status === 'expired'
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grooming':
        return <Sparkles size={24} color="#14b8a6" />
      case 'pet_purchase':
        return <PawPrint size={24} color="#ff6b35" />
      case 'demand_urgent':
        return <Zap size={24} color="#f59e0b" />
      default:
        return <Ticket size={24} color="#6b7280" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case 'grooming':
        return '洗护优惠券'
      case 'pet_purchase':
        return '购宠优惠券'
      case 'demand_urgent':
        return '需求加急券'
      default:
        return '优惠券'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'grooming':
        return 'border-teal-300 text-teal-600'
      case 'pet_purchase':
        return 'border-orange-300 text-orange-600'
      case 'demand_urgent':
        return 'border-amber-300 text-amber-600'
      default:
        return 'border-gray-300 text-gray-600'
    }
  }

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discount_type === 'amount') {
      return `¥${coupon.discount}`
    } else {
      return `${coupon.discount * 10}折`
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <Badge className="bg-green-100 text-green-700">
            <Check size={12} color="#16a34a" className="mr-1" />
            可使用
          </Badge>
        )
      case 'used':
        return (
          <Badge className="bg-gray-100 text-gray-500">
            <Check size={12} color="#6b7280" className="mr-1" />
            已使用
          </Badge>
        )
      case 'expired':
        return (
          <Badge className="bg-red-50 text-red-600">
            <X size={12} color="#dc2626" className="mr-1" />
            已过期
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  const handleUseCoupon = (coupon: Coupon) => {
    if (coupon.status !== 'available') {
      Taro.showToast({ title: '该优惠券暂不可使用', icon: 'none' })
      return
    }

    // 根据优惠券类型跳转到不同页面
    switch (coupon.type) {
      case 'grooming':
        Taro.switchTab({ url: '/pages/grooming/index' })
        break
      case 'pet_purchase':
        Taro.switchTab({ url: '/pages/demand/index' })
        break
      case 'demand_urgent':
        Taro.switchTab({ url: '/pages/demand/index' })
        break
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <Text className="text-lg font-semibold text-gray-800">我的优惠券</Text>
      </View>

      {/* 标签页 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
            <TabsTrigger value="available" className="flex-1">可使用</TabsTrigger>
            <TabsTrigger value="used" className="flex-1">已使用</TabsTrigger>
            <TabsTrigger value="expired" className="flex-1">已过期</TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      {/* 优惠券列表 */}
      <ScrollView className="px-4 py-4" scrollY style={{ height: 'calc(100vh - 180px)' }}>
        {loading ? (
          <View className="flex items-center justify-center py-20">
            <Text className="text-sm text-gray-400">加载中...</Text>
          </View>
        ) : filteredCoupons.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Ticket size={48} color="#d1d5db" />
            <Text className="text-sm text-gray-400 mt-3">暂无优惠券</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {filteredCoupons.map((coupon) => (
              <Card 
                key={coupon.id} 
                className={`bg-white shadow-sm overflow-hidden ${
                  coupon.status !== 'available' ? 'opacity-60' : ''
                }`}
              >
                <CardContent className="p-0">
                  <View className="flex">
                    {/* 左侧金额区域 */}
                    <View
                      className={`w-28 flex flex-col items-center justify-center py-6 ${
                        coupon.type === 'grooming' ? 'bg-gradient-to-br from-teal-50 to-teal-100' :
                        coupon.type === 'pet_purchase' ? 'bg-gradient-to-br from-orange-50 to-orange-100' :
                        'bg-gradient-to-br from-amber-50 to-amber-100'
                      }`}
                    >
                      <Text
                        className={`text-3xl font-bold ${
                          coupon.type === 'grooming' ? 'text-teal-600' :
                          coupon.type === 'pet_purchase' ? 'text-orange-600' :
                          'text-amber-600'
                        }`}
                      >
                        {getDiscountText(coupon)}
                      </Text>
                      {coupon.min_amount > 0 && (
                        <Text className="text-xs text-gray-500 mt-1">
                          满¥{coupon.min_amount}可用
                        </Text>
                      )}
                    </View>

                    {/* 右侧信息区域 */}
                    <View className="flex-1 p-4">
                      <View className="flex items-start justify-between mb-2">
                        <View className="flex items-center gap-2">
                          {getTypeIcon(coupon.type)}
                          <Text className="text-base font-medium text-gray-800">
                            {coupon.name}
                          </Text>
                        </View>
                        {getStatusBadge(coupon.status)}
                      </View>

                      <Badge variant="outline" className={`text-xs mb-2 ${getTypeColor(coupon.type)}`}>
                        {getTypeName(coupon.type)}
                      </Badge>

                      <Text className="text-sm text-gray-500 mb-2">
                        {coupon.description}
                      </Text>

                      <View className="flex items-center justify-between">
                        <View className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} color="#9ca3af" />
                          <Text>
                            {formatDate(coupon.valid_from)} - {formatDate(coupon.valid_to)}
                          </Text>
                        </View>

                        {coupon.status === 'available' && (
                          <Button
                            size="sm"
                            className={`${
                              coupon.type === 'grooming' ? 'bg-teal-500' :
                              coupon.type === 'pet_purchase' ? 'bg-orange-500' :
                              'bg-amber-500'
                            }`}
                            onClick={() => handleUseCoupon(coupon)}
                          >
                            立即使用
                          </Button>
                        )}
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
