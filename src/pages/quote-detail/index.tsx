import { View, Text, ScrollView, Swiper, SwiperItem, Video } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Shield, Truck, Play } from 'lucide-react-taro'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface QuoteDetail {
  id: string
  merchant_name: string
  merchant_avatar?: string
  price: number
  merchant_rating: number
  distance?: number
  description?: string
  photos?: string[]
  videos?: string[]
  pet_type?: string
  breed?: string
  vaccine_records?: Array<{
    name: string
    date: string
    dose: number
    total_doses: number
  }>
  deworming_records?: Array<{
    type: string
    date: string
    medicine: string
  }>
  created_at: string
}

// 平台附加服务
interface AddonService {
  id: string
  name: string
  icon: any
  description: string
  details: string[]
  price: number
}

const addonServices: AddonService[] = [
  {
    id: 'health_check',
    name: '宠物购前体检',
    icon: Shield,
    description: '专业兽医全面检查，确保宠物健康',
    details: [
      '传染病筛查（猫瘟、犬瘟等）',
      '寄生虫检测（体内/体外）',
      '心脏及呼吸系统检查',
      '皮肤及五官检查',
      '出具专业健康报告'
    ],
    price: 199
  },
  {
    id: 'safe_transport',
    name: '宠物安心托运',
    description: '专业宠物托运服务，安全送达',
    icon: Truck,
    details: [
      '专业航空箱/托运笼',
      '全程温控运输',
      '实时位置追踪',
      '购买运输保险',
      '专人对接服务'
    ],
    price: 299
  }
]

