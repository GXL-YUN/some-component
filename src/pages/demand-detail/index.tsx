import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

// 报价项
interface Quote {
  id: string
  merchant_id: string
  merchant_name: string
  merchant_avatar?: string
  price: number
  merchant_rating: number
  distance?: number
  description?: string
  created_at: string
  status?: string
}

// 需求详情
interface DemandDetail {
  id: string
  pet_type: string
  breed: string
  gender: string
  budget_min: number
  budget_max: number
  status: string
  quotes_count: number
  created_at: string
  color?: string
  age_min?: number
  age_max?: number
  vaccine_required?: boolean
  description?: string
  quotes?: Quote[]
}

export default function DemandDetailPage() {
  const router = useRouter()
  const action = router.params.action
  const demandId = router.params.id
  const isView = action === 'view'
  const isEdit = action === 'edit'

  const [demand, setDemand] = useState<DemandDetail | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    if ((isView || isEdit) && demandId) {
      loadDemandDetail()
      loadQuotes()
    }
  }, [isView, isEdit, demandId])

  const loadDemandDetail = async () => {
    try {
      const res = await Network.request({
        url: `/api/demands/${demandId}`,
        method: 'GET'
      })
      console.log('需求详情响应:', res)
      
      if (res.data) {
        setDemand(res.data)
      }
    } catch (error) {
      console.error('加载需求详情失败:', error)
      // 使用模拟数据
      setDemand({
        id: demandId || '1',
        pet_type: 'cat',
        breed: '英短蓝猫',
        gender: 'male',
        budget_min: 3000,
        budget_max: 5000,
        status: 'pending',
        quotes_count: 3,
        created_at: new Date().toISOString(),
        color: '蓝色',
        vaccine_required: true,
        description: '求购一只健康的英短蓝猫，要求性格温顺，已打疫苗'
      })
    }
  }

  const loadQuotes = async () => {
    try {
      const res = await Network.request({
        url: `/api/quotes/demand/${demandId}`,
        method: 'GET'
      })
      console.log('报价列表响应:', res)
      
      const data = res.data?.data || res.data
      if (Array.isArray(data)) {
        setQuotes(data)
        return
      }
      
      // 使用模拟数据
      setQuotes([
        {
          id: 'q1',
          merchant_id: 'm1',
          merchant_name: '萌宠家园',
          merchant_avatar: '',
          price: 3500,
          merchant_rating: 4.9,
          distance: 2.5,
          description: '健康纯种英短蓝猫，已打疫苗，包健康三个月',
          created_at: new Date().toISOString()
        },
        {
          id: 'q2',
          merchant_id: 'm2',
          merchant_name: '爱心宠物店',
          merchant_avatar: '',
          price: 3200,
          merchant_rating: 4.7,
          distance: 3.2,
          description: '活泼可爱的小猫咪，包健康，可视频看猫',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'q3',
          merchant_id: 'm3',
          merchant_name: '猫咪之家',
          merchant_avatar: '',
          price: 3800,
          merchant_rating: 4.8,
          distance: 1.8,
          description: '血统纯正，可看父母猫，附赠疫苗本',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ])
    } catch (error) {
      console.error('加载报价列表失败:', error)
      setQuotes([])
    }
  }

  const handleEdit = () => {
    Taro.navigateTo({ url: `/pages/demand-detail/index?action=edit&id=${demandId}` })
  }

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      await Network.request({
        url: `/api/quotes/${quoteId}/accept`,
        method: 'POST',
        data: { demand_id: demandId }
      })
      Taro.showToast({ title: '已接受报价', icon: 'success' })
      loadQuotes()
    } catch (error) {
      console.error('接受报价失败:', error)
      Taro.showToast({ title: '操作失败', icon: 'error' })
    }
  }

  const handleViewMerchant = (merchantId: string) => {
    Taro.navigateTo({ url: `/pages/pet-shop-detail/index?merchantId=${merchantId}` })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }> = {
      pending: { variant: 'secondary', label: '待报价' },
      quoted: { variant: 'default', label: '报价中' },
      completed: { variant: 'outline', label: '已成交' },
      expired: { variant: 'outline', label: '已过期' }
    }
    return statusMap[status] || { variant: 'secondary', label: '未知' }
  }

  const getPetEmoji = (petType?: string) => {
    if (petType === 'cat') return '🐱'
    if (petType === 'dog') return '🐕'
    return '🐾'
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else {
      return `${Math.floor(diff / 86400000)}天前`
    }
  }

  // 查看模式
  if (isView && demand) {
    const badge = getStatusBadge(demand.status)
    
    return (
      <View className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <View className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <View 
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => Taro.navigateBack()}
          >
            <Text className="text-lg">←</Text>
          </View>
          <Text className="text-base font-medium text-gray-800">需求详情</Text>
          <View className="w-8 h-8 flex items-center justify-center" onClick={handleEdit}>
            <Text className="text-blue-500 text-sm">编辑</Text>
          </View>
        </View>

        <ScrollView scrollY style={{ height: 'calc(100vh - 50px)' }}>
          <View className="px-4 py-4 pb-20">
            {/* 需求信息卡片 */}
            <Card className="bg-white shadow-sm mb-4">
              <CardContent className="p-4">
                {/* 宠物信息头部 */}
                <View className="flex items-start gap-4 mb-4">
                  <View className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                    demand.pet_type === 'cat' ? 'bg-pink-100' : 'bg-blue-100'
                  }`}
                  ><Text className="text-4xl">{getPetEmoji(demand.pet_type)}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex items-center gap-2 mb-2">
                      <Text className="text-xl font-bold text-gray-800">{demand.breed}</Text>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </View>
                    
                    <View className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Text>{demand.gender === 'male' ? '♂ 公' : '♀ 母'}</Text>
                      {demand.color && (
                        <>
                          <Text className="text-gray-300">·</Text>
                          <Text>{demand.color}</Text>
                        </>
                      )}
                      {demand.age_min && demand.age_max && (
                        <>
                          <Text className="text-gray-300">·</Text>
                          <Text>{demand.age_min}-{demand.age_max}月龄</Text>
                        </>
                      )}
                    </View>
                    
                    <View className="flex items-center gap-2">
                      <Text className="text-lg font-semibold text-orange-500">
                        ¥{demand.budget_min.toLocaleString()}-{demand.budget_max.toLocaleString()}
                      </Text>
                      <Text className="text-sm text-gray-500">预算</Text>
                    </View>
                  </View>
                </View>

                {/* 要求标签 */}
                <View className="flex flex-wrap gap-2 mb-4">
                  {demand.vaccine_required && (
                    <View className="px-3 py-1 rounded-full bg-green-50 border border-green-200">
                      <Text className="text-xs text-green-600">✓ 要求已打疫苗</Text>
                    </View>
                  )}
                  <View className="px-3 py-1 rounded-full bg-gray-50">
                    <Text className="text-xs text-gray-500">发布于 {formatTime(demand.created_at)}</Text>
                  </View>
                </View>

                {/* 详细描述 */}
                {demand.description && (
                  <View className="pt-3 border-t border-gray-100">
                    <Text className="text-sm font-medium text-gray-700 mb-2">详细要求</Text>
                    <Text className="text-sm text-gray-600 leading-relaxed">{demand.description}</Text>
                  </View>
                )}
              </CardContent>
            </Card>

            {/* 报价统计 */}
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-800 mb-3">
                商家报价 ({quotes.length})
              </Text>
            </View>

            {/* 报价列表 */}
            {quotes.length > 0 ? (
              <View className="space-y-3">
                {quotes.map((quote) => (
                  <Card key={quote.id} className="bg-white shadow-sm">
                    <CardContent className="p-4">
                      <View className="flex items-start gap-3">
                        {/* 商家头像 */}
                        <View className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {quote.merchant_avatar ? (
                            <Image src={quote.merchant_avatar} className="w-full h-full" mode="aspectFill" />
                          ) : (
                            <Text className="text-xl">{getPetEmoji(demand.pet_type)}</Text>
                          )}
                        </View>
                        
                        {/* 商家信息 */}
                        <View className="flex-1">
                          <View className="flex items-center justify-between mb-1">
                            <View className="flex items-center gap-2">
                              <Text className="text-sm font-medium text-gray-800">{quote.merchant_name}</Text>
                              <View className="flex items-center gap-0.5">
                                <Text className="text-xs text-orange-500">⭐</Text>
                                <Text className="text-xs text-gray-600">{quote.merchant_rating}</Text>
                              </View>
                            </View>
                            <Text className="text-lg font-bold text-orange-500">
                              ¥{quote.price.toLocaleString()}
                            </Text>
                          </View>
                          
                          <Text className="text-xs text-gray-500 mb-2">{quote.description}</Text>
                          
                          <View className="flex items-center justify-between">
                            <View className="flex items-center gap-2">
                              {quote.distance && (
                                <Text className="text-xs text-gray-400">{quote.distance}km</Text>
                              )}
                              <Text className="text-xs text-gray-400">{formatTime(quote.created_at)}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      
                      {/* 操作按钮 */}
                      {demand.status !== 'completed' && demand.status !== 'expired' && (
                        <View className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-orange-500"
                            onClick={() => handleAcceptQuote(quote.id)}
                          >
                            <Text className="text-white text-sm">接受报价</Text>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewMerchant(quote.merchant_id)}
                          >
                            <Text className="text-sm">查看商家</Text>
                          </Button>
                        </View>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </View>
            ) : (
              <Card className="bg-white shadow-sm">
                <CardContent className="p-8 text-center">
                  <Text className="text-4xl mb-3">📭</Text>
                  <Text className="text-sm text-gray-500">暂无商家报价</Text>
                  <Text className="text-xs text-gray-400 mt-1">请耐心等待，商家会尽快为您报价</Text>
                </CardContent>
              </Card>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }

  // 编辑/创建模式 - 重定向到表单页面
  return (
    <View className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Text className="text-gray-500">加载中...</Text>
    </View>
  )
}
