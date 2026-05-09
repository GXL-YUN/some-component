import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface QuoteDetail {
  id: string
  price: number
  pet_name: string
  pet_gender: string
  pet_age_months: number
  pet_color?: string
  vaccine_status: string
  deworming_status: string
  health_guarantee_days: number
  description?: string
  status: string
  view_count: number
  created_at: string
  photos?: string[]
  vaccine_records?: Array<{
    name: string
    dose: number
    date: string
  }>
  deworming_records?: Array<{
    type: string
    date: string
  }>
  demand_info: {
    id: string
    pet_type: string
    breed: string
    gender: string
    budget_min: number
    budget_max: number
    description?: string
    province?: string
    city?: string
    district?: string
  }
}

export default function MerchantQuoteDetailPage() {
  const router = useRouter()
  const { id } = router.params
  
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadQuoteDetail()
    }
  }, [id])

  const loadQuoteDetail = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/merchant-quotes/${id}`,
        method: 'GET',
      })

      if (res && res.data) {
        setQuote(res.data)
      }
    } catch (error) {
      console.error('加载报价详情失败:', error)
      // 模拟数据
      setQuote({
        id: id || '1',
        price: 4500,
        pet_name: '小蓝',
        pet_gender: '公',
        pet_age_months: 3,
        pet_color: '纯蓝',
        vaccine_status: '已接种',
        deworming_status: '已驱虫',
        health_guarantee_days: 7,
        description: '性格活泼，已打完三针疫苗，健康活泼',
        status: 'active',
        view_count: 12,
        created_at: new Date().toISOString(),
        photos: ['photo1.jpg', 'photo2.jpg'],
        vaccine_records: [
          { name: '猫三联', dose: 3, date: '2024-01-15' },
          { name: '狂犬疫苗', dose: 1, date: '2024-01-20' },
        ],
        deworming_records: [
          { type: '体内驱虫', date: '2024-01-10' },
          { type: '体外驱虫', date: '2024-01-10' },
        ],
        demand_info: {
          id: 'demand-1',
          pet_type: 'cat',
          breed: '英短蓝猫',
          gender: '公',
          budget_min: 3000,
          budget_max: 5000,
          description: '想买一只健康的英短蓝猫',
          province: '北京',
          city: '北京市',
          district: '朝阳区',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-orange-100 text-orange-600">待处理</Badge>
      case 'accepted':
        return <Badge className="bg-green-100 text-green-600">已采纳</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-600">已拒绝</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-600">已撤销</Badge>
      default:
        return null
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }

  const getPetTypeEmoji = (type: string) => {
    return type === 'cat' ? '🐱' : type === 'dog' ? '🐕' : '🐾'
  }

  if (loading || !quote) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="min-h-screen bg-gray-50" scrollY>
      <View className="p-4">
        {/* 报价状态 */}
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-2">
              <View className="flex items-center gap-2">
                <Text className="text-xl">{getPetTypeEmoji(quote.demand_info.pet_type)}</Text>
                <View>
                  <Text className="block text-base font-medium text-gray-800">
                    {quote.pet_name} · {quote.demand_info.breed}
                  </Text>
                  <Text className="block text-xs text-gray-500">
                    报价时间：{formatTime(quote.created_at)}
                  </Text>
                </View>
              </View>
              {getStatusBadge(quote.status)}
            </View>
            <View className="flex items-center justify-between pt-3 border-t border-gray-100">
              <Text className="text-sm text-gray-600">浏览次数</Text>
              <Text className="text-sm font-medium text-gray-800">{quote.view_count} 次</Text>
            </View>
          </CardContent>
        </Card>

        {/* 报价信息 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          报价信息
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <View className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <Text className="text-sm text-gray-600">报价金额</Text>
              <Text className="text-xl font-bold text-orange-500">
                ¥{quote.price}
              </Text>
            </View>

            <View className="flex gap-3 mb-3 pb-3 border-b border-gray-100">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">性别</Text>
                <Text className="text-sm font-medium text-gray-800">{quote.pet_gender}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">月龄</Text>
                <Text className="text-sm font-medium text-gray-800">{quote.pet_age_months}个月</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">花色</Text>
                <Text className="text-sm font-medium text-gray-800">{quote.pet_color || '-'}</Text>
              </View>
            </View>

            {quote.description && (
              <View>
                <Text className="text-xs text-gray-500 mb-1">详细描述</Text>
                <Text className="text-sm text-gray-700">{quote.description}</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* 健康信息 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          健康信息
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            {/* 疫苗记录 */}
            <View className="mb-4 pb-4 border-b border-gray-100">
              <View className="flex items-center justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">疫苗状态</Text>
                <Badge className={quote.vaccine_status === '已接种' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}>
                  {quote.vaccine_status}
                </Badge>
              </View>
              {quote.vaccine_status === '已接种' && quote.vaccine_records && quote.vaccine_records.length > 0 && (
                <View className="bg-gray-50 rounded-lg p-3 mt-2">
                  {quote.vaccine_records.map((record, index) => (
                    <View key={index} className="flex items-center justify-between py-2">
                      <View className="flex items-center gap-2">
                        <Text className="text-sm text-gray-800">{record.name}</Text>
                        <Text className="text-xs text-gray-500">第{record.dose}针</Text>
                      </View>
                      <Text className="text-xs text-gray-500">{record.date}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* 驱虫记录 */}
            <View className="mb-4 pb-4 border-b border-gray-100">
              <View className="flex items-center justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">驱虫状态</Text>
                <Badge className={quote.deworming_status === '已驱虫' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}>
                  {quote.deworming_status}
                </Badge>
              </View>
              {quote.deworming_status === '已驱虫' && quote.deworming_records && quote.deworming_records.length > 0 && (
                <View className="bg-gray-50 rounded-lg p-3 mt-2">
                  {quote.deworming_records.map((record, index) => (
                    <View key={index} className="flex items-center justify-between py-2">
                      <Text className="text-sm text-gray-800">{record.type}</Text>
                      <Text className="text-xs text-gray-500">{record.date}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* 健康保障 */}
            <View className="flex items-center justify-between">
              <Text className="text-sm font-medium text-gray-700">健康保障</Text>
              <Text className="text-sm text-gray-800">{quote.health_guarantee_days} 天</Text>
            </View>
          </CardContent>
        </Card>

        {/* 宠物照片 */}
        {quote.photos && quote.photos.length > 0 && (
          <>
            <Text className="block text-base font-semibold text-gray-800 mb-3">
              宠物照片
            </Text>
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                <View className="flex flex-wrap gap-2">
                  {quote.photos.map((_, index) => (
                    <View 
                      key={index}
                      className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"
                    >
                      <Text className="text-xs text-gray-600">照片{index + 1}</Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          </>
        )}

        {/* 需求信息 */}
        <Text className="block text-base font-semibold text-gray-800 mb-3">
          关联需求
        </Text>

        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <View className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {quote.demand_info.pet_type === 'cat' ? '猫咪' : '狗狗'}
              </Badge>
              <Text className="text-sm font-medium text-gray-800">
                {quote.demand_info.breed}
              </Text>
            </View>
            <Text className="block text-sm text-gray-600 mb-2">
              {quote.demand_info.description}
            </Text>
            <View className="flex items-center gap-4 text-xs text-gray-500">
              <Text>性别：{quote.demand_info.gender}</Text>
              <Text className="text-orange-500 font-bold">
                预算：¥{quote.demand_info.budget_min}-{quote.demand_info.budget_max}
              </Text>
            </View>
            {quote.demand_info.district && (
              <Text className="block text-xs text-gray-500 mt-2">
                📍 {quote.demand_info.province} {quote.demand_info.city} {quote.demand_info.district}
              </Text>
            )}
          </CardContent>
        </Card>

        <View className="h-8" />
      </View>
    </ScrollView>
  )
}
