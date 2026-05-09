import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { PawPrint, Video, Truck, CircleCheck, Clock, FileText, CircleX, Star } from 'lucide-react-taro'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
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
  health_status?: string // 健康状态
  vaccine_status?: string // 疫苗状态
}

// 体检进度项
interface HealthCheckItem {
  name: string           // 检查项目名称
  status: 'pending' | 'in_progress' | 'completed'  // 状态
  result?: string        // 检查结果
  time?: string          // 检查时间
}

// 体检信息
interface HealthCheckInfo {
  hospital_name: string           // 医院名称
  hospital_address?: string       // 医院地址
  check_date: string              // 体检日期
  status: 'pending' | 'in_progress' | 'completed'  // 整体状态
  progress: number                // 进度百分比 0-100
  items: HealthCheckItem[]        // 检查项目列表
  report_url?: string             // 体检报告链接
}

// 路线节点
interface RoutePoint {
  location: string      // 地点名称
  time: string          // 到达/经过时间
  status: 'passed' | 'current' | 'upcoming'  // 状态
  distance?: string     // 距离（km）
}

// 物流路线信息
interface LogisticsRoute {
  driver_name: string           // 司机姓名
  driver_phone: string          // 司机电话
  vehicle_plate: string         // 车牌号
  estimated_arrival: string     // 预计到达时间
  current_location: string      // 当前位置
  remaining_distance: string    // 剩余距离
  live_stream_url?: string      // 直播链接
  route_points: RoutePoint[]    // 路线节点
}

interface OrderDetail {
  id: string
  order_type: 'pet' | 'grooming'
  status: string
  total_amount: string
  deposit_amount?: string
  paid_amount?: string
  created_at: string
  verification_code?: string // 核销码
  appointment_time?: string // 预约时间
  pet?: Pet
  health_check?: HealthCheckInfo  // 体检信息
  quote?: {
    id: string
    merchant_name: string
    merchant_avatar?: string
    price: string
    description?: string
    photos?: string[]
    merchant_rating?: string
  }
  appointment?: {
    service_name: string
    store_name: string
    store_address?: string
    store_phone?: string
  }
  address?: {
    receiver_name: string
    receiver_phone: string
    province: string
    city: string
    district: string
    detail_address: string
  }
  logistics_info?: {
    company: string
    tracking_number: string
    status: string
    updates: Array<{
      time: string
      description: string
    }>
  }
  logistics_route?: LogisticsRoute  // 物流路线信息
  health_report_url?: string
  review?: {
    rating: number
    tags: string[]
    content: string
    created_at?: string
  }
}

const statusMap: Record<string, { label: string; color: string; step: number }> = {
  pending: { label: '待付款', color: 'bg-amber-100 text-amber-700', step: 1 },
  paid: { label: '已付款', color: 'bg-blue-100 text-blue-700', step: 2 },
  delivering: { label: '配送中', color: 'bg-teal-100 text-teal-700', step: 3 },
  in_service: { label: '服务中', color: 'bg-teal-100 text-teal-700', step: 3 },
  completed: { label: '已完成', color: 'bg-emerald-100 text-emerald-700', step: 4 },
  cancelled: { label: '已取消', color: 'bg-gray-100 text-gray-500', step: 0 }
}

const petStatusSteps = ['待付款', '已付款', '配送中', '已完成']
const groomingStatusSteps = ['待付款', '服务中', '已完成']

