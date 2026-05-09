import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PawPrint, Sparkles } from 'lucide-react-taro'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface Pet {
  name: string           // 宠物昵称
  breed: string          // 品种
  photo_url?: string     // 宠物图片
  age?: string           // 年龄
  gender?: 'male' | 'female'  // 性别
  color?: string         // 颜色
  weight?: string        // 体重
}

interface Order {
  id: string
  order_type: 'pet' | 'grooming'
  status: string
  total_amount: string
  deposit_amount?: string
  paid_amount?: string
  created_at: string
  quote?: {
    merchant_name: string
    price: string
    photos?: string[]
  }
  pet?: Pet
  appointment?: {
    service_name: string
    store_name: string
  }
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待付款', color: 'bg-amber-100 text-amber-700' },
  paid: { label: '已付款', color: 'bg-blue-100 text-blue-700' },
  delivering: { label: '配送中', color: 'bg-teal-100 text-teal-700' },
  in_service: { label: '服务中', color: 'bg-teal-100 text-teal-700' },
  completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-500' }
}

export default function OrderListPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [orderType, setOrderType] = useState<'pet' | 'grooming'>('pet')
  const [activeTab, setActiveTab] = useState('all')
  const testUserId = 'test-user-001'

  // 每次页面显示时刷新订单列表
  useDidShow(() => {
    // 从路由参数获取订单类型
    const typeFromParam = router.params.type as 'pet' | 'grooming'
    if (typeFromParam && (typeFromParam === 'pet' || typeFromParam === 'grooming')) {
      setOrderType(typeFromParam)
      // 延迟加载，确保状态已更新
      setTimeout(() => loadOrders(typeFromParam), 100)
    } else {
      loadOrders(orderType)
    }
  })

  const loadOrders = async (type?: 'pet' | 'grooming') => {
    const currentType = type || orderType
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/orders',
        method: 'GET',
        data: {
          user_id: testUserId,
          order_type: currentType,
          status: activeTab === 'all' ? undefined : activeTab
        }
      })

      console.log('订单列表响应:', res)

      // 检查响应数据是否有效
      const orderData = res.data?.data || res.data
      if (Array.isArray(orderData) && orderData.length > 0) {
        setOrders(orderData)
      } else {
        // 没有数据时使用模拟数据
        throw new Error('暂无订单数据')
      }
    } catch (error) {
      console.error('加载订单列表失败:', error)
      // 使用模拟数据
      if (currentType === 'grooming') {
        setOrders([
          {
            id: 'grooming-001',
            order_type: 'grooming',
            status: 'pending',
            total_amount: '168',
            created_at: new Date().toISOString(),
            appointment: {
              service_name: '精洗套餐',
              store_name: '萌宠洗护中心'
            }
          },
          {
            id: 'grooming-002',
            order_type: 'grooming',
            status: 'in_service',
            total_amount: '128',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            appointment: {
              service_name: '基础洗护',
              store_name: '宠爱之家'
            }
          },
          {
            id: 'grooming-003',
            order_type: 'grooming',
            status: 'completed',
            total_amount: '88',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            appointment: {
              service_name: '快速洗澡',
              store_name: '萌宠洗护中心'
            }
          },
          {
            id: 'grooming-004',
            order_type: 'grooming',
            status: 'cancelled',
            total_amount: '198',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            appointment: {
              service_name: '美容套餐',
              store_name: '宠爱之家'
            }
          }
        ])
      } else {
        setOrders([
          {
            id: 'pet-001',
            order_type: 'pet',
            status: 'pending',
            total_amount: '3500',
            deposit_amount: '500',
            paid_amount: '0',
            created_at: new Date().toISOString(),
            quote: {
              merchant_name: '萌宠家园',
              price: '3500',
              photos: []
            },
            pet: {
              name: '小橘',
              breed: '英国短毛猫',
              age: '3个月',
              gender: 'male',
              color: '橘色'
            }
          },
          {
            id: 'pet-002',
            order_type: 'pet',
            status: 'paid',
            total_amount: '4500',
            deposit_amount: '500',
            paid_amount: '4500',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            quote: {
              merchant_name: '爱宠之家',
              price: '4500',
              photos: []
            },
            pet: {
              name: '雪球',
              breed: '萨摩耶',
              age: '2个月',
              gender: 'female',
              color: '白色',
              weight: '5kg'
            }
          },
          {
            id: 'pet-006',
            order_type: 'pet',
            status: 'paid',
            total_amount: '5200',
            deposit_amount: '500',
            paid_amount: '5200',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            quote: {
              merchant_name: '星辰宠物',
              price: '5200',
              photos: []
            },
            pet: {
              name: '布丁',
              breed: '柴犬',
              age: '3个月',
              gender: 'male',
              color: '赤色'
            }
          },
          {
            id: 'pet-003',
            order_type: 'pet',
            status: 'delivering',
            total_amount: '6500',
            deposit_amount: '500',
            paid_amount: '6500',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            quote: {
              merchant_name: '宠悦繁育基地',
              price: '6500',
              photos: []
            },
            pet: {
              name: '豆豆',
              breed: '柯基犬',
              age: '4个月',
              gender: 'male',
              color: '黄白色',
              weight: '6kg'
            }
          },
          {
            id: 'pet-004',
            order_type: 'pet',
            status: 'completed',
            total_amount: '2800',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            quote: {
              merchant_name: '萌宠乐园',
              price: '2800',
              photos: []
            },
            pet: {
              name: '花花',
              breed: '布偶猫',
              age: '5个月',
              gender: 'female',
              color: '海豹色'
            }
          },
          {
            id: 'pet-005',
            order_type: 'pet',
            status: 'cancelled',
            total_amount: '8000',
            created_at: new Date(Date.now() - 259200000).toISOString(),
            quote: {
              merchant_name: '名宠会所',
              price: '8000',
              photos: []
            },
            pet: {
              name: '旺财',
              breed: '金毛犬',
              age: '3个月',
              gender: 'male',
              color: '金色'
            }
          }
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOrderTypeChange = (value: string) => {
    const newType = value as 'pet' | 'grooming'
    setOrderType(newType)
    setActiveTab('all')
    // 立即加载新类型的订单
    loadOrders(newType)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // 状态切换时重新加载订单
    loadOrders()
  }

  const handleOrderClick = (orderId: string) => {
    Taro.navigateTo({ url: `/pages/order-detail/index?orderId=${orderId}` })
  }

  const handlePay = () => {
    Taro.showToast({ title: '支付功能开发中', icon: 'none' })
  }

  const handleConfirm = async (orderId: string) => {
    const result = await Taro.showModal({
      title: '确认收货',
      content: orderType === 'pet' ? '确认已收到宠物吗？' : '确认服务已完成吗？'
    })

    if (result.confirm) {
      try {
        await Network.request({
          url: `/api/orders/${orderId}/confirm`,
          method: 'POST'
        })
        Taro.showToast({ title: orderType === 'pet' ? '已确认收货' : '已确认完成', icon: 'success' })
        loadOrders()
      } catch (error) {
        console.error('确认失败:', error)
        Taro.showToast({ title: '操作失败', icon: 'error' })
      }
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const formatPrice = (price: string | number) => {
    return `¥${Number(price).toLocaleString()}`
  }

  // 根据 activeTab 过滤订单
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 订单类型切换 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Tabs value={orderType} onValueChange={handleOrderTypeChange}>
          <TabsList className="w-full">
            <TabsTrigger value="pet" className="flex-1">
              <PawPrint size={16} color={orderType === 'pet' ? '#ff6b35' : '#6b7280'} className="mr-1" />
              购宠订单
            </TabsTrigger>
            <TabsTrigger value="grooming" className="flex-1">
              <Sparkles size={16} color={orderType === 'grooming' ? '#14b8a6' : '#6b7280'} className="mr-1" />
              洗护订单
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      {/* 状态筛选 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-10">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">待付款</TabsTrigger>
            {orderType === 'pet' ? (
              <>
                <TabsTrigger value="paid" className="flex-1">已付款</TabsTrigger>
                <TabsTrigger value="delivering" className="flex-1">配送中</TabsTrigger>
              </>
            ) : (
              <TabsTrigger value="in_service" className="flex-1">服务中</TabsTrigger>
            )}
            <TabsTrigger value="completed" className="flex-1">已完成</TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      {/* 订单列表 */}
      <ScrollView className="px-4 py-4" scrollY style={{ height: 'calc(100vh - 120px)' }}>
        {loading ? (
          <View className="flex items-center justify-center py-20">
            <Text className="text-sm text-gray-400">加载中...</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="text-4xl mb-4">📦</Text>
            <Text className="text-sm text-gray-400 mb-4">暂无订单</Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => Taro.switchTab({ url: '/pages/home/index' })}
            >
              去逛逛
            </Button>
          </View>
        ) : (
          <View className="space-y-3">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-white shadow-sm overflow-hidden"
                onClick={() => handleOrderClick(order.id)}
              >
                <CardContent className="p-0">
                  {/* 订单头部 */}
                  <View className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <View className="flex items-center gap-2">
                      <Text className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        订单号: {order.id.slice(0, 8)}
                      </Text>
                    </View>
                    <Badge
                      className={`${statusMap[order.status]?.color || 'bg-gray-100 text-gray-500'} text-xs`}
                    >
                      {statusMap[order.status]?.label || order.status}
                    </Badge>
                  </View>

                  {/* 订单内容 */}
                  <View className="px-4 py-3">
                    <View className="flex gap-3">
                      <View
                        className={`w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                          order.order_type === 'pet' ? 'bg-orange-50' : 'bg-teal-50'
                        }`}
                      >
                        {order.order_type === 'pet' ? (
                          order.pet?.photo_url ? (
                            <Image src={order.pet.photo_url} className="w-full h-full object-cover" mode="aspectFill" />
                          ) : (
                            <View className="flex flex-col items-center">
                              <PawPrint size={28} color="#ff6b35" />
                              <Text className="text-xs text-orange-400 mt-1">{order.pet?.breed?.slice(0, 4) || '宠物'}</Text>
                            </View>
                          )
                        ) : (
                          <Sparkles size={32} color="#14b8a6" />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="block text-base font-medium text-gray-800 mb-1">
                          {order.order_type === 'pet' 
                            ? (order.pet?.breed || '宠物购买')
                            : (order.appointment?.store_name || '洗护门店')}
                        </Text>
                        <Text className="block text-sm text-gray-500 mb-2">
                          {order.order_type === 'pet' 
                            ? (order.pet?.name ? `${order.pet.name} · ${order.pet.age || ''}` : '宠物购买订单')
                            : (order.appointment?.service_name || '洗护服务')}
                        </Text>
                        <View className="flex items-baseline gap-2">
                          <Text
                            className={`block text-lg font-bold ${
                              order.order_type === 'pet' ? 'text-orange-500' : 'text-teal-600'
                            }`}
                          >
                            {formatPrice(order.total_amount)}
                          </Text>
                          {order.order_type === 'pet' && order.pet?.gender && (
                            <Text className="text-xs text-gray-400">
                              {order.pet.gender === 'male' ? '♂' : '♀'}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* 操作按钮 */}
                  <View className="flex justify-end gap-2 px-4 py-3 border-t border-gray-100">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        className={order.order_type === 'pet' ? 'bg-orange-500' : 'bg-teal-500'}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePay()
                        }}
                      >
                        去支付
                      </Button>
                    )}
                    {order.status === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          Taro.showToast({ title: '商家正在准备发货', icon: 'none' })
                        }}
                      >
                        催发货
                      </Button>
                    )}
                    {(order.status === 'delivering' || order.status === 'in_service') && (
                      <Button
                        size="sm"
                        className={order.order_type === 'pet' ? 'bg-orange-500' : 'bg-teal-500'}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleConfirm(order.id)
                        }}
                      >
                        {order.order_type === 'pet' ? '确认收货' : '确认完成'}
                      </Button>
                    )}
                    {(order.status === 'completed' || order.status === 'cancelled') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          Taro.showToast({ title: '再次购买功能开发中', icon: 'none' })
                        }}
                      >
                        再次购买
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOrderClick(order.id)
                      }}
                    >
                      查看详情
                    </Button>
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
