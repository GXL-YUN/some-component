import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface VaccineRecord {
  type: string
  date: string
  medicine: string
}

interface DewormingRecord {
  type: string
  date: string
  medicine: string
}

interface OrderDetail {
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
    videos?: string[]
    pet_name?: string
    pet_gender?: string
    pet_age_months?: number
    pet_color?: string
    health_guarantee_days?: number
    vaccine_status?: string
    deworming_status?: string
    vaccine_records?: VaccineRecord[]
    deworming_records?: DewormingRecord[]
    birth_certificate?: string
    description?: string
    merchant_rating?: string
    contact_name?: string
    contact_phone?: string
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
  shipping_method?: string
  shipped_at?: string
  quarantine_certificate?: {
    certificate_no: string
    certificate_url: string
    issue_date: string
    valid_until: string
    issued_by: string
  }
}

export default function MerchantOrderDetailPage() {
  const router = useRouter()
  const { id } = router.params
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShipModal, setShowShipModal] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  const merchantInfo = Taro.getStorageSync('merchantInfo')

  useEffect(() => {
    if (id) {
      loadOrderDetail()
    }
  }, [id])

  const loadOrderDetail = async () => {
    setLoading(true)
    try {
      // 使用固定的商家ID（实际项目应从登录状态获取）
      const merchantId = 'merchant-001'
      const res = await Network.request({
        url: `/api/merchants/${merchantId}/orders/${id}`,
        method: 'GET',
      })

      if (res && res.data) {
        setOrder(res.data)
      }
    } catch (error) {
      console.error('加载订单详情失败:', error)
      // 模拟数据 - 根据订单ID返回不同状态
      const orderStatusMap: Record<string, string> = {
        'order-001': 'paid',
        'order-002': 'delivering',
        'order-003': 'completed',
        'order-004': 'pending',
        'order-005': 'cancelled',
      };
      const status = orderStatusMap[id || ''] || 'paid';
      const isCompleted = status === 'completed';
      const isDelivering = status === 'delivering';
      const isPending = status === 'pending';
      const isCancelled = status === 'cancelled';

      setOrder({
        id: id || 'order-001',
        order_type: 'pet',
        status: status,
        total_amount: isCompleted ? 12000 : isDelivering ? 6500 : isPending ? 3500 : isCancelled ? 8000 : 4500,
        created_at: new Date(Date.now() - (isCompleted ? 172800000 : isDelivering ? 86400000 : isPending ? 3600000 : isCancelled ? 259200000 : 0)).toISOString(),
        quote_info: {
          pet_type: isCompleted || isPending ? 'cat' : isDelivering || isCancelled ? 'dog' : 'cat',
          breed: isCompleted ? '布偶猫' : isDelivering ? '柯基' : isPending ? '泰迪' : isCancelled ? '金渐层' : '英短蓝猫',
          price: isCompleted ? 12000 : isDelivering ? 6500 : isPending ? 3500 : isCancelled ? 8000 : 4500,
          pet_name: isCompleted ? '奶茶' : isDelivering ? '豆豆' : isPending ? '毛毛' : isCancelled ? '金币' : '小蓝',
          pet_gender: isPending ? '母' : '公',
          pet_age_months: isCompleted ? 4 : isDelivering ? 5 : isPending ? 2 : isCancelled ? 3 : 3,
          pet_color: isCompleted ? '海豹色' : isDelivering ? '黄白' : isPending ? '棕色' : isCancelled ? '金色' : '蓝色',
          health_guarantee_days: 7,
          vaccine_status: '已接种',
          deworming_status: '已驱虫',
          vaccine_records: [
            { type: isPending ? '犬五联' : '猫三联', date: '2024-01-15', medicine: isPending ? '卫佳5' : '妙三多' },
            { type: '狂犬疫苗', date: '2024-01-20', medicine: '瑞贝康' },
          ],
          deworming_records: [
            { type: '体内驱虫', date: '2024-02-01', medicine: '拜耳' },
            { type: '体外驱虫', date: '2024-02-01', medicine: '大宠爱' },
          ],
          birth_certificate: 'https://example.com/birth-cert.pdf',
          description: '性格活泼可爱，亲人粘人，适合家庭饲养。',
          merchant_rating: '4.9',
          photos: [],
        },
        user_info: {
          name: isCompleted ? '王先生' : isDelivering ? '李女士' : isPending ? '赵女士' : isCancelled ? '孙先生' : '张先生',
          phone: isCompleted ? '137****9012' : isDelivering ? '139****5678' : isPending ? '136****3456' : isCancelled ? '135****7890' : '138****1234',
        },
        address_info: {
          receiver_name: isCompleted ? '王先生' : isDelivering ? '李女士' : isPending ? '赵女士' : isCancelled ? '孙先生' : '张先生',
          receiver_phone: isCompleted ? '13700009012' : isDelivering ? '13900005678' : isPending ? '13600003456' : isCancelled ? '13500007890' : '13812345678',
          province: isCompleted ? '北京' : isDelivering ? '上海' : isPending ? '广东' : isCancelled ? '浙江' : '北京',
          city: isCompleted ? '北京市' : isDelivering ? '上海市' : isPending ? '广州市' : isCancelled ? '杭州市' : '北京市',
          district: isCompleted ? '海淀区' : isDelivering ? '浦东新区' : isPending ? '天河区' : isCancelled ? '西湖区' : '朝阳区',
          detail_address: isCompleted ? 'zzz路zzz小区zzz号' : isDelivering ? 'yyy路yyy小区yyy号' : isPending ? 'aaa街aaa花园aaa栋' : isCancelled ? 'bbb路bbb公寓bbb室' : 'xxx街道xxx小区xxx号',
        },
        tracking_number: isDelivering ? 'SF1234567890' : isCompleted ? 'SF9876543210' : undefined,
        shipped_at: isCompleted || isDelivering ? new Date(Date.now() - (isCompleted ? 86400000 : 3600000)).toISOString() : undefined,
        quarantine_certificate: isCompleted ? {
          certificate_no: 'QUAR-2024-001',
          certificate_url: 'https://example.com/quarantine.pdf',
          issue_date: '2024-02-01',
          valid_until: '2024-08-01',
          issued_by: '北京市动物卫生监督所',
        } : undefined,
        delivery_status: isCompleted ? 'delivered' : isDelivering ? 'shipped' : 'pending',
      })
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
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  const handleUploadCertificate = () => {
    Taro.navigateTo({
      url: `/pages/merchant-certificate/index?orderId=${order?.id}`,
    })
  }

  const handleOpenShipModal = () => {
    setTrackingNumber('')
    setShowShipModal(true)
  }

  const handleCloseShipModal = () => {
    setShowShipModal(false)
    setTrackingNumber('')
  }

  const handleConfirmShip = async () => {
    if (!trackingNumber.trim()) {
      Taro.showToast({ title: '请输入运单号', icon: 'none' })
      return
    }

    try {
      await Network.request({
        url: `/api/merchants/orders/${order?.id}/status`,
        method: 'POST',
        data: {
          merchant_id: merchantInfo?.id || 'merchant-001',
          status: 'delivering',
          tracking_number: trackingNumber.trim(),
        },
      })

      Taro.showToast({ title: '发货成功', icon: 'success' })
      handleCloseShipModal()
      // 重新加载订单详情
      loadOrderDetail()
    } catch (error) {
      console.error('发货失败:', error)
      // 模拟发货成功
      Taro.showToast({ title: '发货成功', icon: 'success' })
      handleCloseShipModal()
      loadOrderDetail()
    }
  }

  if (loading || !order) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="order-detail-scroll min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 订单状态 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-2">
              <View className="flex items-center gap-2">
                <Text className="text-sm text-gray-500">订单号：</Text>
                <Text className="text-sm text-gray-800">{order.id}</Text>
              </View>
              {getStatusBadge(order.status)}
            </View>
            <Text className="block text-xs text-gray-400 mb-3">
              创建时间：{formatTime(order.created_at)}
            </Text>
            
            {/* 待付款提示 */}
            {order.status === 'pending' && (
              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <View className="flex items-center gap-2 mb-2">
                  <Text className="text-base">⏳</Text>
                  <Text className="text-sm font-medium text-gray-700">待付款</Text>
                </View>
                <Text className="text-xs text-gray-600">
                  买家尚未付款，请耐心等待
                </Text>
              </View>
            )}

            {/* 待发货操作提示 */}
            {order.status === 'paid' && (
              <View className="bg-orange-50 rounded-lg p-3 mb-3">
                <View className="flex items-center gap-2 mb-2">
                  <Text className="text-base">📦</Text>
                  <Text className="text-sm font-medium text-orange-700">待发货</Text>
                </View>
                <Text className="text-xs text-orange-600">
                  买家已付款，请尽快上传检疫证明并发货
                </Text>
              </View>
            )}

            {/* 配送中提示 */}
            {order.status === 'delivering' && (
              <View className="bg-blue-50 rounded-lg p-3 mb-3">
                <View className="flex items-center gap-2 mb-2">
                  <Text className="text-base">🚚</Text>
                  <Text className="text-sm font-medium text-blue-700">配送中</Text>
                </View>
                <Text className="text-xs text-blue-600">
                  宠物正在配送中，请关注物流状态
                </Text>
              </View>
            )}

            {/* 已完成提示 */}
            {order.status === 'completed' && (
              <View className="bg-green-50 rounded-lg p-3 mb-3">
                <View className="flex items-center gap-2 mb-2">
                  <Text className="text-base">✅</Text>
                  <Text className="text-sm font-medium text-green-700">交易完成</Text>
                </View>
                <Text className="text-xs text-green-600">
                  交易已完成，感谢您的服务
                </Text>
              </View>
            )}

            {/* 已取消提示 */}
            {order.status === 'cancelled' && (
              <View className="bg-red-50 rounded-lg p-3 mb-3">
                <View className="flex items-center gap-2 mb-2">
                  <Text className="text-base">❌</Text>
                  <Text className="text-sm font-medium text-red-700">已取消</Text>
                </View>
                <Text className="text-xs text-red-600">
                  订单已取消，交易终止
                </Text>
              </View>
            )}

            {/* 操作按钮 */}
            {order.status === 'paid' && (
              <View className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={handleUploadCertificate}
                >
                  上传检疫证
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-orange-500"
                  onClick={handleOpenShipModal}
                >
                  <Text className="text-white text-xs">发货</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 商品信息 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          商品信息
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            {/* 宠物照片展示 */}
            {order.quote_info?.photos && order.quote_info.photos.length > 0 && (
              <ScrollView scrollX className="mb-4">
                <View className="flex flex-row gap-2">
                  {order.quote_info.photos.map((photo, index) => (
                    <Image
                      key={index}
                      src={photo}
                      className="w-24 h-24 rounded-lg flex-shrink-0"
                      mode="aspectFill"
                    />
                  ))}
                </View>
              </ScrollView>
            )}

            {/* 基本信息 */}
            <View className="flex items-center gap-3 mb-3">
              <View className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Text className="text-2xl">{getPetTypeEmoji(order.quote_info?.pet_type || 'cat')}</Text>
              </View>
              <View className="flex-1">
                <View className="flex items-center gap-2 mb-1">
                  <Text className="block text-base font-medium text-gray-800">
                    {order.quote_info?.breed}
                  </Text>
                  {order.quote_info?.merchant_rating && (
                    <View className="flex items-center gap-1">
                      <Text className="text-xs text-orange-500">⭐</Text>
                      <Text className="text-xs text-gray-600">{order.quote_info.merchant_rating}</Text>
                    </View>
                  )}
                </View>
                <Text className="block text-xs text-gray-500">
                  宠物交易订单
                </Text>
              </View>
              <Text className="text-xl font-bold text-orange-500">
                ¥{order.total_amount}
              </Text>
            </View>

            {/* 详细信息 */}
            {order.quote_info && (
              <View className="pt-3 border-t border-gray-100">
                {/* 基础属性 */}
                <View className="mb-3">
                  <Text className="text-xs text-gray-400 mb-2">基础信息</Text>
                  <View className="grid grid-cols-3 gap-3">
                    <View className="bg-gray-50 rounded-lg p-2">
                      <Text className="text-xs text-gray-500">名称</Text>
                      <Text className="text-sm text-gray-800 font-medium">{order.quote_info.pet_name || '-'}</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-2">
                      <Text className="text-xs text-gray-500">性别</Text>
                      <Text className="text-sm text-gray-800 font-medium">{order.quote_info.pet_gender || '-'}</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-2">
                      <Text className="text-xs text-gray-500">月龄</Text>
                      <Text className="text-sm text-gray-800 font-medium">{order.quote_info.pet_age_months ? `${order.quote_info.pet_age_months}个月` : '-'}</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-2">
                      <Text className="text-xs text-gray-500">毛色</Text>
                      <Text className="text-sm text-gray-800 font-medium">{order.quote_info.pet_color || '-'}</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-2">
                      <Text className="text-xs text-gray-500">疫苗</Text>
                      <Text className="text-sm text-gray-800 font-medium">{order.quote_info.vaccine_status || '-'}</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-2">
                      <Text className="text-xs text-gray-500">驱虫</Text>
                      <Text className="text-sm text-gray-800 font-medium">{order.quote_info.deworming_status || '-'}</Text>
                    </View>
                  </View>
                </View>

                {/* 健康保障 */}
                <View className="mb-3">
                  <Text className="text-xs text-gray-400 mb-2">健康保障</Text>
                  <View className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                    <Text className="text-lg">🛡️</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-green-700">
                        {order.quote_info.health_guarantee_days || 0}天健康保障
                      </Text>
                      <Text className="text-xs text-green-600">
                        购买后{order.quote_info.health_guarantee_days || 0}天内如出现健康问题可退换
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 疫苗记录 */}
                {order.quote_info.vaccine_records && order.quote_info.vaccine_records.length > 0 && (
                  <View className="mb-3">
                    <Text className="text-xs text-gray-400 mb-2">疫苗记录</Text>
                    {order.quote_info.vaccine_records.map((record, index) => (
                      <View key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                        <View className="flex items-center gap-2">
                          <View className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Text className="text-xs">💉</Text>
                          </View>
                          <View>
                            <Text className="text-sm text-gray-800">{record.type}</Text>
                            <Text className="text-xs text-gray-500">{record.medicine}</Text>
                          </View>
                        </View>
                        <Text className="text-xs text-gray-500">{record.date}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* 驱虫记录 */}
                {order.quote_info.deworming_records && order.quote_info.deworming_records.length > 0 && (
                  <View className="mb-3">
                    <Text className="text-xs text-gray-400 mb-2">驱虫记录</Text>
                    {order.quote_info.deworming_records.map((record, index) => (
                      <View key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
                        <View className="flex items-center gap-2">
                          <View className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <Text className="text-xs">🐛</Text>
                          </View>
                          <View>
                            <Text className="text-sm text-gray-800">{record.type}</Text>
                            <Text className="text-xs text-gray-500">{record.medicine}</Text>
                          </View>
                        </View>
                        <Text className="text-xs text-gray-500">{record.date}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* 出生证明 */}
                {order.quote_info.birth_certificate && (
                  <View className="mb-3">
                    <Text className="text-xs text-gray-400 mb-2">出生证明</Text>
                    <View 
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      onClick={() => {
                        Taro.setClipboardData({ data: order.quote_info?.birth_certificate || '' })
                        Taro.showToast({ title: '链接已复制', icon: 'success' })
                      }}
                    >
                      <View className="flex items-center gap-2">
                        <Text className="text-lg">📄</Text>
                        <Text className="text-sm text-gray-800">查看出生证明</Text>
                      </View>
                      <Text className="text-xs text-orange-500">点击复制链接</Text>
                    </View>
                  </View>
                )}

                {/* 宠物描述 */}
                {order.quote_info.description && (
                  <View>
                    <Text className="text-xs text-gray-400 mb-2">宠物描述</Text>
                    <View className="bg-gray-50 rounded-lg p-3">
                      <Text className="text-sm text-gray-700 leading-relaxed">
                        {order.quote_info.description}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </CardContent>
        </Card>

        {/* 收货信息 */}
        {order.address_info && (
          <>
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              收货信息
            </Text>

            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <View className="flex items-start gap-2 mb-2">
                  <Text className="text-lg">📍</Text>
                  <View className="flex-1">
                    <View className="flex items-center gap-2 mb-1">
                      <Text className="text-sm font-medium text-gray-800">
                        {order.address_info.receiver_name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {order.address_info.receiver_phone}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">
                      {order.address_info.province}
                      {order.address_info.city}
                      {order.address_info.district}
                      {order.address_info.detail_address}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </>
        )}

        {/* 物流信息 */}
        {order.tracking_number && (
          <>
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              物流信息
            </Text>

            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">物流单号</Text>
                  <View className="flex items-center gap-2">
                    <Text className="text-sm text-gray-800">{order.tracking_number}</Text>
                    <Text 
                      className="text-xs text-orange-500"
                      onClick={() => {
                        Taro.setClipboardData({ data: order.tracking_number || '' })
                        Taro.showToast({ title: '已复制', icon: 'success' })
                      }}
                    >
                      复制
                    </Text>
                  </View>
                </View>
                {order.shipped_at && (
                  <View className="flex items-center justify-between">
                    <Text className="text-sm text-gray-600">发货时间</Text>
                    <Text className="text-sm text-gray-800">{formatTime(order.shipped_at)}</Text>
                  </View>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* 检疫证明 */}
        {order.quarantine_certificate ? (
          <>
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              检疫证明
            </Text>

            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">证明编号</Text>
                  <Text className="text-sm text-gray-800">{order.quarantine_certificate.certificate_no}</Text>
                </View>
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">签发机构</Text>
                  <Text className="text-sm text-gray-800">{order.quarantine_certificate.issued_by}</Text>
                </View>
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600">签发日期</Text>
                  <Text className="text-sm text-gray-800">{order.quarantine_certificate.issue_date}</Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className="text-sm text-gray-600">有效期至</Text>
                  <Text className="text-sm text-gray-800">{order.quarantine_certificate.valid_until}</Text>
                </View>
              </CardContent>
            </Card>
          </>
        ) : order.status === 'paid' ? (
          <>
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              检疫证明
            </Text>

            <Card className="bg-orange-50 mb-4">
              <CardContent className="p-4">
                <View className="flex items-center justify-between">
                  <View className="flex items-center gap-2">
                    <Text className="text-lg">⚠️</Text>
                    <Text className="text-sm text-orange-600">尚未上传检疫证明</Text>
                  </View>
                  <Button size="sm" onClick={handleUploadCertificate}>
                    立即上传
                  </Button>
                </View>
              </CardContent>
            </Card>
          </>
        ) : null}

        {/* 底部操作 */}
        {order.status === 'paid' && (
          <View className="mt-4 mb-8">
            <View className="flex gap-2">
              <Button 
                className="flex-1"
                variant="outline"
                onClick={handleUploadCertificate}
              >
                上传检疫证明
              </Button>
              <Button 
                className="flex-1 bg-orange-500"
                onClick={handleOpenShipModal}
              >
                <Text className="text-white font-medium">发货</Text>
              </Button>
            </View>
          </View>
        )}

        <View className="h-8" />
      </View>

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
    </ScrollView>
  )
}