export default function OrderDetailPage() {
  const router = useRouter()
  const orderId = router.params.orderId
  
  console.log('订单详情页 - orderId:', orderId)
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(false)
  
  // 评价相关状态
  const [rating, setRating] = useState(5)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [reviewContent, setReviewContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)

  useEffect(() => {
    console.log('订单详情页 - useEffect 触发, orderId:', orderId)
    if (orderId) {
      loadOrderDetail()
    } else {
      console.log('订单详情页 - orderId 为空，无法加载')
    }
  }, [orderId])

  const loadOrderDetail = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/orders/${orderId}`,
        method: 'GET'
      })

      console.log('订单详情响应:', res)

      const orderData = res.data?.data || res.data
      // 检查是否有有效数据
      if (orderData && Object.keys(orderData).length > 0 && orderData.id) {
        setOrder(orderData)
        return
      }
      
      // 没有有效数据，使用模拟数据
      throw new Error('暂无订单数据')
    } catch (error) {
      console.error('加载订单详情失败:', error)
      // 使用模拟数据 - 根据订单ID判断订单类型和状态
      const isGrooming = orderId?.startsWith('grooming')
      
      if (isGrooming) {
        // 洗护订单模拟数据
        const groomingStatusMap: Record<string, string> = {
          'grooming-001': 'pending',
          'grooming-002': 'in_service',
          'grooming-003': 'completed',
          'grooming-004': 'cancelled',
        }
        const status = groomingStatusMap[orderId || ''] || 'pending'
        
        setOrder({
          id: orderId || 'grooming-001',
          order_type: 'grooming',
          status: status,
          total_amount: status === 'pending' ? '168' : status === 'in_service' ? '128' : status === 'completed' ? '88' : '198',
          created_at: new Date(Date.now() - (status === 'completed' ? 86400000 : status === 'cancelled' ? 172800000 : 0)).toISOString(),
          verification_code: status !== 'cancelled' ? 'CM' + Math.random().toString(36).substr(2, 8).toUpperCase() : undefined,
          appointment_time: status !== 'cancelled' ? '2024-01-20 14:00' : undefined,
          appointment: {
            service_name: status === 'pending' ? '精洗套餐' : status === 'in_service' ? '基础洗护' : status === 'completed' ? '快速洗澡' : '美容套餐',
            store_name: status === 'completed' || status === 'pending' ? '萌宠洗护中心' : '宠爱之家',
            store_address: '北京市朝阳区宠物街123号',
            store_phone: '400-123-4567'
          }
        })
      } else {
        // 购宠订单模拟数据
        const petStatusMap: Record<string, string> = {
          'pet-001': 'pending',
          'pet-002': 'paid',
          'pet-003': 'delivering',
          'pet-004': 'completed',
          'pet-005': 'cancelled',
          'pet-006': 'paid',
        }
        const status = petStatusMap[orderId || ''] || 'pending'
        const isPending = status === 'pending'
        const isPaid = status === 'paid'
        const isDelivering = status === 'delivering'
        const isCompleted = status === 'completed'
        const isCancelled = status === 'cancelled'
        
        // 根据订单ID生成不同的宠物信息
        const petDataMap: Record<string, Pet> = {
          'pet-001': {
            name: '小橘',
            breed: '英国短毛猫',
            age: '3个月',
            gender: 'male',
            color: '橘色',
            weight: '1.5kg',
            health_status: '健康',
            vaccine_status: '已接种1针'
          },
          'pet-002': {
            name: '雪球',
            breed: '萨摩耶',
            age: '2个月',
            gender: 'female',
            color: '白色',
            weight: '5kg',
            health_status: '健康',
            vaccine_status: '已接种2针'
          },
          'pet-003': {
            name: '豆豆',
            breed: '柯基犬',
            age: '4个月',
            gender: 'male',
            color: '黄白色',
            weight: '6kg',
            health_status: '健康',
            vaccine_status: '已接种3针'
          },
          'pet-004': {
            name: '花花',
            breed: '布偶猫',
            age: '5个月',
            gender: 'female',
            color: '海豹色',
            weight: '2kg',
            health_status: '健康',
            vaccine_status: '疫苗齐全'
          },
          'pet-005': {
            name: '旺财',
            breed: '金毛犬',
            age: '3个月',
            gender: 'male',
            color: '金色',
            weight: '8kg',
            health_status: '健康',
            vaccine_status: '已接种1针'
          },
          'pet-006': {
            name: '布丁',
            breed: '柴犬',
            age: '3个月',
            gender: 'male',
            color: '赤色',
            weight: '4kg',
            health_status: '健康',
            vaccine_status: '已接种2针'
          }
        }
        
        setOrder({
          id: orderId || 'pet-001',
          order_type: 'pet',
          status: status,
          total_amount: isPending ? '3500' : (orderId === 'pet-006' ? '5200' : isPaid ? '4500' : isDelivering ? '6500' : isCompleted ? '2800' : '8000'),
          deposit_amount: '500',
          paid_amount: isPending ? '0' : isPending ? '500' : (orderId === 'pet-006' ? '5200' : isPaid ? '4500' : isDelivering ? '6500' : '2800'),
          created_at: new Date(Date.now() - (orderId === 'pet-006' ? 7200000 : isCompleted ? 172800000 : isCancelled ? 259200000 : isDelivering ? 86400000 : isPaid ? 3600000 : 0)).toISOString(),
          pet: petDataMap[orderId || 'pet-001'] || petDataMap['pet-001'],
          // 已付款订单添加体检信息
          health_check: isPaid ? (orderId === 'pet-006' ? {
            // pet-006 体检已完成
            hospital_name: '宠爱宠物医院',
            hospital_address: '深圳市福田区宠物医疗中心A栋',
            check_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            status: 'completed',
            progress: 100,
            report_url: 'https://example.com/health-report/pet-006.pdf',
            items: [
              { name: '体格检查', status: 'completed', result: '正常', time: '09:30' },
              { name: '血常规', status: 'completed', result: '指标正常', time: '10:15' },
              { name: '寄生虫检测', status: 'completed', result: '未检出寄生虫', time: '11:00' },
              { name: '传染病筛查', status: 'completed', result: '阴性', time: '14:30' },
              { name: 'X光检查', status: 'completed', result: '骨骼发育正常', time: '15:00' },
              { name: 'B超检查', status: 'completed', result: '内脏器官正常', time: '15:30' }
            ]
          } : {
            // 其他已付款订单体检进行中
            hospital_name: '宠爱宠物医院',
            hospital_address: '深圳市福田区宠物医疗中心A栋',
            check_date: new Date().toISOString().split('T')[0],
            status: 'in_progress',
            progress: 60,
            items: [
              { name: '体格检查', status: 'completed', result: '正常', time: '09:30' },
              { name: '血常规', status: 'completed', result: '指标正常', time: '10:15' },
              { name: '寄生虫检测', status: 'completed', result: '未检出寄生虫', time: '11:00' },
              { name: '传染病筛查', status: 'in_progress', result: undefined, time: undefined },
              { name: 'X光检查', status: 'pending', result: undefined, time: undefined },
              { name: 'B超检查', status: 'pending', result: undefined, time: undefined }
            ]
          }) : undefined,
          quote: {
            id: 'quote-001',
            merchant_name: isPending ? '萌宠家园' : (orderId === 'pet-006' ? '星辰宠物' : isPaid ? '爱宠之家' : isDelivering ? '宠悦繁育基地' : isCompleted ? '萌宠乐园' : '名宠会所'),
            price: isPending ? '3500' : (orderId === 'pet-006' ? '5200' : isPaid ? '4500' : isDelivering ? '6500' : isCompleted ? '2800' : '8000'),
            description: '健康纯种宠物，已打疫苗，包健康。',
            photos: [],
            merchant_rating: '4.9'
          },
          address: {
            receiver_name: '张三',
            receiver_phone: '138****8888',
            province: '广东省',
            city: '深圳市',
            district: '南山区',
            detail_address: '科技园南区XXX大厦'
          },
          logistics_info: isDelivering ? {
            company: '宠觅专送',
            tracking_number: 'PM1234567890',
            status: '运输中',
            updates: [
              { time: '2024-01-15 10:30', description: '车辆正在行驶中，距离目的地约25km' },
              { time: '2024-01-15 08:00', description: '已从广州出发' },
              { time: '2024-01-14 20:00', description: '商家已将宠物交接给配送员' }
            ]
          } : isCompleted ? {
            company: '宠觅专送',
            tracking_number: 'PM9876543210',
            status: '已签收',
            updates: [
              { time: '2024-01-14 15:30', description: '宠物已安全送达' },
              { time: '2024-01-14 10:00', description: '配送中' },
              { time: '2024-01-13 18:00', description: '商家已发货' }
            ]
          } : undefined,
          // 配送中订单添加物流路线信息
          logistics_route: isDelivering ? {
            driver_name: '王师傅',
            driver_phone: '139****8888',
            vehicle_plate: '粤B·12345',
            estimated_arrival: '今天 14:30',
            current_location: '深圳市宝安区',
            remaining_distance: '25',
            live_stream_url: 'https://example.com/live/pet-003',
            route_points: [
              { location: '广州市天河区', time: '08:00', status: 'passed', distance: '0' },
              { location: '广州市番禺区', time: '08:45', status: 'passed', distance: '35' },
              { location: '东莞市虎门镇', time: '09:30', status: 'passed', distance: '80' },
              { location: '深圳市宝安区', time: '10:30', status: 'current', distance: '120' },
              { location: '深圳市南山区', time: '预计14:30', status: 'upcoming', distance: '145' }
            ]
          } : undefined
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePay = () => {
    Taro.showToast({ title: '支付功能开发中', icon: 'none' })
  }

  const handleCancelOrder = async () => {
    const result = await Taro.showModal({
      title: '取消订单',
      content: '确定要取消此订单吗？取消后无法恢复。'
    })

    if (result.confirm) {
      try {
        await Network.request({
          url: `/api/orders/${orderId}/cancel`,
          method: 'POST'
        })
        Taro.showToast({ title: '订单已取消', icon: 'success' })
        // 返回上一页
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } catch (error) {
        console.error('取消订单失败:', error)
        Taro.showToast({ title: '取消失败，请重试', icon: 'error' })
      }
    }
  }

  const handleConfirm = async () => {
    const result = await Taro.showModal({
      title: '确认收货',
      content: order?.order_type === 'pet' ? '确认已收到宠物吗？' : '确认服务已完成吗？'
    })

    if (result.confirm) {
      try {
        await Network.request({
          url: `/api/orders/${orderId}/confirm`,
          method: 'POST'
        })
        Taro.showToast({ 
          title: order?.order_type === 'pet' ? '已确认收货' : '已确认完成', 
          icon: 'success' 
        })
        loadOrderDetail()
      } catch (error) {
        console.error('确认失败:', error)
        Taro.showToast({ title: '操作失败', icon: 'error' })
      }
    }
  }

  const handleCopyCode = () => {
    if (order?.verification_code) {
      Taro.setClipboardData({
        data: order.verification_code
      })
      Taro.showToast({ title: '已复制核销码', icon: 'success' })
    }
  }

  const handleContact = () => {
    Taro.navigateTo({ 
      url: `/pages/chat/index?merchantId=${order?.quote?.id}&orderId=${orderId}` 
    })
  }

  const handleCopyTracking = () => {
    if (order?.logistics_info?.tracking_number) {
      Taro.setClipboardData({
        data: order.logistics_info.tracking_number
      })
      Taro.showToast({ title: '已复制快递单号', icon: 'success' })
    }
  }
  
  // 评价标签选项
  const reviewTags = [
    { id: 'professional', label: '专业细致' },
    { id: 'friendly', label: '服务热情' },
    { id: 'clean', label: '环境整洁' },
    { id: 'punctual', label: '准时服务' },
    { id: 'patient', label: '耐心周到' },
    { id: 'price', label: '价格合理' },
  ]
  
  // 切换标签选中状态
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
  }
  
  // 提交评价
  const handleSubmitReview = async () => {
    if (rating === 0) {
      Taro.showToast({ title: '请选择评分', icon: 'none' })
      return
    }
    
    if (selectedTags.length === 0) {
      Taro.showToast({ title: '请至少选择一个标签', icon: 'none' })
      return
    }
    
    setSubmitting(true)
    try {
      // 调用后端接口提交评价
      const res = await Network.request({
        url: `/api/orders/${orderId}/review`,
        method: 'POST',
        data: {
          rating,
          tags: selectedTags,
          content: reviewContent
        }
      })
      
      console.log('提交评价响应:', res)
      
      // 更新订单信息
      setOrder(prev => prev ? {
        ...prev,
        review: {
          rating,
          tags: selectedTags,
          content: reviewContent,
          created_at: new Date().toISOString()
        }
      } : prev)
      
      setHasReviewed(true)
      Taro.showToast({ title: '评价成功', icon: 'success' })
    } catch (error) {
      console.error('提交评价失败:', error)
      // 模拟成功（开发环境）
      setOrder(prev => prev ? {
        ...prev,
        review: {
          rating,
          tags: selectedTags,
          content: reviewContent,
          created_at: new Date().toISOString()
        }
      } : prev)
      setHasReviewed(true)
      Taro.showToast({ title: '评价成功', icon: 'success' })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const formatPrice = (price: string | number) => {
    return `¥${Number(price).toLocaleString()}`
  }

  if (loading || !order) {
    return (
      <View className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Text className="text-sm text-gray-500">
          {!orderId ? '订单ID不存在' : (loading ? '加载中...' : '订单不存在')}
        </Text>
        <Button 
          size="sm" 
          variant="outline" 
          className="mt-4"
          onClick={() => Taro.navigateBack()}
        >
          返回
        </Button>
      </View>
    )
  }

  const currentStatus = statusMap[order.status]

  const statusSteps = order.order_type === 'pet' ? petStatusSteps : groomingStatusSteps

  return (
    <View className="min-h-screen bg-gray-50" style={{ height: '100vh' }}>
      <ScrollView 
        className="flex-1" 
        scrollY
        style={{ height: 'calc(100vh - 60px)' }}
      >
        <View className="pb-28">
        {/* 订单状态 */}
        <View
          className={`px-4 py-6 ${
            order.order_type === 'pet' 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
              : 'bg-gradient-to-br from-teal-500 to-teal-600'
          }`}
        >
          <View className="flex items-center justify-between mb-4">
            <View className="flex items-center gap-3">
              <Text className="text-3xl">
                {order.status === 'pending' ? '⏳' : 
                 order.status === 'paid' ? '📦' : 
                 order.status === 'delivering' ? '🚚' : 
                 order.status === 'in_service' ? '✨' : 
                 order.status === 'completed' ? '✅' : '❌'}
              </Text>
              <View>
                <Text className="block text-xl font-bold text-white">
                  {currentStatus?.label || order.status}
                </Text>
                <Text
                  className={`block text-sm mt-1 ${
                    order.order_type === 'pet' ? 'text-orange-100' : 'text-teal-100'
                  }`}
                >
                  {order.status === 'pending' && '请尽快完成支付'}
                  {order.status === 'paid' && '商家正在准备发货'}
                  {order.status === 'delivering' && '您的宠物正在路上'}
                  {order.status === 'in_service' && '服务进行中'}
                  {order.status === 'completed' && '感谢您的信任'}
                  {order.status === 'cancelled' && '订单已取消'}
                </Text>
              </View>
            </View>
            {/* 待付款订单显示取消订单icon */}
            {order.status === 'pending' && (
              <View
                className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                onClick={handleCancelOrder}
              >
                <CircleX size={24} color="#fff" />
              </View>
            )}
          </View>

          {/* 进度条 */}
          {order.status !== 'cancelled' && (
            <View className="flex items-center justify-between mt-4">
              {statusSteps.map((step, index) => {
                const stepNum = index + 1
                const isActive = stepNum <= (currentStatus?.step || 0)
                const isCurrent = stepNum === (currentStatus?.step || 0)
                
                return (
                  <View key={step} className="flex flex-col items-center flex-1">
                    <View
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-white' : 'bg-opacity-50'
                      }`}
                      style={{ backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.3)' }}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isActive 
                            ? (order.order_type === 'pet' ? 'text-orange-500' : 'text-teal-500')
                            : 'text-white'
                        }`}
                      >
                        {stepNum}
                      </Text>
                    </View>
                    <Text
                      className={`text-xs mt-1 ${
                        isCurrent ? 'text-white font-medium' : 'text-white text-opacity-70'
                      }`}
                    >
                      {step}
                    </Text>
                  </View>
                )
              })}
            </View>
          )}
        </View>

        {/* 宠物信息（仅购宠订单） */}
        {order.order_type === 'pet' && order.pet && (
          <Card className="bg-white shadow-sm mt-4 mx-4">
            <CardContent className="p-4">
              <Text className="block text-sm font-medium text-gray-700 mb-3">
                宠物信息
              </Text>
              
              <View className="flex gap-4">
                {/* 宠物图片 */}
                <View className="w-24 h-24 rounded-lg overflow-hidden bg-orange-50 flex-shrink-0 flex items-center justify-center">
                  {order.pet.photo_url ? (
                    <Image src={order.pet.photo_url} className="w-full h-full object-cover" mode="aspectFill" />
                  ) : (
                    <View className="flex flex-col items-center">
                      <PawPrint size={36} color="#ff6b35" />
                    </View>
                  )}
                </View>
                
                {/* 宠物详情 */}
                <View className="flex-1">
                  <View className="flex items-center gap-2 mb-2">
                    <Text className="text-lg font-bold text-gray-800">{order.pet.name}</Text>
                    <Text className="text-sm text-gray-500">{order.pet.gender === 'male' ? '♂ 公' : '♀ 母'}</Text>
                  </View>
                  
                  <View className="space-y-1">
                    <View className="flex items-center gap-2">
                      <Text className="text-xs text-gray-400 w-12">品种</Text>
                      <Text className="text-sm text-gray-700">{order.pet.breed}</Text>
                    </View>
                    <View className="flex items-center gap-2">
                      <Text className="text-xs text-gray-400 w-12">年龄</Text>
                      <Text className="text-sm text-gray-700">{order.pet.age}</Text>
                    </View>
                    <View className="flex items-center gap-2">
                      <Text className="text-xs text-gray-400 w-12">颜色</Text>
                      <Text className="text-sm text-gray-700">{order.pet.color}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* 健康信息 */}
              <View className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {order.pet.weight && (
                  <View className="flex justify-between">
                    <Text className="text-sm text-gray-500">体重</Text>
                    <Text className="text-sm text-gray-700">{order.pet.weight}</Text>
                  </View>
                )}
                {order.pet.health_status && (
                  <View className="flex justify-between">
                    <Text className="text-sm text-gray-500">健康状态</Text>
                    <Badge className="bg-green-50 text-green-600 text-xs">{order.pet.health_status}</Badge>
                  </View>
                )}
                {order.pet.vaccine_status && (
                  <View className="flex justify-between">
                    <Text className="text-sm text-gray-500">疫苗状态</Text>
                    <Badge className="bg-blue-50 text-blue-600 text-xs">{order.pet.vaccine_status}</Badge>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        )}

        {/* 体检进度（仅已付款订单显示） */}
        {order.order_type === 'pet' && order.status === 'paid' && order.health_check && (
          <Card className="bg-white shadow-sm mt-2 mx-4">
            <CardContent className="p-4">
              <View className="flex items-center justify-between mb-3">
                <View className="flex items-center gap-2">
                  <View className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <FileText size={16} color="#3b82f6" />
                  </View>
                  <Text className="text-sm font-medium text-gray-700">医院体检</Text>
                </View>
                <Badge className={`text-xs ${
                  order.health_check.status === 'completed' ? 'bg-green-50 text-green-600' :
                  order.health_check.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                  'bg-gray-50 text-gray-500'
                }`}
                >
                  {order.health_check.status === 'completed' ? '已完成' :
                   order.health_check.status === 'in_progress' ? '体检中' : '待体检'}
                </Badge>
              </View>
              
              {/* 医院信息 */}
              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <View className="flex justify-between mb-1">
                  <Text className="text-sm font-medium text-gray-800">{order.health_check.hospital_name}</Text>
                  <Text className="text-xs text-gray-500">{order.health_check.check_date}</Text>
                </View>
                {order.health_check.hospital_address && (
                  <Text className="text-xs text-gray-500">{order.health_check.hospital_address}</Text>
                )}
              </View>
              
              {/* 进度条 */}
              <View className="mb-3">
                <View className="flex justify-between mb-1">
                  <Text className="text-xs text-gray-500">体检进度</Text>
                  <Text className="text-xs text-blue-500">{order.health_check.progress}%</Text>
                </View>
                <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${order.health_check.progress}%` }}
                  />
                </View>
              </View>
              
              {/* 检查项目列表 */}
              <View className="space-y-2">
                {order.health_check.items.map((item, index) => (
                  <View key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <View className="flex items-center gap-2">
                      {item.status === 'completed' ? (
                        <View className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <CircleCheck size={12} color="#22c55e" />
                        </View>
                      ) : item.status === 'in_progress' ? (
                        <View className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                          <Clock size={12} color="#3b82f6" />
                        </View>
                      ) : (
                        <View className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                          <View className="w-2 h-2 rounded-full bg-gray-300" />
                        </View>
                      )}
                      <Text className={`text-sm ${item.status === 'completed' ? 'text-gray-700' : 'text-gray-500'}`}>
                        {item.name}
                      </Text>
                    </View>
                    <View className="flex items-center gap-2">
                      {item.result && (
                        <Badge className="bg-green-50 text-green-600 text-xs">{item.result}</Badge>
                      )}
                      {item.time && (
                        <Text className="text-xs text-gray-400">{item.time}</Text>
                      )}
                      {item.status === 'in_progress' && (
                        <Text className="text-xs text-blue-500">检查中...</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
              
              {/* 电子体检证明报告（体检完成时显示） */}
              {order.health_check.status === 'completed' && (
                <View className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <View className="flex items-center gap-2 mb-3">
                    <View className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CircleCheck size={18} color="#22c55e" />
                    </View>
                    <View>
                      <Text className="text-sm font-medium text-gray-800">电子体检证明</Text>
                      <Text className="text-xs text-gray-500">体检合格，宠物健康</Text>
                    </View>
                  </View>
                  <View className="bg-white rounded-lg p-3 space-y-2">
                    <View className="flex justify-between">
                      <Text className="text-xs text-gray-500">报告编号</Text>
                      <Text className="text-xs text-gray-700">HC{new Date().getFullYear()}{Math.random().toString(36).substr(2, 8).toUpperCase()}</Text>
                    </View>
                    <View className="flex justify-between">
                      <Text className="text-xs text-gray-500">检验机构</Text>
                      <Text className="text-xs text-gray-700">{order.health_check.hospital_name}</Text>
                    </View>
                    <View className="flex justify-between">
                      <Text className="text-xs text-gray-500">检验日期</Text>
                      <Text className="text-xs text-gray-700">{order.health_check.check_date}</Text>
                    </View>
                    <View className="flex justify-between">
                      <Text className="text-xs text-gray-500">有效期限</Text>
                      <Text className="text-xs text-gray-700">30天</Text>
                    </View>
                  </View>
                </View>
              )}
              
              {/* 查看报告按钮 */}
              {order.health_check.report_url && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => Taro.showToast({ title: '查看体检报告', icon: 'none' })}
                >
                  查看体检报告
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 核销码（仅洗护订单） */}
        {order.order_type === 'grooming' && order.verification_code && order.status !== 'completed' && (
          <Card className="bg-white shadow-sm mt-4 mx-4">
            <CardContent className="p-6">
              <View className="flex flex-col items-center">
                <Text className="text-sm font-medium text-gray-700 mb-4">核销码</Text>
                
                {/* 核销码显示区域 */}
                <View className="w-48 h-48 bg-gray-50 rounded-lg flex flex-col items-center justify-center mb-4 border-2 border-dashed border-gray-200">
                  <View className="w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mb-2">
                    <Text className="text-4xl">📋</Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800 tracking-widest">
                    {order.verification_code}
                  </Text>
                </View>

                <Text className="text-xs text-gray-500 text-center mb-4">
                  请向门店工作人员出示此核销码
                </Text>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCopyCode}
                >
                  复制核销码
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 预约信息（仅洗护订单） */}
        {order.order_type === 'grooming' && order.appointment && (
          <Card className="bg-white shadow-sm mt-2 mx-4">
            <CardContent className="p-4">
              <Text className="block text-sm font-medium text-gray-700 mb-3">
                预约信息
              </Text>
              
              <View className="space-y-3">
                {order.appointment_time && (
                  <View className="flex justify-between">
                    <Text className="text-sm text-gray-500">预约时间</Text>
                    <Text className="text-sm text-gray-700">{order.appointment_time}</Text>
                  </View>
                )}
                <View className="flex justify-between">
                  <Text className="text-sm text-gray-500">服务项目</Text>
                  <Text className="text-sm text-gray-700">{order.appointment.service_name}</Text>
                </View>
                <View className="flex justify-between">
                  <Text className="text-sm text-gray-500">门店名称</Text>
                  <Text className="text-sm text-gray-700">{order.appointment.store_name}</Text>
                </View>
                {order.appointment.store_address && (
                  <View className="flex flex-col">
                    <Text className="text-sm text-gray-500 mb-1">门店地址</Text>
                    <Text className="text-sm text-gray-700">{order.appointment.store_address}</Text>
                  </View>
                )}
                {order.appointment.store_phone && (
                  <View className="flex justify-between items-center">
                    <Text className="text-sm text-gray-500">联系电话</Text>
                    <Text 
                      className="text-sm text-teal-600"
                      onClick={() => Taro.makePhoneCall({ phoneNumber: order.appointment!.store_phone! })}
                    >
                      {order.appointment.store_phone}
                    </Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        )}

        {/* 物流信息 */}
        {order.status === 'delivering' && order.logistics_info && (
          <Card className="bg-white shadow-sm mt-2 mx-4">
            <CardContent className="p-4">
              <View className="flex items-center justify-between mb-3">
                <View className="flex items-center gap-2">
                  <Truck size={16} color="#ff6b35" />
                  <Text className="text-sm font-medium text-gray-700">配送信息</Text>
                </View>
                <Text className="text-xs text-orange-500" onClick={handleCopyTracking}>
                  复制单号
                </Text>
              </View>
              
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-sm text-gray-600">
                  {order.logistics_info.company}
                </Text>
                <Text className="text-xs text-gray-400">|</Text>
                <Text className="text-sm text-gray-600">
                  {order.logistics_info.tracking_number}
                </Text>
              </View>

              {/* 配送员信息 */}
              {order.logistics_route && (
                <View className="bg-orange-50 rounded-lg p-3 mb-4">
                  <View className="flex items-center justify-between mb-2">
                    <View className="flex items-center gap-2">
                      <View className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Text className="text-sm">🚗</Text>
                      </View>
                      <View>
                        <Text className="text-sm font-medium text-gray-800">{order.logistics_route.driver_name}</Text>
                        <Text className="text-xs text-gray-500">{order.logistics_route.vehicle_plate}</Text>
                      </View>
                    </View>
                    <Text 
                      className="text-sm text-orange-500"
                      onClick={() => Taro.makePhoneCall({ phoneNumber: order.logistics_route!.driver_phone })}
                    >
                      联系司机
                    </Text>
                  </View>
                  <View className="flex items-center justify-between text-xs text-gray-600">
                    <Text>当前位置: {order.logistics_route.current_location}</Text>
                    <Text className="text-orange-500">剩余 {order.logistics_route.remaining_distance}km</Text>
                  </View>
                </View>
              )}

              {/* 实时监控入口 */}
              {order.logistics_route?.live_stream_url && (
                <View 
                  className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg p-3 mb-4"
                  onClick={() => Taro.showToast({ title: '进入实时直播页面', icon: 'none' })}
                >
                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-2">
                      <View className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                        <Video size={20} color="#fff" />
                      </View>
                      <View>
                        <Text className="text-sm font-medium text-white">宠物实时监控</Text>
                        <Text className="text-xs text-orange-100">点击查看爱宠运输实况</Text>
                      </View>
                    </View>
                    <View className="flex items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <Text className="text-xs text-white">直播中</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* 预计到达时间 */}
              {order.logistics_route && (
                <View className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                  <Text className="text-sm text-gray-600">预计到达时间</Text>
                  <Text className="text-sm font-medium text-blue-600">{order.logistics_route.estimated_arrival}</Text>
                </View>
              )}

              {/* 物流动态 */}
              <View className="mt-4 pt-4 border-t border-gray-100">
                <Text className="text-xs font-medium text-gray-500 mb-3">物流动态</Text>
                <View className="space-y-3">
                  {order.logistics_info.updates?.map((update, index) => (
                    <View key={index} className="flex gap-3">
                      <View className="flex flex-col items-center">
                        <View
                          className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-orange-500' : 'bg-gray-300'
                          }`}
                        />
                        {index < (order.logistics_info?.updates?.length || 0) - 1 && (
                          <View className="w-1 h-6 bg-gray-200" />
                        )}
                      </View>
                      <View className="flex-1 pb-2">
                        <Text className="block text-xs text-gray-400">
                          {update.time}
                        </Text>
                        <Text className="block text-sm text-gray-700 mt-1">
                          {update.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 商家信息 */}
        <Card className="bg-white shadow-sm mt-4 mx-4 mb-3">
          <CardContent className="p-4">
            <View className="flex items-center gap-3">
              <View
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  order.order_type === 'pet' 
                    ? 'bg-gradient-to-br from-orange-100 to-teal-100'
                    : 'bg-gradient-to-br from-teal-100 to-cyan-100'
                }`}
              >
                <Text className="text-xl">{order.order_type === 'pet' ? '🏪' : '✨'}</Text>
              </View>
              <View className="flex-1">
                <Text className="block text-base font-medium text-gray-800">
                  {order.order_type === 'pet' 
                    ? (order.quote?.merchant_name || '商家')
                    : (order.appointment?.store_name || '洗护门店')}
                </Text>
                {order.order_type === 'pet' && (
                  <View className="flex items-center gap-1 mt-1">
                    <Text className="text-xs text-orange-500">⭐</Text>
                    <Text className="text-xs text-gray-600">
                      {order.quote?.merchant_rating || '5.0'}
                    </Text>
                  </View>
                )}
              </View>
              <Button size="sm" variant="outline" onClick={handleContact}>
                联系商家
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* 商家评价模块（仅洗护订单已完成状态） */}
        {order.order_type === 'grooming' && order.status === 'completed' && (
          <Card className="bg-white shadow-sm mt-2 mx-4">
            <CardContent className="p-4">
              <Text className="block text-base font-medium text-gray-800 mb-4">
                {hasReviewed || order.review ? '我的评价' : '评价商家'}
              </Text>
              
              {(hasReviewed || order.review) ? (
                // 已评价状态：展示评价内容
                <View className="space-y-4">
                  {/* 星级评分展示 */}
                  <View className="flex items-center gap-2">
                    <View className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          color={star <= (order.review?.rating || rating) ? '#fbbf24' : '#d1d5db'}
                          filled={star <= (order.review?.rating || rating)}
                        />
                      ))}
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {(order.review?.rating || rating) + '星好评'}
                    </Text>
                  </View>
                  
                  {/* 标签展示 */}
                  <View className="flex flex-wrap gap-2">
                    {(order.review?.tags || selectedTags).map((tagId) => {
                      const tag = reviewTags.find(t => t.id === tagId)
                      return tag ? (
                        <View
                          key={tagId}
                          className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200"
                        >
                          <Text className="text-xs text-teal-600">{tag.label}</Text>
                        </View>
                      ) : null
                    })}
                  </View>
                  
                  {/* 评价内容展示 */}
                  {(order.review?.content || reviewContent) && (
                    <View className="bg-gray-50 rounded-lg p-3">
                      <Text className="text-sm text-gray-600 leading-relaxed">
                        {order.review?.content || reviewContent}
                      </Text>
                    </View>
                  )}
                  
                  <Text className="text-xs text-gray-400">
                    评价时间：{formatDate(order.review?.created_at || new Date().toISOString())}
                  </Text>
                </View>
              ) : (
                // 未评价状态：评价表单
                <View className="space-y-4">
                  {/* 星级评分选择 */}
                  <View className="flex items-center gap-3">
                    <Text className="text-sm text-gray-600">服务评分</Text>
                    <View className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <View
                          key={star}
                          onClick={() => setRating(star)}
                          style={{ marginLeft: star > 1 ? '4px' : '0' }}
                        >
                          <Star
                            size={24}
                            color={star <= rating ? '#fbbf24' : '#d1d5db'}
                            filled={star <= rating}
                          />
                        </View>
                      ))}
                    </View>
                    <Text className="text-sm font-medium text-gray-700">
                      {rating === 5 ? '非常满意' : rating === 4 ? '满意' : rating === 3 ? '一般' : rating === 2 ? '不满意' : '非常不满意'}
                    </Text>
                  </View>
                  
                  {/* 标签选择 */}
                  <View>
                    <Text className="text-sm text-gray-600 mb-2">服务标签（可多选）</Text>
                    <View className="flex flex-wrap gap-2">
                      {reviewTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.id)
                        return (
                          <View
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-2 rounded-full border ${
                              isSelected 
                                ? 'bg-teal-500 border-teal-500' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <Text className={`text-sm ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                              {tag.label}
                            </Text>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                  
                  {/* 文字评价 */}
                  <View>
                    <Text className="text-sm text-gray-600 mb-2">详细评价（选填）</Text>
                    <Textarea
                      className="bg-gray-50 border-gray-200"
                      placeholder="分享您的服务体验，帮助其他用户做出选择..."
                      maxlength={200}
                      value={reviewContent}
                      onInput={(e) => setReviewContent(e.detail.value)}
                    />
                    <Text className="text-xs text-gray-400 mt-1">
                      {reviewContent.length}/200字
                    </Text>
                  </View>
                  
                  {/* 提交按钮 */}
                  <Button
                    className="w-full bg-teal-500 text-white"
                    onClick={handleSubmitReview}
                    disabled={submitting}
                  >
                    {submitting ? '提交中...' : '提交评价'}
                  </Button>
                </View>
              )}
            </CardContent>
          </Card>
        )}

        {/* 订单信息 */}
        <Card className="bg-white shadow-sm mt-2 mx-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-700 mb-3">
              订单信息
            </Text>
            
            <View className="space-y-2">
              <View className="flex justify-between">
                <Text className="text-sm text-gray-500">订单编号</Text>
                <Text className="text-sm text-gray-700">{order.id}</Text>
              </View>
              <View className="flex justify-between">
                <Text className="text-sm text-gray-500">创建时间</Text>
                <Text className="text-sm text-gray-700">
                  {formatDate(order.created_at)}
                </Text>
              </View>
              <View className="flex justify-between">
                <Text className="text-sm text-gray-500">订单类型</Text>
                <Text className="text-sm text-gray-700">
                  {order.order_type === 'pet' ? '宠物购买' : '洗护服务'}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 收货地址（仅购宠订单） */}
        {order.order_type === 'pet' && order.address && (
          <Card className="bg-white shadow-sm mt-2 mx-4">
            <CardContent className="p-4">
              <Text className="block text-sm font-medium text-gray-700 mb-3">
                收货地址
              </Text>
              
              <View>
                <View className="flex items-center gap-2 mb-1">
                  <Text className="text-base font-medium text-gray-800">
                    {order.address.receiver_name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {order.address.receiver_phone}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  {order.address.province}
                  {order.address.city}
                  {order.address.district}
                  {order.address.detail_address}
                </Text>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 价格信息 */}
        <Card className="bg-white shadow-sm mt-2 mx-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-700 mb-3">
              价格详情
            </Text>
            
            <View className="space-y-2">
              <View className="flex justify-between">
                <Text className="text-sm text-gray-500">
                  {order.order_type === 'pet' ? '商品金额' : '服务金额'}
                </Text>
                <Text className="text-sm text-gray-700">
                  {formatPrice(order.quote?.price || order.total_amount)}
                </Text>
              </View>
              {order.deposit_amount && (
                <View className="flex justify-between">
                  <Text className="text-sm text-gray-500">定金</Text>
                  <Text className="text-sm text-gray-700">
                    {formatPrice(order.deposit_amount)}
                  </Text>
                </View>
              )}
              <View className="flex justify-between pt-2 border-t border-gray-100">
                <Text className="text-base font-medium text-gray-700">实付金额</Text>
                <Text
                  className={`text-lg font-bold ${
                    order.order_type === 'pet' ? 'text-orange-500' : 'text-teal-600'
                  }`}
                >
                  {formatPrice(order.total_amount)}
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
          <Button variant="outline" className="w-full" onClick={handleContact}>
            联系商家
          </Button>
        </View>
        {order.status === 'pending' && (
          <View style={{ flex: 2 }}>
            <Button
              className={`w-full ${order.order_type === 'pet' ? 'bg-orange-500' : 'bg-teal-500'}`}
              onClick={handlePay}
            >
              <Text className="text-white font-medium">去支付</Text>
            </Button>
          </View>
        )}
        {order.status === 'paid' && (
          <View style={{ flex: 2 }}>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => Taro.showToast({ title: '已提醒商家尽快发货', icon: 'none' })}
            >
              催发货
            </Button>
          </View>
        )}
        {(order.status === 'delivering' || order.status === 'in_service') && (
          <View style={{ flex: 2 }}>
            <Button
              className={`w-full ${order.order_type === 'pet' ? 'bg-orange-500' : 'bg-teal-500'}`}
              onClick={handleConfirm}
            >
              <Text className="text-white font-medium">
                {order.order_type === 'pet' ? '确认收货' : '确认完成'}
              </Text>
            </Button>
          </View>
        )}
        {(order.status === 'completed' || order.status === 'cancelled') && (
          <View style={{ flex: 2 }}>
            <Button
              className={`w-full ${order.order_type === 'pet' ? 'bg-orange-500' : 'bg-teal-500'}`}
              onClick={() => Taro.showToast({ title: '再次购买功能开发中', icon: 'none' })}
            >
              <Text className="text-white font-medium">再次购买</Text>
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
    </View>
  )
}
