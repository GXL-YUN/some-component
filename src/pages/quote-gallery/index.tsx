import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Quote {
  id: string
  merchant_name: string
  merchant_avatar?: string
  price: number
  merchant_rating: number
  distance?: number
  description?: string
  pet_type?: string
  breed?: string
  created_at: string
  status?: string // 报价状态：pending-待报价, quoted-报价中, completed-已成交
}

export default function QuoteGalleryPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [statusTab, setStatusTab] = useState('all') // all-全部, completed-已成交

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/quotes',
        method: 'GET'
      })

      if (res.data) {
        setQuotes(res.data)
      }
    } catch (error) {
      console.error('加载报价列表失败:', error)
      // 使用模拟数据
      setQuotes([
        {
          id: '1',
          merchant_name: '萌宠家园',
          price: 3500,
          merchant_rating: 4.9,
          distance: 2.5,
          description: '健康纯种英短蓝猫，已打疫苗，包健康',
          pet_type: 'cat',
          breed: '英短蓝猫',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          merchant_name: '爱心宠物店',
          price: 2800,
          merchant_rating: 4.7,
          distance: 3.2,
          description: '活泼可爱柯基犬，已驱虫疫苗齐全',
          pet_type: 'dog',
          breed: '柯基犬',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          merchant_name: '宠物乐园',
          price: 12000,
          merchant_rating: 5.0,
          distance: 1.8,
          description: '纯种布偶猫，颜值爆表，性格温顺',
          pet_type: 'cat',
          breed: '布偶猫',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          merchant_name: '萌宠世界',
          price: 4500,
          merchant_rating: 4.8,
          distance: 4.1,
          description: '金毛寻回犬，聪明温顺，家庭首选',
          pet_type: 'dog',
          breed: '金毛',
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          merchant_name: '猫咪之家',
          price: 6000,
          merchant_rating: 4.6,
          distance: 2.0,
          description: '美短虎斑猫，活泼好动，身体健康',
          pet_type: 'cat',
          breed: '美短虎斑',
          created_at: new Date().toISOString()
        },
        {
          id: '6',
          merchant_name: '狗狗乐园',
          price: 3500,
          merchant_rating: 4.5,
          distance: 5.5,
          description: '萨摩耶犬，微笑天使，性格活泼',
          pet_type: 'dog',
          breed: '萨摩耶',
          created_at: new Date().toISOString()
        },
        // 已成交的订单
        {
          id: 'order-1',
          merchant_name: '幸福宠物店',
          price: 2800,
          merchant_rating: 4.8,
          distance: 3.0,
          description: '纯种比熊犬，健康活泼，已打疫苗',
          pet_type: 'dog',
          breed: '比熊犬',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 'order-2',
          merchant_name: '萌宠天堂',
          price: 1500,
          merchant_rating: 4.9,
          distance: 1.5,
          description: '可爱橘猫，性格温顺，适合家养',
          pet_type: 'cat',
          breed: '橘猫',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // 报价卡片点击处理
  const handleQuoteClick = async (quoteId: string, status?: string) => {
    // 如果是已成交状态，跳转到订单详情页
    if (status === 'completed') {
      try {
        // 根据报价ID获取关联的订单
        const res = await Network.request({
          url: '/api/orders',
          method: 'GET',
          data: { quote_id: quoteId }
        })
        if (res.data && res.data.length > 0) {
          Taro.navigateTo({ url: `/pages/order-detail/index?orderId=${res.data[0].id}` })
        } else {
          Taro.showToast({ title: '暂无订单信息', icon: 'none' })
        }
      } catch (error) {
        console.error('获取订单信息失败:', error)
        Taro.showToast({ title: '获取订单信息失败', icon: 'none' })
      }
    } else {
      // 非成交状态，跳转到报价详情页
      Taro.navigateTo({ url: `/pages/quote-detail/index?quoteId=${quoteId}` })
    }
  }

  const getPetEmoji = (petType?: string) => {
    if (petType === 'cat') return '🐱'
    if (petType === 'dog') return '🐕'
    return '🐾'
  }

  const getBgColor = (petType?: string) => {
    if (petType === 'cat') return 'bg-gradient-to-br from-pink-100 to-pink-200'
    if (petType === 'dog') return 'bg-gradient-to-br from-orange-100 to-orange-200'
    return 'bg-gradient-to-br from-teal-100 to-teal-200'
  }

  const renderQuoteCard = (quote: Quote) => {
    const imageHeight = Math.floor(Math.random() * 100) + 200 // 随机高度模拟瀑布流效果
    
    return (
      <Card 
        key={quote.id} 
        className="bg-white shadow-sm mb-3 overflow-hidden"
        onClick={() => handleQuoteClick(quote.id, quote.status)}
      >
        <View className="relative">
          {/* 使用渐变背景 + emoji 代替图片 */}
          <View 
            className={`w-full ${getBgColor(quote.pet_type)} flex items-center justify-center`}
            style={{ height: `${imageHeight}px` }}
          >
            <Text className="text-7xl">{getPetEmoji(quote.pet_type)}</Text>
          </View>
          
          {/* 价格标签 */}
          <View 
            className="absolute bottom-0 left-0 right-0 p-3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
          >
            <Text className="text-white text-lg font-bold">
              ¥{quote.price.toLocaleString()}
            </Text>
          </View>
        </View>
        
        <CardContent className="p-3">
          <Text className="block text-sm font-medium text-gray-800 mb-1 line-clamp-2">
            {quote.breed || '宠物'}
          </Text>
          
          <Text className="block text-xs text-gray-500 mb-2 line-clamp-2">
            {quote.description || '暂无描述'}
          </Text>
          
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-1">
              <Text className="text-xs text-orange-500">⭐</Text>
              <Text className="text-xs text-gray-600">{quote.merchant_rating}</Text>
              <Text className="text-xs text-gray-400">·</Text>
              <Text className="text-xs text-gray-500">{quote.merchant_name}</Text>
            </View>
            {quote.distance && (
              <Text className="text-xs text-gray-400">{quote.distance}km</Text>
            )}
          </View>
        </CardContent>
      </Card>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Text className="block text-lg font-semibold text-gray-800 text-center">
          报价大厅
        </Text>
      </View>

      {/* Tab 切换 */}
      <View className="bg-white px-4 py-2 border-b border-gray-100 flex gap-4">
        <View 
          className={`py-2 px-1 ${statusTab === 'all' ? 'border-b-2 border-orange-500' : 'border-b-2 border-transparent'}`}
          onClick={() => setStatusTab('all')}
        >
          <Text className={`block text-sm ${statusTab === 'all' ? 'text-orange-500 font-medium' : 'text-gray-600'}`}>
            全部报价
          </Text>
        </View>
        <View 
          className={`py-2 px-1 ${statusTab === 'completed' ? 'border-b-2 border-orange-500' : 'border-b-2 border-transparent'}`}
          onClick={() => setStatusTab('completed')}
        >
          <Text className={`block text-sm ${statusTab === 'completed' ? 'text-orange-500 font-medium' : 'text-gray-600'}`}>
            已成交订单
          </Text>
        </View>
      </View>

      {/* 根据 Tab 筛选数据 */}
      {(() => {
        const filteredQuotes = statusTab === 'all' 
          ? quotes.filter(q => q.status !== 'completed')
          : quotes.filter(q => q.status === 'completed')
        
        // 瀑布流布局
        const leftColumn: Quote[] = []
        const rightColumn: Quote[] = []
        filteredQuotes.forEach((quote, index) => {
          if (index % 2 === 0) {
            leftColumn.push(quote)
          } else {
            rightColumn.push(quote)
          }
        })
        
        return (
      <ScrollView 
        scrollY 
        className="quote-gallery-scroll"
        style={{ height: 'calc(100vh - 100px)' }}
      >
        {loading ? (
          <View className="flex items-center justify-center py-20">
            <Text className="text-gray-400">加载中...</Text>
          </View>
        ) : filteredQuotes.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="text-4xl mb-3">🐾</Text>
            <Text className="text-gray-400">{statusTab === 'completed' ? '暂无成交订单' : '暂无报价'}</Text>
          </View>
        ) : (
          <View className="flex gap-3 px-3 py-3">
            {/* 左列 */}
            <View className="flex-1">
              {leftColumn.map(quote => renderQuoteCard(quote))}
            </View>
            {/* 右列 */}
            <View className="flex-1">
              {rightColumn.map(quote => renderQuoteCard(quote))}
            </View>
          </View>
        )}
      </ScrollView>
        )
      })()}
    </View>
  )
}