// 模拟报价详情数据
const mockQuoteDetails: Record<string, QuoteDetail> = {
  // hot-1: 英短蓝猫报价
  'q1-1': {
    id: 'q1-1',
    merchant_name: '萌宠家园',
    price: 3500,
    merchant_rating: 4.9,
    distance: 2.5,
    description: '健康纯种英短蓝猫，已打疫苗，包健康。支持视频看宠，不满意可退款。自家繁育，性格温顺，已经学会使用猫砂。',
    pet_type: 'cat',
    breed: '英短蓝猫',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-15', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-15', dose: 2, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-02-20', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-10', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-10', medicine: '大宠爱' },
      { type: '体内驱虫', date: '2024-02-10', medicine: '拜耳拜宠清' }
    ],
    created_at: new Date().toISOString()
  },
  'q1-2': {
    id: 'q1-2',
    merchant_name: '爱心宠物店',
    price: 3200,
    merchant_rating: 4.7,
    distance: 3.2,
    description: '活泼可爱英短蓝猫，包健康，支持视频看猫。三个月大，已驱虫疫苗齐全，可看父母。',
    pet_type: 'cat',
    breed: '英短蓝猫',
    photos: ['photo1.jpg', 'photo2.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-20', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-20', dose: 2, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-15', medicine: '海乐妙' },
      { type: '体外驱虫', date: '2024-01-15', medicine: '福来恩' }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  'q1-3': {
    id: 'q1-3',
    merchant_name: '猫咪之家',
    price: 3800,
    merchant_rating: 4.8,
    distance: 1.8,
    description: '血统纯正英短蓝猫，可看父母，终身售后。品相极佳，毛色浓密，脸大眼圆。',
    pet_type: 'cat',
    breed: '英短蓝猫',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-10', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-10', dose: 2, total_doses: 3 },
      { name: '猫三联', date: '2024-03-10', dose: 3, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-03-15', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-05', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-05', medicine: '大宠爱' },
      { type: '体内驱虫', date: '2024-02-05', medicine: '拜耳拜宠清' }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  // hot-2: 柯基犬报价
  'q2-1': {
    id: 'q2-1',
    merchant_name: '狗狗乐园',
    price: 6500,
    merchant_rating: 4.8,
    distance: 4.1,
    description: '纯种柯基，已驱虫疫苗，小短腿超可爱。活泼好动，已学会定点大小便。',
    pet_type: 'dog',
    breed: '柯基犬',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '犬四联', date: '2024-01-10', dose: 1, total_doses: 3 },
      { name: '犬四联', date: '2024-02-10', dose: 2, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-02-15', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-05', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-05', medicine: '福来恩' }
    ],
    created_at: new Date().toISOString()
  },
  'q2-2': {
    id: 'q2-2',
    merchant_name: '萌宠世界',
    price: 5800,
    merchant_rating: 4.6,
    distance: 2.0,
    description: '可爱小短腿柯基，性格活泼，母犬优先。三个月大，疫苗齐全。',
    pet_type: 'dog',
    breed: '柯基犬',
    photos: ['photo1.jpg', 'photo2.jpg'],
    vaccine_records: [
      { name: '犬四联', date: '2024-01-15', dose: 1, total_doses: 3 },
      { name: '犬四联', date: '2024-02-15', dose: 2, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-10', medicine: '海乐妙' }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  'q2-3': {
    id: 'q2-3',
    merchant_name: '宠物之家',
    price: 7200,
    merchant_rating: 5.0,
    distance: 5.5,
    description: '赛级血统柯基，品相佳，可办理证书。父亲是冠军犬，遗传基因优秀。',
    pet_type: 'dog',
    breed: '柯基犬',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '犬四联', date: '2024-01-05', dose: 1, total_doses: 3 },
      { name: '犬四联', date: '2024-02-05', dose: 2, total_doses: 3 },
      { name: '犬四联', date: '2024-03-05', dose: 3, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-03-10', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-01', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-01', medicine: '大宠爱' },
      { type: '体内驱虫', date: '2024-02-01', medicine: '拜耳拜宠清' }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  // hot-3: 布偶猫报价
  'q3-1': {
    id: 'q3-1',
    merchant_name: '布偶猫舍',
    price: 11000,
    merchant_rating: 5.0,
    distance: 3.5,
    description: '纯种布偶猫，颜值爆表，性格温顺。海豹双色，眼睛湛蓝，毛量丰富。',
    pet_type: 'cat',
    breed: '布偶猫',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-10', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-10', dose: 2, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-02-15', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-05', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-05', medicine: '大宠爱' }
    ],
    created_at: new Date().toISOString()
  },
  'q3-2': {
    id: 'q3-2',
    merchant_name: '猫咪乐园',
    price: 9500,
    merchant_rating: 4.9,
    distance: 2.8,
    description: '性格温顺布偶猫，已打疫苗，超级粘人。四个月大，已绝育可选。',
    pet_type: 'cat',
    breed: '布偶猫',
    photos: ['photo1.jpg', 'photo2.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-15', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-15', dose: 2, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-10', medicine: '海乐妙' }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  'q3-3': {
    id: 'q3-3',
    merchant_name: '宠物精品店',
    price: 12800,
    merchant_rating: 4.7,
    distance: 6.0,
    description: '赛级品相布偶猫，包健康，血统证书。父母均为冠军猫，品相完美。',
    pet_type: 'cat',
    breed: '布偶猫',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-05', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-05', dose: 2, total_doses: 3 },
      { name: '猫三联', date: '2024-03-05', dose: 3, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-03-10', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-01', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-01', medicine: '大宠爱' }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  // hot-4: 金毛报价
  'q4-1': {
    id: 'q4-1',
    merchant_name: '金毛之家',
    price: 5000,
    merchant_rating: 4.8,
    distance: 3.0,
    description: '聪明温顺金毛，家庭首选。三个月大，已学会坐下握手等指令。',
    pet_type: 'dog',
    breed: '金毛',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '犬四联', date: '2024-01-10', dose: 1, total_doses: 3 },
      { name: '犬四联', date: '2024-02-10', dose: 2, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-05', medicine: '拜耳拜宠清' }
    ],
    created_at: new Date().toISOString()
  },
  'q4-2': {
    id: 'q4-2',
    merchant_name: '萌宠世界',
    price: 4500,
    merchant_rating: 4.6,
    distance: 4.5,
    description: '健康活泼金毛，已驱虫疫苗。性格温顺，适合有小孩的家庭。',
    pet_type: 'dog',
    breed: '金毛',
    photos: ['photo1.jpg', 'photo2.jpg'],
    vaccine_records: [
      { name: '犬四联', date: '2024-01-15', dose: 1, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-10', medicine: '海乐妙' }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  'q4-3': {
    id: 'q4-3',
    merchant_name: '宠物乐园',
    price: 5500,
    merchant_rating: 4.9,
    distance: 2.2,
    description: '血统纯正金毛，可办理证书。父亲是导盲犬血统，聪明听话。',
    pet_type: 'dog',
    breed: '金毛',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '犬四联', date: '2024-01-05', dose: 1, total_doses: 3 },
      { name: '犬四联', date: '2024-02-05', dose: 2, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-02-10', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-01', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-01', medicine: '大宠爱' }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  // hot-5: 美短虎斑报价
  'q5-1': {
    id: 'q5-1',
    merchant_name: '美短猫舍',
    price: 3200,
    merchant_rating: 4.8,
    distance: 1.5,
    description: '活泼好动美短虎斑，身体健康。经典银虎斑纹，品相极佳。',
    pet_type: 'cat',
    breed: '美短虎斑',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-10', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-10', dose: 2, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-05', medicine: '拜耳拜宠清' }
    ],
    created_at: new Date().toISOString()
  },
  'q5-2': {
    id: 'q5-2',
    merchant_name: '猫咪之家',
    price: 2800,
    merchant_rating: 4.7,
    distance: 3.8,
    description: '经典虎斑纹美短，品相好。性格活泼，已学会使用猫砂。',
    pet_type: 'cat',
    breed: '美短虎斑',
    photos: ['photo1.jpg', 'photo2.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-15', dose: 1, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-10', medicine: '海乐妙' }
    ],
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  'q5-3': {
    id: 'q5-3',
    merchant_name: '宠物精品店',
    price: 3600,
    merchant_rating: 4.9,
    distance: 5.0,
    description: '血统纯正美短虎斑，已绝育可选。可办理CFA证书。',
    pet_type: 'cat',
    breed: '美短虎斑',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '猫三联', date: '2024-01-05', dose: 1, total_doses: 3 },
      { name: '猫三联', date: '2024-02-05', dose: 2, total_doses: 3 },
      { name: '狂犬疫苗', date: '2024-02-10', dose: 1, total_doses: 1 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-01', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-01', medicine: '大宠爱' }
    ],
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  // 默认报价详情
  'default': {
    id: 'default',
    merchant_name: '萌宠家园',
    price: 3500,
    merchant_rating: 4.9,
    distance: 2.5,
    description: '健康纯种宠物，已打疫苗，包健康。支持视频看宠，不满意可退款。',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    vaccine_records: [
      { name: '疫苗', date: '2024-01-15', dose: 1, total_doses: 3 },
      { name: '疫苗', date: '2024-02-15', dose: 2, total_doses: 3 }
    ],
    deworming_records: [
      { type: '体内驱虫', date: '2024-01-10', medicine: '拜耳拜宠清' },
      { type: '体外驱虫', date: '2024-01-10', medicine: '大宠爱' }
    ],
    created_at: new Date().toISOString()
  }
}

export default function QuoteDetailPage() {
  const router = useRouter()
  const quoteId = router.params.quoteId
  
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [currentSwiper, setCurrentSwiper] = useState(0)

  // 合并图片和视频为媒体列表
  const mediaList: Array<{ type: 'image' | 'video', url: string }> = []
  if (quote?.videos) {
    quote.videos.forEach(url => mediaList.push({ type: 'video', url }))
  }
  if (quote?.photos) {
    quote.photos.forEach(url => mediaList.push({ type: 'image', url }))
  }

  useEffect(() => {
    if (quoteId) {
      loadQuoteDetail()
    }
  }, [quoteId])

  const loadQuoteDetail = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/quotes/${quoteId}`,
        method: 'GET'
      })

      console.log('报价详情响应:', res)
      
      const data = res.data?.data || res.data
      
      // 检查是否有有效数据
      if (data && Object.keys(data).length > 0 && data.id) {
        setQuote(data)
        return
      }
      
      // 没有有效数据，使用模拟数据
      throw new Error('暂无报价详情数据')
    } catch (error) {
      console.error('加载报价详情失败:', error)
      // 根据 quoteId 加载对应的模拟数据
      const mockData = mockQuoteDetails[quoteId || ''] || mockQuoteDetails['default']
      setQuote(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuote = async () => {
    const totalPrice = calculateTotalPrice()
    const addonNames = Array.from(selectedAddons).map(id => {
      const service = addonServices.find(s => s.id === id)
      return service?.name
    }).filter(Boolean).join('、')
    
    const result = await Taro.showModal({
      title: '确认接受报价',
      content: `确定接受报价 ¥${totalPrice.toLocaleString()} 吗？${addonNames ? `\n已选附加服务：${addonNames}` : ''}`
    })

    if (result.confirm) {
      try {
        const testUserId = 'test-user-001'
        
        // 创建订单
        const res = await Network.request({
          url: '/api/orders',
          method: 'POST',
          data: {
            user_id: testUserId,
            quote_id: quoteId,
            order_type: 'pet',
            total_amount: totalPrice,
            deposit_amount: 0
          }
        })
        
        Taro.showToast({ title: '已接受报价', icon: 'success' })
        
        // 跳转到订单详情页面
        const orderId = res.data?.data?.id || res.data?.id
        setTimeout(() => {
          if (orderId) {
            Taro.navigateTo({ 
              url: `/pages/order-detail/index?orderId=${orderId}`
            })
          } else {
            Taro.switchTab({ url: '/pages/profile/index' })
          }
        }, 1500)
      } catch (error) {
        console.error('接受报价失败:', error)
        Taro.showToast({ title: '操作失败', icon: 'error' })
      }
    }
  }

  const handleContact = () => {
    Taro.navigateTo({ 
      url: `/pages/chat/index?merchantId=${quote?.merchant_name}&quoteId=${quoteId}` 
    })
  }

  const handlePreviewImage = (url: string) => {
    // 只预览图片，过滤掉视频
    const imageUrls = mediaList
      .filter(m => m.type === 'image')
      .map(m => m.url)
    
    Taro.previewImage({
      current: url,
      urls: imageUrls
    })
  }

  // 计算附加服务费用
  const calculateAddonPrice = () => {
    let addonPrice = 0
    selectedAddons.forEach(addonId => {
      const service = addonServices.find(s => s.id === addonId)
      if (service) {
        addonPrice += service.price
      }
    })
    return addonPrice
  }

  // 计算总价
  const calculateTotalPrice = () => {
    const basePrice = quote?.price || 0
    const addonPrice = calculateAddonPrice()
    return basePrice + addonPrice
  }

  // 切换附加服务勾选状态
  const handleToggleAddon = (addonId: string) => {
    const newSelected = new Set(selectedAddons)
    if (newSelected.has(addonId)) {
      newSelected.delete(addonId)
    } else {
      newSelected.add(addonId)
    }
    setSelectedAddons(newSelected)
  }

  const getPetEmoji = (petType?: string) => {
    if (petType === 'cat') return '🐱'
    if (petType === 'dog') return '🐕'
    return '🐾'
  }

  if (loading || !quote) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-sm text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="pb-24">
        {/* 品种信息头部 */}
        {quote.breed && (
          <View className="bg-gradient-to-r from-orange-500 to-teal-500 px-4 py-3">
            <View className="flex items-center gap-3">
              <Text className="text-3xl">{getPetEmoji(quote.pet_type)}</Text>
              <View>
                <Text className="block text-white font-semibold text-lg">{quote.breed}</Text>
                <Text className="block text-white text-xs opacity-80">商家报价详情</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* 宠物照片/视频轮播 */}
        {mediaList.length > 0 && (
          <View className="bg-white relative">
            <Swiper
              className="w-full h-72"
              indicatorDots={false}
              autoplay={false}
              circular
              onChange={(e) => setCurrentSwiper(e.detail.current)}
            >
              {mediaList.map((media, index) => (
                <SwiperItem key={index}>
                  <View 
                    className="w-full h-full bg-gray-100 flex items-center justify-center"
                    onClick={() => {
                      if (media.type === 'image') {
                        handlePreviewImage(media.url)
                      }
                    }}
                  >
                    {media.type === 'video' ? (
                      <View className="w-full h-full relative">
                        <Video
                          src={media.url}
                          className="w-full h-full"
                          controls
                          showFullscreenBtn
                          showPlayBtn
                          showCenterPlayBtn
                          objectFit="cover"
                        />
                        {/* 视频标识 */}
                        <View className="absolute top-2 right-2 bg-black rounded px-2 py-1" style={{ opacity: 0.5 }}>
                          <Text className="text-white text-xs flex items-center gap-1">
                            <Play size={12} color="#fff" /> 视频
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="w-full h-full flex items-center justify-center">
                        <Text className="text-gray-400">宠物照片 {index + 1}</Text>
                      </View>
                    )}
                  </View>
                </SwiperItem>
              ))}
            </Swiper>
            
            {/* 自定义指示器 */}
            <View className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1">
              {mediaList.map((_, index) => (
                <View
                  key={index}
                  className={`rounded-full transition-all ${
                    currentSwiper === index ? 'bg-orange-500' : 'bg-white'
                  }`}
                  style={{ 
                    width: currentSwiper === index ? '16px' : '6px',
                    height: '6px',
                    opacity: currentSwiper === index ? 1 : 0.6
                  }}
                />
              ))}
            </View>
            
            {/* 计数器 */}
            <View className="absolute bottom-3 right-3 bg-black rounded-full px-2 py-1" style={{ opacity: 0.5 }}>
              <Text className="text-white text-xs">{currentSwiper + 1} / {mediaList.length}</Text>
            </View>
            
            {/* 视频/图片数量标识 */}
            <View className="absolute top-3 left-3 flex gap-2">
              {quote?.videos && quote.videos.length > 0 && (
                <View className="bg-black rounded-full px-2 py-1 flex items-center gap-1" style={{ opacity: 0.5 }}>
                  <Play size={12} color="#fff" />
                  <Text className="text-white text-xs">{quote.videos.length} 视频</Text>
                </View>
              )}
              {quote?.photos && quote.photos.length > 0 && (
                <View className="bg-black rounded-full px-2 py-1" style={{ opacity: 0.5 }}>
                  <Text className="text-white text-xs">{quote.photos.length} 图片</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* 商家信息 */}
        <Card className="bg-white shadow-sm mt-2">
          <CardContent className="p-4">
            <View className="flex items-center gap-3">
              <View
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  quote.pet_type === 'cat' ? 'bg-gradient-to-br from-pink-100 to-pink-200' : 
                  quote.pet_type === 'dog' ? 'bg-gradient-to-br from-orange-100 to-orange-200' :
                  'bg-gradient-to-br from-orange-100 to-teal-100'
                }`}
              >
                <Text className="text-2xl">{getPetEmoji(quote.pet_type)}</Text>
              </View>
              <View className="flex-1">
                <View className="flex items-center gap-2">
                  <Text className="block text-base font-medium text-gray-800">
                    {quote.merchant_name}
                  </Text>
                  {quote.merchant_rating >= 4.8 && (
                    <Badge variant="default" className="text-xs">优质商家</Badge>
                  )}
                </View>
                <View className="flex items-center gap-2 mt-1">
                  <View className="flex items-center gap-1">
                    <Text className="text-sm text-orange-500">⭐</Text>
                    <Text className="text-sm font-medium text-gray-700">
                      {quote.merchant_rating}
                    </Text>
                  </View>
                  {quote.distance && (
                    <>
                      <Text className="text-xs text-gray-400">|</Text>
                      <Text className="text-sm text-gray-500">
                        距离 {quote.distance}km
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <Button size="sm" variant="outline" onClick={handleContact}>
                在线咨询
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* 报价信息 */}
        <Card className="bg-white shadow-sm mt-2">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-700 mb-3">
              报价详情
            </Text>
            
            <View className="flex items-center justify-between mb-3">
              <Text className="text-sm text-gray-600">报价金额</Text>
              <Text className="text-2xl font-bold text-orange-500">
                ¥{quote.price.toLocaleString()}
              </Text>
            </View>
            
            {/* 价格说明 */}
            <View className="mb-3 py-2 px-3 bg-orange-50 rounded-lg">
              <Text className="text-xs text-gray-500">
                注：此价格不包含宠物托运费用
              </Text>
            </View>
            
            {quote.description && (
              <>
                <Separator className="my-3" />
                <Text className="block text-sm text-gray-700">
                  {quote.description}
                </Text>
              </>
            )}
          </CardContent>
        </Card>

        {/* 健康证明 */}
        <Card className="bg-white shadow-sm mt-2">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-700 mb-3">
              健康证明
            </Text>
            
            {/* 疫苗记录 */}
            {quote.vaccine_records && quote.vaccine_records.length > 0 && (
              <View className="mb-4">
                <View className="flex items-center gap-2 mb-3">
                  <Text className="text-sm text-gray-600">疫苗记录</Text>
                  <Badge variant="secondary" className="text-xs">
                    已接种 {quote.vaccine_records.length} 针
                  </Badge>
                </View>
                <View className="space-y-2">
                  {quote.vaccine_records.map((record, index) => (
                    <View 
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <View className="flex items-center gap-2">
                        <Text className="text-sm font-medium text-gray-700">{record.name}</Text>
                        <Badge variant="outline" className="text-xs">
                          第{record.dose}/{record.total_doses}针
                        </Badge>
                      </View>
                      <Text className="text-xs text-gray-500">{record.date}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* 驱虫记录 */}
            {quote.deworming_records && quote.deworming_records.length > 0 && (
              <View>
                <View className="flex items-center gap-2 mb-3">
                  <Text className="text-sm text-gray-600">驱虫记录</Text>
                  <Badge variant="default" className="text-xs">定期驱虫</Badge>
                </View>
                <View className="space-y-2">
                  {quote.deworming_records.map((record, index) => (
                    <View 
                      key={index}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <View className="flex-1">
                        <View className="flex items-center gap-2 mb-1">
                          <Text className="text-sm font-medium text-gray-700">{record.type}</Text>
                          <Text className="text-xs text-gray-500">{record.medicine}</Text>
                        </View>
                      </View>
                      <Text className="text-xs text-gray-500">{record.date}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 平台附加服务 */}
        <Card className="bg-white shadow-sm mt-2">
          <CardContent className="p-4">
            <View className="flex items-center gap-2 mb-4">
              <Text className="block text-sm font-medium text-gray-700">
                平台附加服务
              </Text>
              <Badge variant="secondary" className="text-xs">可选</Badge>
            </View>

            <View className="space-y-3">
              {addonServices.map((service) => {
                const isSelected = selectedAddons.has(service.id)
                const IconComponent = service.icon
                
                return (
                  <View 
                    key={service.id}
                    className={`border-2 rounded-lg p-3 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                  >
                    <View className="flex items-start gap-3">
                      {/* 勾选框 */}
                      <View className="pt-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleAddon(service.id)}
                        />
                      </View>
                      
                      {/* 服务信息 */}
                      <View className="flex-1">
                        <View className="flex items-center gap-2 mb-1">
                          <IconComponent size={16} color={isSelected ? '#ff6b35' : '#6b7280'} />
                          <Text className={`text-sm font-medium ${isSelected ? 'text-orange-600' : 'text-gray-700'}`}>
                            {service.name}
                          </Text>
                        </View>
                        <Text className="text-xs text-gray-500 mb-2">
                          {service.description}
                        </Text>
                      
                        {/* 详情列表 */}
                        <View className="space-y-1 mb-2">
                          {service.details.map((detail, idx) => (
                            <View key={idx} className="flex items-center gap-1">
                              <Text className="text-xs text-gray-400">•</Text>
                              <Text className="text-xs text-gray-600">{detail}</Text>
                            </View>
                          ))}
                        </View>
                        
                        {/* 价格 */}
                        <Text className="text-sm font-bold text-orange-500">
                          ¥{service.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>

            {/* 附加服务费用统计 */}
            {selectedAddons.size > 0 && (
              <View className="mt-4 pt-3 border-t border-gray-200">
                <View className="flex items-center justify-between">
                  <Text className="text-sm text-gray-600">附加服务费</Text>
                  <Text className="text-sm font-medium text-orange-500">
                    +¥{calculateAddonPrice().toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 服务保障 */}
        <Card className="bg-white shadow-sm mt-2">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-700 mb-4">
              服务保障
            </Text>
            
            {/* 商家保障 */}
            <View className="mb-4">
              <Text className="text-xs text-gray-500 mb-2">商家保障</Text>
              <View className="flex items-start gap-2 py-2 px-3 bg-orange-50 rounded-lg">
                <View className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Text className="text-xs text-white">✓</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700">健康保障</Text>
                  <Text className="text-xs text-gray-500 mt-1">3个月细小、狗瘟保障</Text>
                </View>
              </View>
            </View>
            
            {/* 平台保障 */}
            <View>
              <Text className="text-xs text-gray-500 mb-2">平台保障</Text>
              <View className="space-y-2">
                {/* 购前体检保障 */}
                <View
                  className={`flex items-start gap-2 py-2 px-3 rounded-lg ${selectedAddons.has('health_check') ? 'bg-teal-50' : 'bg-gray-50'}`}
                >
                  <View
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${selectedAddons.has('health_check') ? 'bg-teal-500' : 'bg-gray-300'}`}
                  >
                    <Text className="text-xs text-white">✓</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-medium ${selectedAddons.has('health_check') ? 'text-gray-700' : 'text-gray-400'}`}
                    >
                      健康保障（升级）
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${selectedAddons.has('health_check') ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      {selectedAddons.has('health_check') 
                        ? '6个月细小、狗瘟保障' 
                        : '勾选"宠物购前体检"可享6个月保障'}
                    </Text>
                  </View>
                </View>
                
                {/* 托运保障 */}
                <View
                  className={`flex items-start gap-2 py-2 px-3 rounded-lg ${selectedAddons.has('safe_transport') ? 'bg-teal-50' : 'bg-gray-50'}`}
                >
                  <View
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${selectedAddons.has('safe_transport') ? 'bg-teal-500' : 'bg-gray-300'}`}
                  >
                    <Text className="text-xs text-white">✓</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-medium ${selectedAddons.has('safe_transport') ? 'text-gray-700' : 'text-gray-400'}`}
                    >
                      托运保障
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${selectedAddons.has('safe_transport') ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                      {selectedAddons.has('safe_transport') 
                        ? '宠物安全健康送达' 
                        : '勾选"宠物安心托运"可享托运保障'}
                    </Text>
                  </View>
                </View>
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
            在线咨询
          </Button>
        </View>
        <View style={{ flex: 2 }}>
          <View className="mb-1">
            <View className="flex items-baseline justify-center gap-1">
              <Text className="text-xs text-gray-500">
                {selectedAddons.size > 0 ? `含${selectedAddons.size}项服务` : '接受报价'}
              </Text>
              <Text className="text-xl font-bold text-orange-500">
                ¥{calculateTotalPrice().toLocaleString()}
              </Text>
            </View>
          </View>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600" 
            onClick={handleAcceptQuote}
          >
            <Text className="text-white font-medium">立即购买</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}
