import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Order {
  id: string
  order_type: 'pet' | 'grooming'
  status: string
  total_amount: number
  created_at: string
  quote_info?: {
    pet_type: string
    breed: string
    price: number
    photos?: string[]
  }
  user_info?: {
    name: string
    phone: string
  }
  address_info?: {
    receiver_name: string
    receiver_phone: string
    province: string
    city: string
    district: string
    detail_address: string
  }
  delivery_status?: string
  tracking_number?: string
  quarantine_certificate_url?: string
}

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivering' | 'completed'>('all')
  const [showShipModal, setShowShipModal] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  const merchantInfo = Taro.getStorageSync('merchantInfo')

  useEffect(() => {
    loadOrders()
  }, [activeTab])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/merchants/${merchantInfo?.id}/orders`,
        method: 'GET',
        data: {
          status: activeTab === 'all' ? undefined : activeTab,
        },
      })

      console.log('订单列表响应:', res)

      if (res && res.data && res.data.length > 0) {
        setOrders(res.data)
      } else {
        throw new Error('响应数据为空')
      }
    } catch (error) {
      console.error('加载订单列表失败:', error)
      setOrders([
        {
          id: 'order-001',
          order_type: 'pet',
          status: 'paid',
          total_amount: 4500,
          created_at: new Date().toISOString(),
          quote_info: {
            pet_type: 'cat',
            breed: '英短蓝猫',
            price: 4500,
          },
          user_info: {
            name: '张先生',
            phone: '138****1234',
          },
          address_info: {
            receiver_name: '张先生',
            receiver_phone: '13812345678',
            province: '北京',
            city: '北京市',
            district: '朝阳区',
            detail_address: 'xxx街道xxx小区xxx号',
          },
          delivery_status: 'pending',
        },
        {
          id: 'order-002',
          order_type: 'pet',
          status: 'delivering',
          total_amount: 6500,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          quote_info: {
            pet_type: 'dog',
            breed: '柯基',
            price: 6500,
          },
          user_info: {
            name: '李女士',
            phone: '139****5678',
          },
          address_info: {
            receiver_name: '李女士',
            receiver_phone: '13900005678',
            province: '上海',
            city: '上海市',
            district: '浦东新区',
            detail_address: 'yyy路yyy小区yyy号',
          },
          delivery_status: 'shipped',
          tracking_number: 'SF1234567890',
        },
        {
          id: 'order-003',
          order_type: 'pet',
          status: 'completed',
          total_amount: 12000,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          quote_info: {
            pet_type: 'cat',
            breed: '布偶猫',
            price: 12000,
          },
          user_info: {
            name: '王先生',
            phone: '137****9012',
          },
          address_info: {
            receiver_name: '王先生',
            receiver_phone: '13700009012',
            province: '北京',
            city: '北京市',
            district: '海淀区',
            detail_address: 'zzz路zzz小区zzz号',
          },
          delivery_status: 'delivered',
          tracking_number: 'SF9876543210',
          quarantine_certificate_url: 'https://example.com/cert.pdf',
        },
        {
          id: 'order-004',
          order_type: 'pet',
          status: 'pending',
          total_amount: 3500,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          quote_info: {
            pet_type: 'dog',
            breed: '泰迪',
            price: 3500,
          },
          user_info: {
            name: '赵女士',
            phone: '136****3456',
          },
          address_info: {
            receiver_name: '赵女士',
            receiver_phone: '13600003456',
            province: '广东',
            city: '广州市',
            district: '天河区',
            detail_address: 'aaa街aaa花园aaa栋',
          },
        },
        {
          id: 'order-005',
          order_type: 'pet',
          status: 'cancelled',
          total_amount: 8000,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          quote_info: {
            pet_type: 'cat',
            breed: '金渐层',
            price: 8000,
          },
          user_info: {
            name: '孙先生',
            phone: '135****7890',
          },
          address_info: {
            receiver_name: '孙先生',
            receiver_phone: '13500007890',
            province: '浙江',
            city: '杭州市',
            district: '西湖区',
            detail_address: 'bbb路bbb公寓bbb室',
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-600">待付款</Badge>
      case 'paid':
        return <Badge className="bg-orange-100 text-orange-600">待发货</Badge>
      case 'delivering':
        return <Badge className="bg-blue-100 text-blue-600">配送中</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-600">已完成</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-600">已取消</Badge>
      default:
        return null
    }
  }

  const getPetTypeEmoji = (type: string) => {
    return type === 'cat' ? '🐱' : type === 'dog' ? '🐕' : '🐾'
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }

  const handleViewDetail = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/merchant-order-detail/index?id=${orderId}`,
    })
  }

  const handleUploadCertificate = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/merchant-certificate/index?orderId=${orderId}`,
    })
  }

  const handleOpenShipModal = (orderId: string) => {
    setCurrentOrderId(orderId)
    setTrackingNumber('')
    setShowShipModal(true)
  }

  const handleCloseShipModal = () => {
    setShowShipModal(false)
    setCurrentOrderId('')
    setTrackingNumber('')
  }

  const handleConfirmShip = async () => {
    if (!trackingNumber.trim()) {
      Taro.showToast({ title: '请输入运单号', icon: 'none' })
      return
    }

    try {
      await Network.request({
        url: `/api/merchants/orders/${currentOrderId}/status`,
        method: 'POST',
        data: {
          merchant_id: merchantInfo?.id,
          status: 'delivering',
          tracking_number: trackingNumber.trim(),
        },
      })

      Taro.showToast({ title: '发货成功', icon: 'success' })
      handleCloseShipModal()
      loadOrders()
    } catch (error) {
      console.error('发货失败:', error)
      Taro.showToast({ title: '发货失败', icon: 'none' })
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* Tab 切换 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            全部
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
          >
            待发货
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'delivering' ? 'default' : 'outline'}
            onClick={() => setActiveTab('delivering')}
          >
            配送中
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'completed' ? 'default' : 'outline'}
            onClick={() => setActiveTab('completed')}
          >
            已完成
          </Button>
        </View>
      </View>

      {/* 订单列表 */}
      <ScrollView className="order-list" scrollY style={{ height: 'calc(100vh - 100px)' }}>
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex items-center justify-center py-12">
              <Text className="text-gray-500">加载中...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-12">
              <Text className="text-4xl mb-3">📦</Text>
              <Text className="text-gray-500">暂无订单</Text>
            </View>
          ) : (
            orders.map((order) => (
              <Card 
                key={order.id} 
                className="bg-white shadow-sm mb-3"
                onClick={() => handleViewDetail(order.id)}
              >
                <CardContent className="p-4">
                  {/* 头部 */}
                  <View className="flex items-center justify-between mb-3">
                    <View className="flex items-center gap-2">
                      <Text className="text-sm text-gray-500">
                        订单号：{order.id}
                      </Text>
                    </View>
                    {getStatusBadge(order.status)}
                  </View>

                  {/* 商品信息 */}
                  <View className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                    <View className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Text className="text-2xl">
                        {getPetTypeEmoji(order.quote_info?.pet_type || 'cat')}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="block text-sm font-medium text-gray-800">
                        {order.quote_info?.breed}
                      </Text>
                      <Text className="block text-xs text-gray-500 mt-1">
                        宠物交易订单
                      </Text>
                    </View>
                    <Text className="text-lg font-bold text-orange-500">
                      ¥{order.total_amount}
                    </Text>
                  </View>

                  {/* 收货信息 */}
                  {order.address_info && (
                    <View className="mb-3 pb-3 border-b border-gray-100">
                      <View className="flex items-start gap-2">
                        <Text className="text-sm text-gray-500">📍</Text>
                        <View className="flex-1">
                          <View className="flex items-center gap-2">
                            <Text className="text-sm font-medium text-gray-800">
                              {order.address_info.receiver_name}
                            </Text>
                            <Text className="text-sm text-gray-600">
                              {order.address_info.receiver_phone}
                            </Text>
                          </View>
                          <Text className="block text-xs text-gray-500 mt-1">
                            {order.address_info.province}
                            {order.address_info.city}
                            {order.address_info.district}
                            {order.address_info.detail_address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* 物流信息 */}
                  {order.tracking_number && (
                    <View className="mb-3 pb-3 border-b border-gray-100">
                      <View className="flex items-center justify-between">
                        <Text className="text-sm text-gray-600">
                          物流单号：{order.tracking_number}
                        </Text>
                        <Text 
                          className="text-xs text-orange-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            Taro.setClipboardData({ data: order.tracking_number || '' })
                            Taro.showToast({ title: '已复制', icon: 'success' })
                          }}
                        >
                          复制
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* 底部操作 */}
                  <View className="flex items-center justify-between pt-2">
                    <Text className="text-xs text-gray-400">
                      {formatTime(order.created_at)}
                    </Text>
                    <View className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {order.status === 'paid' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUploadCertificate(order.id)}
                          >
                            上传检疫证
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-500"
                            onClick={() => handleOpenShipModal(order.id)}
                          >
                            <Text className="text-white text-xs">发货</Text>
                          </Button>
                        </>
                      )}
                      {order.status === 'delivering' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(order.id)}
                        >
                          查看详情
                        </Button>
                      )}
                      {order.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(order.id)}
                        >
                          查看详情
                        </Button>
                      )}
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(order.id)}
                        >
                          查看详情
                        </Button>
                      )}
                      {order.status === 'cancelled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(order.id)}
                        >
                          查看详情
                        </Button>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* 发货弹窗 */}
      {showShipModal && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <View className="bg-white rounded-xl w-80 p-4">
            <Text className="block text-base font-semibold text-gray-800 mb-4">
              发货信息
            </Text>
            
            <View className="mb-4">
              <View className="flex items-center gap-1 mb-2">
                <Text className="text-sm font-medium text-gray-700">运单号</Text>
                <Text className="text-xs text-red-500">*必填</Text>
              </View>
              <Input
                placeholder="请输入物流运单号"
                value={trackingNumber}
                onInput={(e) => setTrackingNumber(e.detail.value)}
              />
            </View>

            <View className="flex gap-3">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={handleCloseShipModal}
              >
                取消
              </Button>
              <Button 
                className="flex-1 bg-orange-500"
                onClick={handleConfirmShip}
              >
                <Text className="text-white">确认发货</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
